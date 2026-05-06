using System.Text.Json;
using System.Text.RegularExpressions;
using BackendPortfolio.DTO;
using BackendPortfolio.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendPortfolio.Services
{
    public interface IManagerBatchSwitchService
    {
        Task<ManagerDtos.BatchSwitchResponseDto> BatchSwitchAsync(
            int managerId,
            ManagerDtos.BatchSwitchRequestDto request);
    }

    public class ManagerBatchSwitchService : IManagerBatchSwitchService
    {
        private readonly IDbContextFactory<VitrineDbContext> _factory;
        private readonly HttpClient _http;
        private readonly string _apiKey;
        private readonly string _model;
        private readonly ILogger<ManagerBatchSwitchService> _logger;

        public ManagerBatchSwitchService(
            IDbContextFactory<VitrineDbContext> factory,
            IHttpClientFactory httpFactory,
            IConfiguration config,
            ILogger<ManagerBatchSwitchService> logger)
        {
            _factory = factory;
            _http = httpFactory.CreateClient("Gemini");
            _apiKey = config["Gemini:ApiKey"]!;
            _model = config["Gemini:Model"] ?? "gemini-2.5-flash";
            _logger = logger;
        }

        // ── Nettoie une chaîne pour l'utiliser dans un slug URL-safe ──
        // "Node.js / Express" → "nodejs-express"
        // "React.js"          → "reactjs"
        // "Vue 3"             → "vue-3"
        private static string Slugify(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return "tech";

            var slug = input.ToLower();

            // Supprime les points collés à des lettres/chiffres (node.js → nodejs)
            slug = Regex.Replace(slug, @"\.(?=[a-z0-9])", "");

            // Remplace tout caractère non alphanumérique par un tiret
            slug = Regex.Replace(slug, @"[^a-z0-9]+", "-");

            // Supprime les tirets en début et fin
            slug = slug.Trim('-');

            return slug;
        }

        public async Task<ManagerDtos.BatchSwitchResponseDto> BatchSwitchAsync(
            int managerId,
            ManagerDtos.BatchSwitchRequestDto request)
        {
            await using var db = await _factory.CreateDbContextAsync();

            // ── 1. Charge portfolios avec TOUTES les données du collab ──
            var portfolios = await db.Portfolios
                .AsNoTracking()
                .AsSplitQuery()
                .Include(p => p.Collaborator).ThenInclude(c => c.User)
                .Include(p => p.Collaborator).ThenInclude(c => c.CollaboratorSkills)
                    .ThenInclude(cs => cs.Skill)
                .Include(p => p.Collaborator).ThenInclude(c => c.Projects)
                .Include(p => p.Collaborator).ThenInclude(c => c.Experiences)
                .Include(p => p.Collaborator).ThenInclude(c => c.Certifications)
                .Where(p => request.PortfolioIds.Contains(p.PortfolioId))
                .ToListAsync();

            if (!portfolios.Any())
                return new ManagerDtos.BatchSwitchResponseDto(
                    request.TargetTech, request.MissionContext, 0, 0, 0, new());

            // ── 2. Pré-score LOCAL (sans IA = économise quota) ──────────
            var aiPayload = portfolios.Select(p =>
                BuildAiPayload(p, request.TargetTech)).ToList();

            // ── 3. Appel Gemini (1 seul appel pour tout le batch) ───────
            var aiResults = await CallGeminiBatchAsync(
                aiPayload, request.TargetTech, request.MissionContext);

            // ── 4. Upsert BDD + construction réponse ────────────────────
            var resultItems = new List<ManagerDtos.BatchSwitchResultItemDto>();
            // ✅ Slug de la tech nettoyé une seule fois pour tout le batch
            var techSlug = Slugify(request.TargetTech);

            // ✅ targetTech normalisé (lowercase) pour la BDD
            var targetTechNormalized = request.TargetTech.ToLower();

            foreach (var portfolio in portfolios)
            {
                var aiItem = aiResults.FirstOrDefault(r => r.Id == portfolio.PortfolioId);

                if (aiItem == null)
                {
                    resultItems.Add(new ManagerDtos.BatchSwitchResultItemDto(
                        portfolio.PortfolioId,
                        portfolio.CollaboratorId,
                        $"{portfolio.Collaborator.User?.FirstName} {portfolio.Collaborator.User?.LastName}",
                        portfolio.Collaborator.JobTitle ?? "",
                        request.TargetTech,
                        "", "", new(), 0, "", null, "error"));
                    continue;
                }

                // ✅ Slug propre : "view-nodejs-express-dalinda-1eca77"
                var firstNameSlug = Slugify(portfolio.Collaborator.User?.FirstName ?? "collab");
                var shareSlug = $"view-{techSlug}-{firstNameSlug}-{Guid.NewGuid().ToString("N")[..6]}";

                // Sérialise les IDs sélectionnés par l'IA
                var projectIdsJson = JsonSerializer.Serialize(aiItem.ProjectIds);
                var skillIdsJson = JsonSerializer.Serialize(aiItem.SkillIds);
                var expIdsJson = JsonSerializer.Serialize(aiItem.ExperienceIds);
                var certIdsJson = JsonSerializer.Serialize(aiItem.CertificationIds);
                var skillsJson = JsonSerializer.Serialize(aiItem.TransferableSkillNames);

                // Upsert
                var existing = await db.ManagerPortfolioViews.FirstOrDefaultAsync(v =>
                    v.PortfolioId == portfolio.PortfolioId &&
                    v.ManagerId == managerId &&
                    v.TargetTech == request.TargetTech.ToLower());

                if (existing != null)
                {
                    existing.GeneratedTitle = aiItem.Title;
                    existing.GeneratedBio = aiItem.Bio;
                    existing.TransferableSkillsJson = skillsJson;
                    existing.MissionContext = request.MissionContext;
                    existing.Status = "ready";
                    existing.SelectedProjectIdsJson = projectIdsJson;
                    existing.SelectedSkillIdsJson = skillIdsJson;
                    existing.SelectedExperienceIdsJson = expIdsJson;
                    existing.SelectedCertificationIdsJson = certIdsJson;
                    existing.RelevanceScore = aiItem.RelevanceScore;
                    // Garde l'ancien slug pour ne pas casser les liens déjà partagés
                    existing.PublicShareSlug ??= shareSlug;
                    existing.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    db.ManagerPortfolioViews.Add(new ManagerPortfolioView
                    {
                        PortfolioId = portfolio.PortfolioId,
                        ManagerId = managerId,
                        TargetTech = request.TargetTech.ToLower(),
                        GeneratedTitle = aiItem.Title,
                        GeneratedBio = aiItem.Bio,
                        TransferableSkillsJson = skillsJson,
                        MissionContext = request.MissionContext,
                        Status = "ready",
                        SelectedProjectIdsJson = projectIdsJson,
                        SelectedSkillIdsJson = skillIdsJson,
                        SelectedExperienceIdsJson = expIdsJson,
                        SelectedCertificationIdsJson = certIdsJson,
                        RelevanceScore = aiItem.RelevanceScore,
                        PublicShareSlug = shareSlug,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
                int savedViewId = existing?.ViewId ?? db.ManagerPortfolioViews
    .Where(v => v.PublicShareSlug == shareSlug)
    .Select(v => v.ViewId)
    .First();
                resultItems.Add(new ManagerDtos.BatchSwitchResultItemDto(
                    portfolio.PortfolioId,
                    portfolio.CollaboratorId,
                    $"{portfolio.Collaborator.User?.FirstName} {portfolio.Collaborator.User?.LastName}",
                    portfolio.Collaborator.JobTitle ?? "",
                    request.TargetTech,
                    aiItem.Title,
                    aiItem.Bio,
                    aiItem.TransferableSkillNames,
                    aiItem.RelevanceScore,
                    shareSlug,
                    savedViewId,
                    "success"));
            }

            await db.SaveChangesAsync();

            return new ManagerDtos.BatchSwitchResponseDto(
                request.TargetTech,
                request.MissionContext,
                resultItems.Count,
                resultItems.Count(r => r.Status == "success"),
                resultItems.Count(r => r.Status == "error"),
                resultItems);
        }

        // ── Prépare payload optimisé : pré-score local avant IA ──────────
        private static PortfolioAiPayload BuildAiPayload(Portfolio p, string targetTech)
        {
            var tech = targetTech.ToLower();

            var scoredProjects = p.Collaborator.Projects
                .Select(proj => new
                {
                    proj.ProjectId,
                    proj.Title,
                    Desc = Truncate(proj.Description, 80),
                    TechStack = proj.Technologies,              // ✅ Technologies
                    Score = ScoreText(
                        $"{proj.Title} {proj.Description} {proj.Technologies}", tech)
                })
                .OrderByDescending(x => x.Score)
                .Take(12)
                .ToList();

            var scoredSkills = p.Collaborator.CollaboratorSkills
                .Select(cs => new
                {
                    cs.CollabSkillId,
                    Name = cs.Skill?.Name ?? "",
                    cs.YearsUsed,
                    cs.IsPrimary,
                    cs.Level,
                    Score = ScoreText(cs.Skill?.Name ?? "", tech) +
                               (cs.IsPrimary ? 3 : 0)
                })
                .OrderByDescending(x => x.Score)
                .Take(10)
                .ToList();

            var scoredExps = p.Collaborator.Experiences
                .Select(e => new
                {
                    e.ExperienceId,
                    e.JobTitle,
                    Company = e.CompanyName,                  // ✅ CompanyName
                    Desc = Truncate(e.Description, 60),
                    Score = ScoreText($"{e.JobTitle} {e.Description} {e.Technologies}", tech)
                })
                .OrderByDescending(x => x.Score)
                .Take(5)
                .ToList();

            var certs = p.Collaborator.Certifications
                .Select(c => new
                {
                    c.CertificationId,
                    c.Name,
                    Score = ScoreText(c.Name, tech)
                })
                .OrderByDescending(x => x.Score)
                .Take(5)
                .ToList();

            return new PortfolioAiPayload
            {
                Id = p.PortfolioId,
                CollabId = p.CollaboratorId,
                Name = $"{p.Collaborator.User?.FirstName} {p.Collaborator.User?.LastName}".Trim(),
                JobTitle = p.Collaborator.JobTitle ?? "",
                Bio = Truncate(p.Collaborator.Bio, 100),
                Years = p.Collaborator.YearsExperience,
                Projects = scoredProjects.Select(x => new AiProjectInput(
                    x.ProjectId, x.Title, x.Desc, x.TechStack)).ToList(),
                Skills = scoredSkills.Select(x => new AiSkillInput(
                    x.CollabSkillId, x.Name, x.YearsUsed, x.IsPrimary)).ToList(),
                Experiences = scoredExps.Select(x => new AiExpInput(
                    x.ExperienceId, x.JobTitle, x.Company, x.Desc)).ToList(),
                Certifications = certs.Select(x => new AiCertInput(
                    x.CertificationId, x.Name)).ToList()
            };
        }
        // ── Score local simple : compte les mots-clés tech dans le texte ──
        private static int ScoreText(string? text, string tech)
        {
            if (string.IsNullOrEmpty(text)) return 0;
            var t = text.ToLower();
            var score = 0;
            if (t.Contains(tech)) score += 10;
            // Mots-clés génériques web toujours utiles
            foreach (var kw in new[] { "web", "frontend", "backend", "fullstack",
                                        "cms", "site", "application", "api" })
                if (t.Contains(kw)) score += 1;
            return score;
        }

        // ── Appel Gemini batch optimisé ───────────────────────────────────
        private async Task<List<AiBatchResult>> CallGeminiBatchAsync(
            List<PortfolioAiPayload> payloads,
            string targetTech,
            string? missionContext)
        {
            var profilesJson = JsonSerializer.Serialize(payloads,
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

            var contextLine = string.IsNullOrEmpty(missionContext)
                ? "" : $"\nContexte mission client : {missionContext}";

            // Prompt compact = moins de tokens = économise quota
            var prompt = $@"Expert RH tech. Repositionne ces profils pour {targetTech}.{contextLine}

INPUT:
{profilesJson}

Pour chaque profil retourne UNIQUEMENT:
- id: même id que l'input
- title: nouveau titre orienté {targetTech} (6 mots max)
- bio: 1 phrase 18 mots max exploitant l'expérience réelle
- projectIds: tableau des IDs projets les plus pertinents pour {targetTech} (max 8, triés par pertinence décroissante, utilise UNIQUEMENT les IDs de l'input)
- skillIds: tableau des IDs skills les plus pertinentes pour {targetTech} (max 8, triées par pertinence, UNIQUEMENT les IDs de l'input)
- experienceIds: tableau des IDs expériences pertinentes (max 3, UNIQUEMENT les IDs de l'input)
- certificationIds: tableau des IDs certifications pertinentes (max 3, UNIQUEMENT les IDs de l'input)
- transferableSkillNames: tableau de 3 noms de skills transférables (strings)
- relevanceScore: score 0-100 (pertinence globale du profil pour {targetTech})

RÈGLE ABSOLUE: n'utilise que les IDs fournis dans l'input. N'invente rien.

JSON array valide uniquement, sans markdown:
[{{""id"":1,""title"":""..."",""bio"":""..."",""projectIds"":[12,5],""skillIds"":[3,7],""experienceIds"":[2],""certificationIds"":[1],""transferableSkillNames"":[""...""],""relevanceScore"":75}}]";

            var url = $"models/{_model}:generateContent?key={_apiKey}";
            var body = new
            {
                contents = new[] { new { parts = new[] { new { text = prompt } } } },
                generationConfig = new
                {
                    maxOutputTokens = 4096,
                    temperature = 0.1,
                    responseMimeType = "application/json"
                }
            };

            for (int attempt = 0; attempt < 3; attempt++)
            {
                if (attempt > 0) await Task.Delay(attempt * 4000);
                try
                {
                    var response = await _http.PostAsJsonAsync(url, body);

                    if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                    {
                        _logger.LogWarning("Gemini rate limit (429), attente 8s...");
                        await Task.Delay(8000);
                        continue;
                    }

                    if (response.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable)
                    {
                        _logger.LogWarning("Gemini indisponible (503), attente 15s...");
                        await Task.Delay(15000);
                        continue;
                    }

                    response.EnsureSuccessStatusCode();

                    var result = await response.Content.ReadFromJsonAsync<GeminiResponse>();
                    var text = CleanJson(
                        result?.Candidates?[0]?.Content?.Parts?[0]?.Text ?? "[]");

                    _logger.LogInformation("Gemini batch OK, longueur: {L}", text.Length);
                    return ParseBatch(text);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Gemini batch attempt {A} failed", attempt + 1);
                }
            }

            _logger.LogWarning("Batch échoué, fallback 1-par-1");
            return await CallGeminiOneByOneAsync(payloads, targetTech, missionContext);
        }

        // ── Fallback : 1 appel par profil si batch échoue ─────────────────
        private async Task<List<AiBatchResult>> CallGeminiOneByOneAsync(
            List<PortfolioAiPayload> payloads,
            string targetTech,
            string? missionContext)
        {
            var results = new List<AiBatchResult>();

            foreach (var payload in payloads)
            {
                await Task.Delay(1000); // évite rate limit
                var singleJson = JsonSerializer.Serialize(payload,
                    new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
                var contextLine = string.IsNullOrEmpty(missionContext)
                    ? "" : $"\nMission: {missionContext}";

                var prompt = $@"Expert RH. Repositionne ce profil vers {targetTech}.{contextLine}

INPUT: {singleJson}

Retourne UNIQUEMENT ce JSON (sans markdown):
{{""id"":{payload.Id},""title"":""6 mots max"",""bio"":""1 phrase 18 mots"",""projectIds"":[],""skillIds"":[],""experienceIds"":[],""certificationIds"":[],""transferableSkillNames"":[""s1"",""s2"",""s3""],""relevanceScore"":70}}";

                var url = $"models/{_model}:generateContent?key={_apiKey}";
                var body = new
                {
                    contents = new[] { new { parts = new[] { new { text = prompt } } } },
                    generationConfig = new
                    {
                        maxOutputTokens = 500,
                        temperature = 0.1,
                        responseMimeType = "application/json"
                    }
                };

                try
                {
                    var response = await _http.PostAsJsonAsync(url, body);
                    response.EnsureSuccessStatusCode();

                    var result = await response.Content.ReadFromJsonAsync<GeminiResponse>();
                    var text = CleanJson(
                        result?.Candidates?[0]?.Content?.Parts?[0]?.Text ?? "{}");
                    var wrapped = text.TrimStart().StartsWith("[") ? text : $"[{text}]";
                    results.AddRange(ParseBatch(wrapped));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Gemini single failed for portfolio {Id}", payload.Id);
                }
            }

            return results;
        }

        // ── Types internes ────────────────────────────────────────────────
        private class PortfolioAiPayload
        {
            public int Id { get; set; }
            public int CollabId { get; set; }
            public string Name { get; set; } = "";
            public string JobTitle { get; set; } = "";
            public string Bio { get; set; } = "";
            public int Years { get; set; }
            public List<AiProjectInput> Projects { get; set; } = new();
            public List<AiSkillInput> Skills { get; set; } = new();
            public List<AiExpInput> Experiences { get; set; } = new();
            public List<AiCertInput> Certifications { get; set; } = new();
        }

        private record AiProjectInput(int ProjectId, string Title, string? Desc, string? TechStack);
        private record AiSkillInput(int CollabSkillId, string Name, int YearsUsed, bool IsPrimary);
        private record AiExpInput(int ExperienceId, string JobTitle, string Company, string? Desc);
        private record AiCertInput(int CertificationId, string Name);

        private record AiBatchResult(
            int Id,
            string Title,
            string Bio,
            List<int> ProjectIds,
            List<int> SkillIds,
            List<int> ExperienceIds,
            List<int> CertificationIds,
            List<string> TransferableSkillNames,
            double RelevanceScore);

        // ── Parse réponse Gemini ──────────────────────────────────────────
        private List<AiBatchResult> ParseBatch(string json)
        {
            try
            {
                json = json.Trim();
                if (!json.EndsWith("]"))
                {
                    var lastClose = json.LastIndexOf('}');
                    json = lastClose > 0 ? json[..(lastClose + 1)] + "]" : "[]";
                }

                using var doc = JsonDocument.Parse(json);
                return doc.RootElement.EnumerateArray().Select(el =>
                {
                    var projectIds = GetIntList(el, "projectIds");
                    var skillIds = GetIntList(el, "skillIds");
                    var expIds = GetIntList(el, "experienceIds");
                    var certIds = GetIntList(el, "certificationIds");
                    var skillNames = GetStringList(el, "transferableSkillNames");
                    var score = el.TryGetProperty("relevanceScore", out var sc)
                        ? sc.GetDouble() : 50.0;

                    return new AiBatchResult(
                        el.GetProperty("id").GetInt32(),
                        el.TryGetProperty("title", out var t) ? t.GetString() ?? "" : "",
                        el.TryGetProperty("bio", out var b) ? b.GetString() ?? "" : "",
                        projectIds, skillIds, expIds, certIds, skillNames, score);
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur parsing batch JSON");
                return new();
            }
        }

        private static List<int> GetIntList(JsonElement el, string prop) =>
            el.TryGetProperty(prop, out var arr)
                ? arr.EnumerateArray()
                     .Where(x => x.ValueKind == JsonValueKind.Number)
                     .Select(x => x.GetInt32()).ToList()
                : new();

        private static List<string> GetStringList(JsonElement el, string prop) =>
            el.TryGetProperty(prop, out var arr)
                ? arr.EnumerateArray()
                     .Select(x => x.GetString() ?? "")
                     .Where(s => s.Length > 0).ToList()
                : new();

        private static string Truncate(string? text, int max) =>
            string.IsNullOrEmpty(text) ? "" :
            text.Length <= max ? text : text[..max] + "…";

        private static string CleanJson(string text)
        {
            text = text.Trim();
            if (text.StartsWith("```json")) text = text[7..];
            else if (text.StartsWith("```")) text = text[3..];
            if (text.EndsWith("```")) text = text[..^3];
            return text.Trim();
        }
    }
}