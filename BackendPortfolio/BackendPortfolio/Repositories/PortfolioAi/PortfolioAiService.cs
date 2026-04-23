/*using BackendPortfolio.DTO.Portfolio;
using BackendPortfolio.Models;
using System.Text.Json;

namespace BackendPortfolio.Repositories.PortfolioAi
{
    public class PortfolioAiService : IPortfolioAiService
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;
        private readonly string _apiKey;
        private readonly string _model;

        public PortfolioAiService(IHttpClientFactory factory, IConfiguration config)
        {
            _http = factory.CreateClient("Gemini");
            _config = config;
            _apiKey = config["Gemini:ApiKey"]!;
            _model = config["Gemini:Model"] ?? "gemini-2.5-flash";
        }

        // ── HELPER GEMINI ────────────────────────────────────────────────
        private async Task<string> CallGeminiAsync(string systemPrompt, string userMessage, int maxTokens = 1000)
        {
            var url = $"models/{_model}:generateContent?key={_apiKey}";

            var body = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = $"{systemPrompt}\n\n{userMessage}" } } }
                },
                generationConfig = new { maxOutputTokens = maxTokens, temperature = 0.7 }
            };

            int[] retryDelays = { 0, 3000, 6000 };

            for (int attempt = 0; attempt < retryDelays.Length; attempt++)
            {
                if (retryDelays[attempt] > 0)
                    await Task.Delay(retryDelays[attempt]);

                var response = await _http.PostAsJsonAsync(url, body);

                if (response.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable ||
                    response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    if (attempt == retryDelays.Length - 1)
                        throw new InvalidOperationException(
                            "GEMINI_UNAVAILABLE: L'IA est surchargée. Réessaie dans quelques secondes.");
                    continue;
                }

                if (!response.IsSuccessStatusCode)
                {
                    var err = await response.Content.ReadAsStringAsync();
                    throw new InvalidOperationException($"Erreur Gemini: {response.StatusCode} - {err}");
                }

                var result = await response.Content.ReadFromJsonAsync<GeminiResponse>();
                return result?.Candidates?[0]?.Content?.Parts?[0]?.Text ?? "";
            }

            throw new InvalidOperationException("GEMINI_UNAVAILABLE: Nombre maximum de tentatives atteint.");
        }

        private static string CleanHtml(string html)
        {
            html = html.Trim();
            if (html.StartsWith("```html")) html = html[7..];
            else if (html.StartsWith("```")) html = html[3..];
            if (html.EndsWith("```")) html = html[..^3];
            return html.Trim();
        }

        // ── HASH DU PROFIL (étendu : profil + expériences + skills + certs) ──
        /* public async Task<string> GetProfileHashAsync(int collaboratorId, DbVitrineContext db)
         {
             var collab = await db.Collaborators
                 .Include(c => c.User)
                 .FirstOrDefaultAsync(c => c.CollaboratorId == collaboratorId);

             if (collab == null) return "";

             var portfolio = await db.Portfolios
                 .FirstOrDefaultAsync(p => p.CollaboratorId == collaboratorId);

             var expHash = "";
             var skillHash = "";
             var certHash = "";

             if (portfolio != null)
             {
                 var exps = await db.Experiences
                     .Where(e => e.PortfolioId == portfolio.PortfolioId)
                     .OrderBy(e => e.ExperienceId)
                     .Select(e => $"{e.ExperienceId}:{e.JobTitle}:{e.CompanyName}:{e.Description}:{e.Technologies}:{e.StartDate}:{e.EndDate}:{e.IsCurrent}:{e.Location}")
                     .ToListAsync();
                 expHash = string.Join("|", exps);

                 var certs = await db.Certifications
                     .Where(c => c.PortfolioId == portfolio.PortfolioId)
                     .OrderBy(c => c.CertificationId)
                     .Select(c => $"{c.CertificationId}:{c.Name}:{c.Issuer}:{c.IssueDate}:{c.Score}")
                     .ToListAsync();
                 certHash = string.Join("|", certs);
             }

             var skills = await db.CollaboratorSkills
                 .Where(cs => cs.CollaboratorId == collaboratorId)
                 .OrderBy(cs => cs.SkillId)
                 .Select(cs => $"{cs.SkillId}:{cs.Level}:{cs.YearsUsed}:{cs.IsPrimary}")
                 .ToListAsync();
             skillHash = string.Join("|", skills);

             var raw = $"{collab.User?.AvatarUrl}|{collab.Bio}|{collab.JobTitle}|{collab.YearsExperience}"
                     + $"|{collab.LinkedinUrl}|{collab.GithubUrl}|{collab.AvailabilityStatus}"
                     + $"|{expHash}|{skillHash}|{certHash}";

             using var sha = System.Security.Cryptography.SHA256.Create();
             var bytes = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(raw));
             return Convert.ToHexString(bytes)[..16];
         }
        */
/*
        public async Task<string> GetProfileHashAsync(int collaboratorId, DbVitrineContext db)
        {
            var collab = await db.Collaborators
                .AsNoTracking()                          
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.CollaboratorId == collaboratorId);

            if (collab == null) return "";

            var portfolio = await db.Portfolios
                .AsNoTracking()                         
                .FirstOrDefaultAsync(p => p.CollaboratorId == collaboratorId);

            var expHash = "";
            var skillHash = "";
            var certHash = "";

            if (portfolio != null)
            {
                var exps = await db.Experiences
                    .AsNoTracking()                      
                    .Where(e => e.PortfolioId == portfolio.PortfolioId)
                    .OrderBy(e => e.ExperienceId)
                    .Select(e => $"{e.ExperienceId}:{e.JobTitle}:{e.CompanyName}:{e.Description}:{e.Technologies}:{e.StartDate}:{e.EndDate}:{e.IsCurrent}:{e.Location}")
                    .ToListAsync();
                expHash = string.Join("|", exps);

                var certs = await db.Certifications
                    .AsNoTracking()                      
                    .Where(c => c.PortfolioId == portfolio.PortfolioId)
                    .OrderBy(c => c.CertificationId)
                    .Select(c => $"{c.CertificationId}:{c.Name}:{c.Issuer}:{c.IssueDate}:{c.Score}")
                    .ToListAsync();
                certHash = string.Join("|", certs);
            }

            var skills = await db.CollaboratorSkills
                .AsNoTracking()                          
                .Where(cs => cs.CollaboratorId == collaboratorId)
                .OrderBy(cs => cs.SkillId)
                .Select(cs => $"{cs.SkillId}:{cs.Level}:{cs.YearsUsed}:{cs.IsPrimary}")
                .ToListAsync();
            skillHash = string.Join("|", skills);

            var raw = $"{collab.User?.AvatarUrl}|{collab.Bio}|{collab.JobTitle}|{collab.YearsExperience}"
                    + $"|{collab.LinkedinUrl}|{collab.GithubUrl}|{collab.AvailabilityStatus}"
                    + $"|{expHash}|{skillHash}|{certHash}";

            using var sha = System.Security.Cryptography.SHA256.Create();
            var bytes = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(raw));
            return Convert.ToHexString(bytes)[..16];
        }
        // ── CHAT ─────────────────────────────────────────────────────────
        public async Task<ChatResponseDto> ChatAsync(ChatRequestDto request)
        {
            var systemPrompt = @"
Tu es un assistant qui collecte les informations professionnelles d'un collaborateur 
pour enrichir son portfolio. Les informations de base (bio, poste, années d'expérience,
LinkedIn, GitHub, photo de profil) sont déjà disponibles dans son profil — 
NE pose JAMAIS de questions sur ces éléments.
 
Concentre-toi UNIQUEMENT sur :
1. Ses expériences professionnelles détaillées (dates, lieu, description, technologies)
2. Ses compétences techniques (minimum 5 skills avec niveau et années)
3. Ses certifications
4. Sa formation / éducation (diplômes, écoles, années)
 
Pose les questions naturellement UNE PAR UNE.
 
IMPORTANT: Réponds UNIQUEMENT en JSON valide, sans markdown:
{
  ""message"": ""ta question ou réponse"",
  ""sectionType"": ""experience""|""skill""|""certification""|""education""|null,
  ""extractedData"": { } ou null,
  ""isComplete"": false
}
 
Met isComplete à true SEULEMENT quand tu as collecté:
- AU MOINS 1 expérience complète (entreprise + poste + dates + description + technologies)
- AU MOINS 5 compétences techniques avec niveau
- AU MOINS 1 certification OU confirmation qu'il n'en a pas
- AU MOINS 1 formation OU confirmation qu'il n'en a pas
 
Ne mets JAMAIS isComplete à true avant d'avoir ces 4 éléments.";

            var history = string.Join("\n", request.Messages.Select(m =>
                $"{(m.Role == "user" ? "Utilisateur" : "Assistant")}: {m.Content}"));

            try
            {
                var text = await CallGeminiAsync(systemPrompt, history, 1000);
                text = text.Trim();
                if (text.StartsWith("```json")) text = text[7..];
                if (text.StartsWith("```")) text = text[3..];
                if (text.EndsWith("```")) text = text[..^3];
                text = text.Trim();

                return JsonSerializer.Deserialize<ChatResponseDto>(text,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                    ?? new ChatResponseDto { Message = "Erreur de parsing." };
            }
            catch (Exception ex)
            {
                return new ChatResponseDto { Message = $"Erreur: {ex.Message}" };
            }
        }

        // ── GÉNÉRATION HTML ───────────────────────────────────────────────
        public async Task<string> GeneratePortfolioHtmlAsync(int collaboratorId, DbVitrineContext db)
        {
            var collab = await db.Collaborators
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.CollaboratorId == collaboratorId);

            if (collab == null) throw new Exception("Collaborateur introuvable");
            var user = collab.User;

            var portfolio = await db.Portfolios
                .FirstOrDefaultAsync(p => p.CollaboratorId == collab.CollaboratorId);

            List<Experience> experiences = new();
            List<Certification> certs = new();

            if (portfolio != null)
            {
                experiences = await db.Experiences
                    .Where(e => e.PortfolioId == portfolio.PortfolioId)
                    .OrderByDescending(e => e.StartDate)
                    .ToListAsync();

                certs = await db.Certifications
                    .Where(c => c.PortfolioId == portfolio.PortfolioId)
                    .ToListAsync();
            }

            var skills = await db.CollaboratorSkills
                .Include(cs => cs.Skill)
                .Where(cs => cs.CollaboratorId == collab.CollaboratorId)
                .ToListAsync();

            var firstName = user?.FirstName ?? "";
            var lastName = user?.LastName ?? "";
            var fullName = $"{firstName} {lastName}".Trim();

            await db.Entry(user!).ReloadAsync();
            var avatarUrl = !string.IsNullOrWhiteSpace(user?.AvatarUrl)
                ? user.AvatarUrl
                : $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(fullName)}&size=300&background=7c3aed&color=fff&bold=true";

            // Initiales pour le logo nav (jamais utilisé dans un viewBox SVG)
            var initials = $"{(firstName.Length > 0 ? firstName[0] : ' ')}{(lastName.Length > 0 ? lastName[0] : ' ')}".Trim().ToUpper();

            var dataContext = $@"
=== PROFIL DU COLLABORATEUR ===
Nom complet     : {fullName}
Initiales       : {initials}
Poste actuel    : {collab.JobTitle}
Bio             : {collab.Bio}
Années d'expérience : {collab.YearsExperience}
LinkedIn        : {collab.LinkedinUrl ?? "non renseigné"}
GitHub          : {collab.GithubUrl ?? "non renseigné"}
Avatar URL      : {avatarUrl}
Disponibilité   : {collab.AvailabilityStatus}
 
=== INSTRUCTIONS STRICTES ===
Utilise UNIQUEMENT les données ci-dessous. N'invente rien.
 
=== EXPÉRIENCES ({experiences.Count}) ===
{(experiences.Count == 0
    ? "Aucune expérience renseignée."
    : string.Join("\n", experiences.Select((e, i) =>
        $@"{i + 1}. ID={e.ExperienceId} | {e.JobTitle} chez {e.CompanyName}
   Période    : {e.StartDate:MM/yyyy} → {(e.IsCurrent ? "Présent" : (e.EndDate?.ToString("MM/yyyy") ?? "N/A"))}
   Lieu       : {e.Location}
   Description: {e.Description}
   Technologies: {e.Technologies}")))}
 
=== COMPÉTENCES ({skills.Count}) ===
{(skills.Count == 0
    ? "Aucune compétence renseignée."
    : string.Join("\n", skills.Select(s =>
        $"- SkillID={s.SkillId} | {s.Skill?.Name}: niveau={s.Level} | {s.YearsUsed} an(s){(s.IsPrimary ? " [Principale]" : "")}")))}
 
=== CERTIFICATIONS ({certs.Count}) ===
{(certs.Count == 0
    ? "Aucune certification renseignée."
    : string.Join("\n", certs.Select(c =>
        $"- CertID={c.CertificationId} | {c.Name} | Organisme: {c.Issuer} | Année: {c.IssueDate.Year} | Score: {c.Score}/100")))}";

            var systemPrompt = @"
Tu es un expert web senior qui génère des portfolios professionnels en HTML/CSS/JS complets.
 
=== RÈGLES ABSOLUES DE DONNÉES ===
- Utilise EXACTEMENT les données fournies. N'invente rien.
- Si une section est vide : affiche ""Cette section est en cours de renseignement.""
- Utilise l'URL avatar EXACTEMENT telle que fournie.
- NE génère PAS de fausse éducation si aucune n'est fournie.
 
=== RÈGLES SVG CRITIQUES ===
- INTERDIT : utiliser un nom de personne, un titre ou toute chaîne de texte dans l'attribut viewBox d'un SVG.
- L'attribut viewBox doit TOUJOURS être des nombres : viewBox=""0 0 LARGEUR HAUTEUR"" (ex: viewBox=""0 0 36 36"")
- Pour les cercles de score, utiliser UNIQUEMENT : viewBox=""0 0 36 36""
- N'utilise JAMAIS getTotalLength(), .baseVal, ni .strokeDasharray.baseVal en JavaScript.
- Pour animer le SVG : utiliser setAttribute('stroke-dashoffset', valeur) uniquement.
- Le logo nav = un <div> HTML avec les initiales en texte, PAS un SVG.
 
=== STRUCTURE OBLIGATOIRE ===
1. #home         — Hero : photo ronde, nom, titre, bio, boutons GitHub/LinkedIn
2. #education    — Formation : timeline (ou message ""en cours de renseignement"")  
3. #experience   — Expériences : cartes avec logo initiales (DIV, pas SVG), poste, dates, lieu, description, badges tech
4. #skills       — Compétences : groupées par catégorie, badges avec niveau et années
5. #certifications — Certifications : grille avec score en cercle SVG (viewBox=""0 0 36 36"" UNIQUEMENT)
 
=== DATA ATTRIBUTES OBLIGATOIRES (pour patch automatique) ===
Chaque champ doit avoir un attribut data-field sur son élément :
PROFIL :
  data-field=""fullName"" | data-field=""jobTitle"" | data-field=""bio""
  data-field=""yearsExperience"" | data-field=""availabilityStatus""
  data-field=""avatar"" (sur le tag <img>) 
  data-field=""linkedinUrl"" (sur le tag <a>)
  data-field=""githubUrl"" (sur le tag <a>)
EXPÉRIENCES : conteneur avec data-experience-id=""{ExperienceId}"", enfants avec :
  data-field=""jobTitle"" | data-field=""companyName"" | data-field=""location""
  data-field=""period"" | data-field=""description"" | data-field=""technologies""
COMPÉTENCES : conteneur avec data-skill-id=""{SkillId}"", enfants avec :
  data-field=""name"" | data-field=""level"" | data-field=""yearsUsed""
CERTIFICATIONS : conteneur avec data-certification-id=""{CertificationId}"", enfants avec :
  data-field=""name"" | data-field=""issuer"" | data-field=""year"" | data-field=""score""
 
=== DESIGN ===
Palette :
  --bg-primary:#0d1117 | --bg-card:#161b22 | --bg-hover:#21262d
  --text-primary:#e6edf3 | --text-muted:#8b949e
  --accent-blue:#58a6ff | --accent-purple:#bc8cff | --accent-green:#3fb950
  --border:#30363d
 
=== RÈGLES ABSOLUES ===
- Retourne UNIQUEMENT le HTML complet
- Commence par <!DOCTYPE html>, termine par </html>
- ZÉRO markdown, ZÉRO backtick, ZÉRO explication
- Tout CSS dans <style> dans <head>
- Tout JS dans <script> juste avant </body>, enveloppé dans DOMContentLoaded
- Responsive mobile-first (breakpoints 768px, 480px)
- Google Fonts dans <head>
- HTML autonome, fonctionne sans serveur";

            var html = await CallGeminiAsync(
                systemPrompt,
                $"Génère le portfolio HTML complet pour ce collaborateur :\n{dataContext}",
                65536);

            html = CleanHtml(html);

            // Correction de sécurité : remplacer les viewBox incorrects
            // Cas : viewBox="NOM PRENOM" ou toute valeur non-numérique
            html = System.Text.RegularExpressions.Regex.Replace(
                html,
                @"viewBox=""([^""]*[a-zA-Z\u00C0-\u024F][^""]*)""",
                "viewBox=\"0 0 36 36\"",
                System.Text.RegularExpressions.RegexOptions.IgnoreCase);

            var trimmedStart = html.TrimStart();
            if (!trimmedStart.StartsWith("<!DOCTYPE") && !trimmedStart.StartsWith("<html"))
            {
                var docIdx = html.IndexOf("<!DOCTYPE", StringComparison.OrdinalIgnoreCase);
                var htmlIdx = html.IndexOf("<html", StringComparison.OrdinalIgnoreCase);
                var startIdx = docIdx >= 0 ? docIdx : htmlIdx;
                if (startIdx > 0)
                    html = html[startIdx..];
                else
                    throw new InvalidOperationException("HTML généré invalide.");
            }

            if (!html.TrimEnd().EndsWith("</html>"))
            {
                if (!html.Contains("</html>"))
                    html += "\n</html>";
            }

            // Calculer le hash avant sauvegarde
            var profileHash = await GetProfileHashAsync(collaboratorId, db);

            if (portfolio == null)
            {
                var slug = $"{firstName.ToLower()}-{lastName.ToLower()}-{Guid.NewGuid().ToString("N")[..6]}";
                portfolio = new Portfolio
                {
                    CollaboratorId = collab.CollaboratorId,
                    Title = $"Portfolio — {fullName}",
                    Summary = collab.Bio ?? "",
                    VersionType = "original",
                    Theme = "dark",
                    Language = "fr",
                    IsActive = true,
                    PublicSlug = slug,
                    AiGeneratedAt = DateTime.UtcNow,
                    ViewCount = 0
                };
                db.Portfolios.Add(portfolio);
                await db.SaveChangesAsync();
            }

            portfolio.HtmlContent = html;
            portfolio.AiGeneratedAt = DateTime.UtcNow;
            portfolio.LastProfileHash = profileHash;
            await db.SaveChangesAsync();

            return html;
        }

        // ── PATCH PORTFOLIO SANS GEMINI ───────────────────────────────────

        public async Task<string> PatchPortfolioFromProfileAsync(int collaboratorId, DbVitrineContext db)
        {
            var collab = await db.Collaborators
                .AsNoTracking()
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.CollaboratorId == collaboratorId);

            if (collab == null) throw new Exception("Collaborateur introuvable");

            var portfolio = await db.Portfolios
               .FirstOrDefaultAsync(p => p.CollaboratorId == collaboratorId && p.IsActive == true);

            if (portfolio == null || string.IsNullOrWhiteSpace(portfolio.HtmlContent))
                throw new Exception("Portfolio introuvable — génère-le d'abord via le chat.");

            var user = collab.User;
            var firstName = user?.FirstName ?? "";
            var lastName = user?.LastName ?? "";
            var fullName = $"{firstName} {lastName}".Trim();

            await db.Entry(user!).ReloadAsync();
            var avatarUrl = !string.IsNullOrWhiteSpace(user?.AvatarUrl)
                ? user.AvatarUrl
                : $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(fullName)}&size=300&background=7c3aed&color=fff&bold=true";

            var html = portfolio.HtmlContent;

            // ── Vérifie si le HTML a des data-* attributes ──────────────────
            bool hasDataAttrs = html.Contains("data-field=") || html.Contains("data-experience-id=")
                             || html.Contains("data-skill-id=") || html.Contains("data-certification-id=");

            Console.WriteLine($"[PATCH] collabId={collaboratorId} | hasDataAttrs={hasDataAttrs}");

            if (!hasDataAttrs)
            {
                // HTML sans data-* : on ne peut pas patcher → on met à jour seulement le hash
                // pour éviter une boucle infinie. L'utilisateur doit régénérer manuellement.
                Console.WriteLine($"[PATCH] ⚠️ Aucun data-* dans le HTML de collabId={collaboratorId}. " +
                                  "Hash synchronisé — régénération manuelle requise via /regenerate.");
                var hashOnly = await GetProfileHashAsync(collaboratorId, db);
                portfolio.LastProfileHash = hashOnly;
                await db.SaveChangesAsync();
                return html;
            }

            // ── Applique tous les patches ────────────────────────────────────
            html = PortfolioHtmlPatcher.PatchProfileFields(
                html, fullName, collab.JobTitle, collab.Bio,
                collab.YearsExperience, collab.LinkedinUrl, collab.GithubUrl,
                avatarUrl, collab.AvailabilityStatus);

            var experiences = await db.Experiences
                .AsNoTracking()
                .Where(e => e.PortfolioId == portfolio.PortfolioId)
                .ToListAsync();
            foreach (var exp in experiences)
                html = PortfolioHtmlPatcher.PatchExperience(html, exp);

            var skills = await db.CollaboratorSkills
                .AsNoTracking()
                .Include(cs => cs.Skill)
                .Where(cs => cs.CollaboratorId == collaboratorId)
                .ToListAsync();
            foreach (var skill in skills)
                html = PortfolioHtmlPatcher.PatchSkill(html, skill, skill.Skill?.Name ?? "");

            var certs = await db.Certifications
                .AsNoTracking()
                .Where(c => c.PortfolioId == portfolio.PortfolioId)
                .ToListAsync();
            foreach (var cert in certs)
                html = PortfolioHtmlPatcher.PatchCertification(html, cert);

            // ── Sauvegarde TOUJOURS (même si valeurs identiques) ────────────
            // On sauvegarde dans tous les cas pour mettre à jour le hash.
            var profileHash = await GetProfileHashAsync(collaboratorId, db);
            portfolio.HtmlContent = html;
            portfolio.LastProfileHash = profileHash;
            portfolio.AiGeneratedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();

            Console.WriteLine($"[PATCH] ✓ Portfolio patché et sauvegardé pour collaborator={collaboratorId}");
            return html;
        }

        // ── UPDATE SECTION ────────────────────────────────────────────────
        public async Task<string> UpdatePortfolioSectionAsync(
            string currentHtml, string sectionId, string newData)
        {
            var systemPrompt = "Tu modifies une section spécifique d'un portfolio HTML. " +
                               "Retourne UNIQUEMENT le HTML complet modifié. " +
                               "Commence par <!DOCTYPE html> et termine par </html>. " +
                               "Aucun markdown, aucune explication.";

            var userMessage = $"HTML actuel:\n{currentHtml}\n\n" +
                              $"Modifie uniquement la section '{sectionId}' avec:\n{newData}\n" +
                              "Retourne le HTML complet mis à jour.";

            var html = await CallGeminiAsync(systemPrompt, userMessage, 65536);
            return CleanHtml(html);
        }

        // ── CORRECT AND UPDATE ────────────────────────────────────────────
        public async Task<ChatCorrectResponseDto> CorrectAndUpdateAsync(
            ChatCorrectRequestDto request, DbVitrineContext db)
        {
            var collab = await db.Collaborators
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.CollaboratorId == request.CollaboratorId);

            if (collab == null) throw new Exception("Collaborateur introuvable");

            var portfolio = await db.Portfolios
                .FirstOrDefaultAsync(p => p.CollaboratorId == collab.CollaboratorId);

            var experiences = portfolio != null
                ? await db.Experiences.Where(e => e.PortfolioId == portfolio.PortfolioId).ToListAsync()
                : new List<Experience>();

            var skills = await db.CollaboratorSkills
                .Include(cs => cs.Skill)
                .Where(cs => cs.CollaboratorId == collab.CollaboratorId)
                .ToListAsync();

            var certs = portfolio != null
                ? await db.Certifications.Where(c => c.PortfolioId == portfolio.PortfolioId).ToListAsync()
                : new List<Certification>();

            var currentDataContext = $@"
EXPÉRIENCES EN BASE:
{string.Join("\n", experiences.Select(e =>
    $"ID={e.ExperienceId} | poste={e.JobTitle} | societe={e.CompanyName} | lieu={e.Location} | periode={e.StartDate:MM/yyyy}→{(e.IsCurrent ? "Présent" : e.EndDate?.ToString("MM/yyyy"))}"))}
 
COMPÉTENCES EN BASE:
{string.Join("\n", skills.Select(s =>
    $"SkillID={s.SkillId} | nom={s.Skill?.Name} | niveau={s.Level} | annees={s.YearsUsed}"))}
 
CERTIFICATIONS EN BASE:
{string.Join("\n", certs.Select(c =>
    $"ID={c.CertificationId} | nom={c.Name} | organisme={c.Issuer} | date={c.IssueDate:yyyy-MM-dd} | score={c.Score}"))}";

            var systemPrompt = @"
Tu es un assistant qui applique des corrections sur des données de portfolio.
Réponds UNIQUEMENT avec ce JSON exact, sans commentaires, sans texte autour:
{
  ""message"": ""description courte des corrections"",
  ""corrections"": [
    {
      ""entityType"": ""experience"",
      ""entityId"": 0,
      ""updatedFields"": {}
    }
  ]
}
Règles:
- entityId = entier pur depuis le contexte
- score = entier pur ex: 70
- issueDate = YYYY-MM-DD
- N'inclure QUE les champs modifiés
- N'inclure QUE les entités modifiées";

            var userMessage = $@"Données actuelles:
{currentDataContext}
 
Correction demandée: ""{request.CorrectionMessage}""
 
Retourne le JSON des corrections à appliquer.";

            var text = await CallGeminiAsync(systemPrompt, userMessage, 1000);

            text = text.Trim();
            if (text.StartsWith("```json")) text = text[7..];
            if (text.StartsWith("```")) text = text[3..];
            if (text.EndsWith("```")) text = text[..^3];
            text = System.Text.RegularExpressions.Regex.Replace(text, @"\s*\([^)]*\)", "");
            text = System.Text.RegularExpressions.Regex.Replace(text, @",(\s*[}\]])", "$1");
            text = text.Trim();

            Console.WriteLine($"[CORRECT] Gemini response:\n{text}");

            JsonDocument doc;
            try { doc = JsonDocument.Parse(text); }
            catch (JsonException je)
            {
                throw new InvalidOperationException($"JSON invalide: {je.Message}\nTexte: {text}");
            }

            string correctionMessage = "Corrections appliquées";
            bool anyChange = false;

            using (doc)
            {
                var root = doc.RootElement;
                correctionMessage = root.TryGetProperty("message", out var msg)
                    ? msg.GetString() ?? "Corrections appliquées"
                    : "Corrections appliquées";

                if (!root.TryGetProperty("corrections", out var corrections))
                {
                    return new ChatCorrectResponseDto
                    {
                        Message = "Aucune correction identifiée. Reformule ta demande.",
                        EntityType = null,
                        Action = null,
                        UpdatedHtml = portfolio?.HtmlContent ?? ""
                    };
                }

                foreach (var correction in corrections.EnumerateArray())
                {
                    var entityType = correction.TryGetProperty("entityType", out var et)
                        ? et.GetString() : null;

                    int entityId = 0;
                    if (correction.TryGetProperty("entityId", out var eid))
                    {
                        if (eid.ValueKind == JsonValueKind.Number)
                            entityId = eid.GetInt32();
                        else if (eid.ValueKind == JsonValueKind.String)
                            int.TryParse(eid.GetString()?.Split(' ')[0].Trim(), out entityId);
                    }

                    if (entityId == 0 || string.IsNullOrEmpty(entityType)) continue;
                    if (!correction.TryGetProperty("updatedFields", out var fields)) continue;

                    if (entityType == "experience")
                    {
                        var exp = await db.Experiences.FindAsync(entityId);
                        if (exp == null) continue;

                        if (fields.TryGetProperty("companyName", out var cn) && cn.ValueKind == JsonValueKind.String && !string.IsNullOrWhiteSpace(cn.GetString()))
                            exp.CompanyName = cn.GetString()!;
                        if (fields.TryGetProperty("jobTitle", out var jt) && jt.ValueKind == JsonValueKind.String && !string.IsNullOrWhiteSpace(jt.GetString()))
                            exp.JobTitle = jt.GetString()!;
                        if (fields.TryGetProperty("description", out var desc) && desc.ValueKind == JsonValueKind.String && !string.IsNullOrWhiteSpace(desc.GetString()))
                            exp.Description = desc.GetString()!;
                        if (fields.TryGetProperty("location", out var loc) && loc.ValueKind == JsonValueKind.String && !string.IsNullOrWhiteSpace(loc.GetString()))
                            exp.Location = loc.GetString()!;
                        if (fields.TryGetProperty("technologies", out var tech) && tech.ValueKind == JsonValueKind.String && !string.IsNullOrWhiteSpace(tech.GetString()))
                            exp.Technologies = tech.GetString()!;

                        await db.SaveChangesAsync();
                        anyChange = true;
                    }
                    else if (entityType == "certification")
                    {
                        var cert = await db.Certifications.FindAsync(entityId);
                        if (cert == null) continue;

                        if (fields.TryGetProperty("name", out var nm) && nm.ValueKind == JsonValueKind.String)
                            cert.Name = nm.GetString()!;
                        if (fields.TryGetProperty("issuer", out var iss) && iss.ValueKind == JsonValueKind.String)
                            cert.Issuer = iss.GetString()!;
                        if (fields.TryGetProperty("score", out var sc))
                        {
                            if (sc.ValueKind == JsonValueKind.Number) cert.Score = sc.GetDecimal();
                            else if (sc.ValueKind == JsonValueKind.String)
                            {
                                var s = sc.GetString()?.Split('/')[0].Trim();
                                if (decimal.TryParse(s, System.Globalization.NumberStyles.Any,
                                    System.Globalization.CultureInfo.InvariantCulture, out var sv))
                                    cert.Score = sv;
                            }
                        }
                        if (fields.TryGetProperty("issueDate", out var id))
                        {
                            var dateStr = id.ValueKind == JsonValueKind.String ? id.GetString() : id.GetRawText();
                            if (!string.IsNullOrEmpty(dateStr))
                            {
                                if (DateOnly.TryParse(dateStr, out var d1)) cert.IssueDate = d1;
                                else if (int.TryParse(dateStr.Trim('"'), out var yr) && yr > 1900 && yr < 2100)
                                    cert.IssueDate = new DateOnly(yr, 1, 1);
                                else if (DateTime.TryParse(dateStr, out var dt))
                                    cert.IssueDate = DateOnly.FromDateTime(dt);
                            }
                        }
                        await db.SaveChangesAsync();
                        anyChange = true;
                    }
                    else if (entityType == "skill")
                    {
                        var skill = await db.CollaboratorSkills
                            .Include(s => s.Skill)
                            .FirstOrDefaultAsync(s => s.CollaboratorId == request.CollaboratorId
                                                   && s.SkillId == entityId);
                        if (skill == null) continue;

                        if (fields.TryGetProperty("level", out var lv) && lv.ValueKind == JsonValueKind.String)
                            skill.Level = lv.GetString()!;
                        if (fields.TryGetProperty("yearsUsed", out var yu) && yu.ValueKind == JsonValueKind.Number)
                            skill.YearsUsed = yu.GetInt32();

                        await db.SaveChangesAsync();
                        anyChange = true;
                    }
                }
            }

            if (anyChange)
            {
                // Patch le HTML directement depuis la BD — pas de Gemini
                Console.WriteLine("[CORRECT] ✓ Données sauvegardées → patch HTML sans Gemini");
                var patchedHtml = await PatchPortfolioFromProfileAsync(request.CollaboratorId, db);
                return new ChatCorrectResponseDto
                {
                    Message = correctionMessage,
                    EntityType = "multiple",
                    Action = "update",
                    UpdatedHtml = patchedHtml
                };
            }

            return new ChatCorrectResponseDto
            {
                Message = correctionMessage,
                EntityType = "multiple",
                Action = "update",
                UpdatedHtml = portfolio?.HtmlContent ?? ""
            };
        }
    }

    public class GeminiResponse { public List<GeminiCandidate>? Candidates { get; set; } }
    public class GeminiCandidate { public GeminiContent? Content { get; set; } }
    public class GeminiContent { public List<GeminiPart>? Parts { get; set; } }
    public class GeminiPart { public string? Text { get; set; } }
}*/