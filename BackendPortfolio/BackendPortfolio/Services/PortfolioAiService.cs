using System.Text.Json;
using BackendPortfolio.DTO;
using BackendPortfolio.Models;
using BackendPortfolio.Repositories;
using BackendPortfolio.Repositories.Collaborator;
using static BackendPortfolio.DTO.CollaboratorDtos;

namespace BackendPortfolio.Services
{
    public interface IPortfolioAiService
    {
        Task<ChatResponseDto> ChatAsync(
            ChatRequestDto request,
            Collaborator collab,
            Portfolio portfolio,
            IPortfolioRepository portfolioRepo,
            ICollaboratorRepository collabRepo);
    }

    public class PortfolioAiService : IPortfolioAiService
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;
        private readonly string _model;

        public PortfolioAiService(IHttpClientFactory factory, IConfiguration config)
        {
            _http = factory.CreateClient("Gemini");
            _apiKey = config["Gemini:ApiKey"]!;
            _model = config["Gemini:Model"] ?? "gemini-2.5-flash";
        }

        private async Task<string> CallGeminiAsync(string prompt, int maxTokens = 2000)
        {
            var url = $"models/{_model}:generateContent?key={_apiKey}";
            var body = new
            {
                contents = new[] { new { parts = new[] { new { text = prompt } } } },
                generationConfig = new { maxOutputTokens = maxTokens, temperature = 0.3 }
            };

            for (int attempt = 0; attempt < 3; attempt++)
            {
                if (attempt > 0) await Task.Delay(attempt * 3000);

                var response = await _http.PostAsJsonAsync(url, body);

                if (response.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable ||
                    response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    if (attempt == 2) throw new InvalidOperationException("Gemini indisponible.");
                    continue;
                }

                response.EnsureSuccessStatusCode();
                var result = await response.Content.ReadFromJsonAsync<GeminiResponse>();
                return result?.Candidates?[0]?.Content?.Parts?[0]?.Text ?? "";
            }

            throw new InvalidOperationException("Gemini: nombre max de tentatives atteint.");
        }

        public async Task<ChatResponseDto> ChatAsync(
            ChatRequestDto request,
            Collaborator collab,
            Portfolio portfolio,
            IPortfolioRepository portfolioRepo,
            ICollaboratorRepository collabRepo)
        {
            var collabContext = BuildCollaboratorContext(collab, portfolio);
            var history = string.Join("\n", request.Messages.Select(m =>
                $"{(m.Role == "user" ? "Utilisateur" : "Assistant")}: {m.Content}"));

            var systemPrompt = $@"
Tu es un assistant qui gère le portfolio professionnel d'un collaborateur.
Tu as accès à TOUTES ses données et tu peux modifier la sélection du portfolio.

{collabContext}

PORTFOLIO ACTUEL (id={portfolio.PortfolioId}) : ""{portfolio.Title}""
Skills visibles : {string.Join(", ",
    portfolio.PortfolioSkills
        .Where(s => s.IsVisible)
        .Select(s => s.CollabSkill?.Skill?.Name ?? "?"))}
Expériences visibles : {portfolio.PortfolioExperiences.Count(e => e.IsVisible)}
Projets visibles : {portfolio.PortfolioProjects.Count(p => p.IsVisible)}
Certifications visibles : {portfolio.PortfolioCertifications.Count(c => c.IsVisible)}
Formations visibles : {portfolio.PortfolioEducations.Count(e => e.IsVisible)}
Bio actuelle : ""{collab.Bio}""

TU PEUX :
1. Répondre aux questions sur le profil du collaborateur
2. Modifier la SÉLECTION du portfolio (quoi afficher) en retournant une action JSON
3. Activer/désactiver des éléments spécifiques par leur id
TU PEUX AUSSI :
4. Rédiger ou améliorer la bio du collaborateur (grammaire, équilibre, ton professionnel)

RÈGLE ABSOLUE : Réponds TOUJOURS en JSON pur, sans markdown, sans texte avant ou après.

FORMAT DE RÉPONSE :
{{
  ""message"": ""ta réponse en langage naturel"",
  ""isComplete"": false,
  ""action"": null
}}

Si tu modifies des items du portfolio (skills, expériences, etc.) :
{{
  ""message"": ""J'ai mis à jour les skills affichés"",
  ""isComplete"": false,
  ""action"": {{
    ""type"": ""set_skills"",
    ""value"": null,
    ""items"": [
      {{""id"": 5, ""isVisible"": true, ""displayOrder"": 1}},
      {{""id"": 8, ""isVisible"": false, ""displayOrder"": 0}}
    ]
  }}
}}

Si tu modifies ou améliores la bio du collaborateur :
{{
  ""message"": ""Voici ta bio raccourcie et corrigée."",
  ""isComplete"": false,
  ""action"": {{
    ""type"": ""update_bio"",
    ""value"": ""Le nouveau texte de la bio ici."",
    ""items"": null
  }}
}}

Types d'action possibles : set_skills | set_experiences | set_projects | set_certifications | set_education | update_bio | update_profile";

            var text = await CallGeminiAsync($"{systemPrompt}\n\nConversation:\n{history}", 1500);
            text = CleanJson(text);

            Console.WriteLine("=== GEMINI RAW RESPONSE ===");
            Console.WriteLine(text);
            Console.WriteLine("===========================");


            try
            {
                var parsed = JsonSerializer.Deserialize<GeminiChatResponse>(text,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (parsed == null) return new ChatResponseDto("Erreur de parsing.", false);

                if (parsed.Action != null)
                    await ApplyActionAsync(portfolio.PortfolioId, parsed.Action, portfolioRepo , collab.CollaboratorId, 
                collabRepo);

                return new ChatResponseDto(parsed.Message ?? "", parsed.IsComplete, parsed.Action);
            }
            catch (Exception ex)
            {
                Console.WriteLine("=== PARSE ERROR ===");
                Console.WriteLine(ex.Message);
                Console.WriteLine("===================");
                return new ChatResponseDto("Je n'ai pas pu traiter ta demande. Reformule stp.", false);
            }

        }

        private async Task ApplyActionAsync(int portfolioId, GeminiAction action, IPortfolioRepository repo ,int collaboratorId,
    ICollaboratorRepository collabRepo)
        {
            var items = action.Items?.Select(i => new PortfolioItemDto
            {
                Id = i.Id,
                IsVisible = i.IsVisible,
                DisplayOrder = i.DisplayOrder
            }).ToList() ?? new List<PortfolioItemDto>();

            switch (action.Type)
            {
                case "set_skills": await repo.SetSkillsAsync(portfolioId, items); break;
                case "set_experiences": await repo.SetExperiencesAsync(portfolioId, items); break;
                case "set_projects": await repo.SetProjectsAsync(portfolioId, items); break;
                case "set_certifications": await repo.SetCertificationsAsync(portfolioId, items); break;
                case "set_education": await repo.SetEducationsAsync(portfolioId, items); break;
                case "update_bio":
                    if (!string.IsNullOrWhiteSpace(action.Value))
                        await collabRepo.UpdateBioAsync(collaboratorId, action.Value);
                    break;
            }
        }

        private static string BuildCollaboratorContext(Collaborator collab, Portfolio portfolio)
        {
            var sb = new System.Text.StringBuilder();
            sb.AppendLine("=== PROFIL COMPLET DU COLLABORATEUR ===");
            sb.AppendLine($"Nom : {collab.User?.FirstName} {collab.User?.LastName}");
            sb.AppendLine($"Poste : {collab.JobTitle}");
            sb.AppendLine($"Bio : {collab.Bio}");
            sb.AppendLine($"Années d'expérience : {collab.YearsExperience}");
            sb.AppendLine($"Disponibilité : {collab.AvailabilityStatus}");

            // ← CollaboratorSkills (pas Skills)
            sb.AppendLine($"\n=== SKILLS ({collab.CollaboratorSkills.Count}) ===");
            foreach (var s in collab.CollaboratorSkills)
                sb.AppendLine($"  [id={s.CollabSkillId}] {s.Skill?.Name} | {s.Level} | {s.YearsUsed} an(s){(s.IsPrimary ? " ★" : "")}");

            sb.AppendLine($"\n=== EXPÉRIENCES ({collab.Experiences.Count}) ===");
            foreach (var e in collab.Experiences.OrderByDescending(e => e.StartDate))
                sb.AppendLine($"  [id={e.ExperienceId}] {e.JobTitle} chez {e.CompanyName} ({e.StartDate:MM/yyyy} → {(e.IsCurrent ? "Présent" : e.EndDate?.ToString("MM/yyyy"))})");

            sb.AppendLine($"\n=== PROJETS ({collab.Projects.Count}) ===");
            foreach (var p in collab.Projects)
                sb.AppendLine($"  [id={p.ProjectId}] {p.Title} | {p.Technologies}");

            sb.AppendLine($"\n=== CERTIFICATIONS ({collab.Certifications.Count}) ===");
            foreach (var c in collab.Certifications)
                sb.AppendLine($"  [id={c.CertificationId}] {c.Name} | {c.Issuer} | Score: {c.Score}");

            sb.AppendLine($"\n=== FORMATIONS ({collab.Educations.Count}) ===");
            foreach (var ed in collab.Educations)
                sb.AppendLine($"  [id={ed.EducationId}] {ed.Degree} en {ed.Field} — {ed.School}");

            return sb.ToString();
        }

        private static string CleanJson(string text)
        {
            text = text.Trim();
            if (text.StartsWith("```json")) text = text[7..];
            else if (text.StartsWith("```")) text = text[3..];
            if (text.EndsWith("```")) text = text[..^3];
            return text.Trim();
        }
    }

    public class GeminiResponse { public List<GeminiCandidate>? Candidates { get; set; } }
    public class GeminiCandidate { public GeminiContent? Content { get; set; } }
    public class GeminiContent { public List<GeminiPart>? Parts { get; set; } }
    public class GeminiPart { public string? Text { get; set; } }

    public class GeminiChatResponse
    {
        public string? Message { get; set; }
        public bool IsComplete { get; set; }
        public GeminiAction? Action { get; set; }
    }

    public class GeminiAction
    {
        public string? Type { get; set; }
        public List<GeminiActionItem>? Items { get; set; }
        public string? Value { get; set; }
    }

    public class GeminiActionItem
    {
        public int Id { get; set; }
        public bool IsVisible { get; set; }
        public int DisplayOrder { get; set; }
    }
}