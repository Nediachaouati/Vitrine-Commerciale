using System.Text;
using System.Text.Json;
using BackendPortfolio.DTO;
using BackendPortfolio.Models;

namespace BackendPortfolio.Services
{
    public interface IManagerAiService
    {
        Task<List<ManagerDtos.MatchedCollaboratorDto>> MatchCollaboratorsAsync(
            ManagerDtos.ClientNeedsDto needs,
            List<Collaborator> collaborators);

        Task<ManagerDtos.ImprovementSuggestionDto> GetImprovementSuggestionsAsync(
            ManagerDtos.ClientNeedsDto needs,
            Collaborator collab);
    }

    public class ManagerAiService : IManagerAiService
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;
        private readonly ILogger<ManagerAiService> _logger;

        public ManagerAiService(
            IHttpClientFactory factory,
            IConfiguration config,
            ILogger<ManagerAiService> logger)
        {
            _http = factory.CreateClient("Groq");
            _config = config;
            _logger = logger;
        }

        // ── Appel Groq (Llama3 — 100% gratuit) ───────────────────────────
        private async Task<string?> CallGroqAsync(string prompt, int maxTokens = 300)
        {
            try
            {
                var apiKey = _config["Groq:ApiKey"];
                var url = "https://api.groq.com/openai/v1/chat/completions";

                var request = new HttpRequestMessage(HttpMethod.Post, url);
                request.Headers.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

                var body = new
                {
                    model = "llama-3.1-8b-instant",
                    max_tokens = maxTokens,
                    messages = new[]
                    {
                        new { role = "user", content = prompt }
                    }
                };

                request.Content = new StringContent(
                    JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

                using var httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(30) };
                using var resp = await httpClient.SendAsync(request);

                if (!resp.IsSuccessStatusCode)
                {
                    var err = await resp.Content.ReadAsStringAsync();
                    _logger.LogError("Groq error {S}: {B}", resp.StatusCode, err);
                    return null;
                }

                var json = await resp.Content.ReadAsStringAsync();
                _logger.LogInformation("Groq response: {J}", json);

                using var doc = JsonDocument.Parse(json);

                return doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur appel Groq");
                return null;
            }
        }

        // ── 5.2 Matching ──────────────────────────────────────────────────
        public async Task<List<ManagerDtos.MatchedCollaboratorDto>> MatchCollaboratorsAsync(
            ManagerDtos.ClientNeedsDto needs,
            List<Collaborator> collaborators)
        {
            var tasks = collaborators.Select(async collab =>
            {
                try
                {
                    var (score, breakdown, matched, missing) = ComputeScore(needs, collab);

                    var suggestions = new List<string>();
                    if (score < 80 && missing.Any())
                        suggestions = await GetQuickSuggestionsAsync(collab, missing);

                    return new ManagerDtos.MatchedCollaboratorDto(
                        collab.CollaboratorId,
                        collab.User?.FirstName ?? "",
                        collab.User?.LastName ?? "",
                        collab.User?.AvatarUrl,
                        collab.JobTitle ?? "",
                        collab.YearsExperience,
                        collab.AvailabilityStatus ?? "",
                        Math.Round(score, 1),
                        breakdown,
                        Repositories.ManagerRepository.ComputeBadges(collab),
                        matched,
                        missing,
                        suggestions,
                        collab.Portfolios?.FirstOrDefault(p => p.IsActive)?.PublicSlug
                    );
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erreur matching collaborateur {Id}", collab.CollaboratorId);
                    var (score, breakdown, matched, missing) = ComputeScore(needs, collab);
                    return new ManagerDtos.MatchedCollaboratorDto(
                        collab.CollaboratorId,
                        collab.User?.FirstName ?? "",
                        collab.User?.LastName ?? "",
                        collab.User?.AvatarUrl,
                        collab.JobTitle ?? "",
                        collab.YearsExperience,
                        collab.AvailabilityStatus ?? "",
                        Math.Round(score, 1),
                        breakdown,
                        Repositories.ManagerRepository.ComputeBadges(collab),
                        matched,
                        missing,
                        new List<string>(),
                        null
                    );
                }
            });

            var results = await Task.WhenAll(tasks);
            return results.OrderByDescending(r => r.MatchScore).ToList();
        }

        // ── 5.5 Suggestions détaillées ────────────────────────────────────
        public async Task<ManagerDtos.ImprovementSuggestionDto> GetImprovementSuggestionsAsync(
            ManagerDtos.ClientNeedsDto needs,
            Collaborator collab)
        {
            var (currentScore, _, _, missing) = ComputeScore(needs, collab);

            var prompt =
                $"List 5 short improvement suggestions in French for a {collab.JobTitle} " +
                $"with {collab.YearsExperience} years experience. " +
                $"Missing skills: {string.Join(", ", missing)}. " +
                $"Reply ONLY as a JSON array of 5 strings, no explanation, no markdown. Example: [\"suggestion 1\",\"suggestion 2\",\"suggestion 3\",\"suggestion 4\",\"suggestion 5\"]";

            var suggestions = new List<string>();
            var potentialScore = 0.0;

            try
            {
                var aiResponse = await CallGroqAsync(prompt, 400);

                if (!string.IsNullOrEmpty(aiResponse))
                {
                    suggestions = ExtractJsonArray(aiResponse)
                        ?? GenerateFallbackSuggestions(needs, collab, missing);
                    potentialScore = Math.Min(100, currentScore + (missing.Count > 0 ? 15 : 5));
                }
                else
                {
                    suggestions = GenerateFallbackSuggestions(needs, collab, missing);
                    potentialScore = Math.Min(100, currentScore + missing.Count * 5.0);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur GetImprovementSuggestions");
                suggestions = GenerateFallbackSuggestions(needs, collab, missing);
                potentialScore = Math.Min(100, currentScore + missing.Count * 5.0);
            }

            return new ManagerDtos.ImprovementSuggestionDto(
                collab.CollaboratorId,
                $"{collab.User?.FirstName} {collab.User?.LastName}",
                suggestions,
                Math.Round(currentScore, 1),
                Math.Round(potentialScore, 1)
            );
        }

        // ════════════════════════════════════════════════════════════════
        // Moteur de scoring LOCAL
        // ════════════════════════════════════════════════════════════════
        private static string NormalizeSkill(string s) =>
    s.ToLower()
     .Replace(".", "")
     .Replace("-", "")
     .Replace(" ", "")
     .Replace("_", "")
     .Trim();

        public static (double score, ManagerDtos.MatchBreakdownDto breakdown, List<string> matched, List<string> missing)
            ComputeScore(ManagerDtos.ClientNeedsDto needs, Collaborator collab)
        {
            var details = new List<ManagerDtos.MatchCriterionDto>();

            var collabSkills = collab.CollaboratorSkills
    .Select(cs => NormalizeSkill(cs.Skill?.Name ?? ""))
    .Where(n => n.Length > 0)
    .ToList();

            var required = needs.RequiredSkills.Select(NormalizeSkill).ToList();
            var matched = needs.RequiredSkills
                .Where(s => collabSkills.Contains(NormalizeSkill(s)))
                .ToList();
            var missing = needs.RequiredSkills
                .Where(s => !collabSkills.Contains(NormalizeSkill(s)))
                .ToList();

            double skillScore = required.Count > 0
                ? (double)matched.Count / required.Count * 40
                : 40;

            details.Add(new ManagerDtos.MatchCriterionDto(
                "Skills requis",
                matched.Count == required.Count ? "matched" : matched.Any() ? "partial" : "missing",
                $"{matched.Count}/{required.Count} skills correspondants"
            ));

            // ── Skills préférés (bonus 10 pts) ──
            double prefBonus = 0;
            if (needs.PreferredSkills?.Any() == true)
            {
                int prefMatched = needs.PreferredSkills.Count(s => collabSkills.Contains(s.ToLower()));
                prefBonus = (double)prefMatched / needs.PreferredSkills.Count * 10;
                details.Add(new ManagerDtos.MatchCriterionDto(
                    "Skills préférés",
                    prefMatched > 0 ? "partial" : "missing",
                    $"{prefMatched}/{needs.PreferredSkills.Count} skills préférés"
                ));
            }

            // ── Expérience (25 pts) ──
            double expScore = 25;
            string expStatus = "matched";
            if (needs.MinYearsExperience.HasValue)
            {
                int diff = collab.YearsExperience - needs.MinYearsExperience.Value;
                (expScore, expStatus) = diff >= 0 ? (25, "matched")
                    : diff >= -2 ? (15, "partial")
                    : (5, "missing");
            }
            details.Add(new ManagerDtos.MatchCriterionDto(
                "Années d'expérience",
                expStatus,
                $"{collab.YearsExperience} an(s) — requis : {needs.MinYearsExperience ?? 0}+"
            ));

            // ── Certifications (20 pts) ──
            double certScore = 20;
            if (needs.RequiredCertifications?.Any() == true)
            {
                var collabCerts = collab.Certifications.Select(c => c.Name.ToLower()).ToList();
                int certMatched = needs.RequiredCertifications
                    .Count(c => collabCerts.Any(cc => cc.Contains(c.ToLower())));
                certScore = (double)certMatched / needs.RequiredCertifications.Count * 20;
                details.Add(new ManagerDtos.MatchCriterionDto(
                    "Certifications",
                    certMatched == needs.RequiredCertifications.Count ? "matched"
                        : certMatched > 0 ? "partial" : "missing",
                    $"{certMatched}/{needs.RequiredCertifications.Count} certifications"
                ));
            }
            else
            {
                details.Add(new ManagerDtos.MatchCriterionDto(
                    "Certifications", "matched", "Aucune certification requise"));
            }

            // ── Disponibilité (15 pts) ──
            double availScore = 15;
            string availStatus = "matched";
            if (!string.IsNullOrEmpty(needs.AvailabilityRequired) && needs.AvailabilityRequired != "any")
            {
                availScore = collab.AvailabilityStatus == needs.AvailabilityRequired ? 15
                            : collab.AvailabilityStatus == "soon" ? 8
                            : 0;
                availStatus = availScore == 15 ? "matched" : availScore > 0 ? "partial" : "missing";
            }
            details.Add(new ManagerDtos.MatchCriterionDto(
                "Disponibilité", availStatus,
                $"Statut actuel : {collab.AvailabilityStatus}"
            ));

            double total = Math.Min(100, skillScore + prefBonus + expScore + certScore + availScore);

            var breakdown = new ManagerDtos.MatchBreakdownDto(
                Math.Round(skillScore + prefBonus, 1),
                Math.Round(expScore, 1),
                Math.Round(certScore, 1),
                Math.Round(availScore, 1),
                details
            );

            return (total, breakdown, matched, missing);
        }

        // ── Suggestions rapides ───────────────────────────────────────────
        private async Task<List<string>> GetQuickSuggestionsAsync(
            Collaborator collab,
            List<string> missing)
        {
            try
            {
                var prompt =
                    $"Give 3 improvement suggestions in French for a {collab.JobTitle ?? "developer"} " +
                    $"missing these skills: {string.Join(", ", missing.Take(3))}. " +
                    $"Reply ONLY as a JSON array of 3 strings, no explanation, no markdown. Example: [\"suggestion 1\",\"suggestion 2\",\"suggestion 3\"]";

                var response = await CallGroqAsync(prompt, 300);
                if (!string.IsNullOrEmpty(response))
                {
                    var parsed = ExtractJsonArray(response);
                    if (parsed?.Any() == true) return parsed.Take(3).ToList();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur GetQuickSuggestions");
            }

            // Fallback local
            return missing.Take(3)
                .Select(s => $"Acquérir la compétence '{s}' via formation ou projet personnel.")
                .ToList();
        }

        // ── Fallback 100% local ───────────────────────────────────────────
        private static List<string> GenerateFallbackSuggestions(
            ManagerDtos.ClientNeedsDto needs,
            Collaborator collab,
            List<string> missing)
        {
            var suggestions = new List<string>();

            foreach (var skill in missing.Take(3))
                suggestions.Add($"Acquérir la compétence '{skill}' via formation ou projet personnel.");

            if (needs.MinYearsExperience.HasValue &&
                collab.YearsExperience < needs.MinYearsExperience.Value)
                suggestions.Add($"Valoriser davantage vos {collab.YearsExperience} ans d'expérience dans le portfolio.");

            if (!collab.Certifications.Any())
                suggestions.Add("Obtenir une certification reconnue dans votre domaine.");

            if (suggestions.Count < 3)
                suggestions.Add("Compléter la bio avec des réalisations mesurables et des technologies clés.");

            return suggestions;
        }

        // ── Extraction JSON array ─────────────────────────────────────────
        private static List<string>? ExtractJsonArray(string text)
        {
            try
            {
                var start = text.IndexOf('[');
                var end = text.LastIndexOf(']');
                if (start < 0 || end < 0 || end <= start) return null;

                var json = text[start..(end + 1)];
                return JsonSerializer.Deserialize<List<string>>(json);
            }
            catch { return null; }
        }
    }
}