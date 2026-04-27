using System.Text.Json;
using BackendPortfolio.DTO;
using BackendPortfolio.Models;
using BackendPortfolio.Repositories;
using BackendPortfolio.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendPortfolio.Controllers
{
    [ApiController]
    [Route("api/manager")]
    [Authorize(Roles = "vitrine-manager,vitrine-admin")]
    public class ManagerController : ControllerBase
    {
        private readonly IManagerRepository _repo;
        private readonly IManagerAiService _ai;
        private readonly IUsersRepository _users;

        public ManagerController(
            IManagerRepository repo,
            IManagerAiService ai,
            IUsersRepository users)
        {
            _repo = repo;
            _ai = ai;
            _users = users;
        }

        // ── Helpers ──────────────────────────────────────────────────────
        private async Task<Manager?> GetCurrentManagerAsync()
        {
            var userId = await _users.GetLocalUserIdAsync(User);
            if (userId == null) return null;
            return await _repo.GetManagerByUserIdAsync(userId.Value);
        }

        private static ManagerDtos.ClientNeedsDto ToNeedsDto(ClientNeed need) =>
            new(
                need.Title,
                need.Description,
               JsonSerializer.Deserialize<List<string>>(need.RequiredSkills ?? "[]") ?? new(),
               need.PreferredSkills != null
                  ? JsonSerializer.Deserialize<List<string>>(need.PreferredSkills)
            :   null,
                need.MinExperienceYears,
                need.AvailabilityRequired,
                need.RequiredCertificationsJson != null
                    ? JsonSerializer.Deserialize<List<string>>(need.RequiredCertificationsJson)
                    : null,
                need.ContractType
            );

        private static ManagerDtos.ClientNeedResponseDto ToNeedResponse(ClientNeed n) =>
            new(
                n.NeedId,
                n.ManagerId,
                n.ClientId,
                n.Title,
                n.Description,
                JsonSerializer.Deserialize<List<string>>(n.RequiredSkills ?? "[]") ?? new(),
                n.PreferredSkills != null
                ? JsonSerializer.Deserialize<List<string>>(n.PreferredSkills)
                : null,
                n.MinExperienceYears,
                n.AvailabilityRequired,
                n.RequiredCertificationsJson != null
                    ? JsonSerializer.Deserialize<List<string>>(n.RequiredCertificationsJson)
                    : null,
                n.ContractType,
                n.Status,
                n.CreatedAt
            );

        // ════════════════════════════════════════════════════════════════
        // 5.1 – Dashboard : tous les profils collaborateurs
        // GET /api/manager/dashboard
        // ════════════════════════════════════════════════════════════════
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var summaries = await _repo.GetAllCollaboratorSummariesAsync();
            return Ok(summaries);
        }

        // ════════════════════════════════════════════════════════════════
        // 5.3 – Filtrer les portfolios
        // POST /api/manager/portfolios/filter
        // ════════════════════════════════════════════════════════════════
        [HttpPost("portfolios/filter")]
        public async Task<IActionResult> FilterPortfolios(
            [FromBody] ManagerDtos.PortfolioFilterDto filter)
        {
            var result = await _repo.GetFilteredPortfoliosAsync(filter);
            return Ok(result);
        }

        // ════════════════════════════════════════════════════════════════
        // BESOINS CLIENT — CRUD
        // ════════════════════════════════════════════════════════════════

        // POST /api/manager/needs
        // Créer et persister un besoin client en BDD
        [HttpPost("needs")]
        public async Task<IActionResult> CreateNeed([FromBody] ManagerDtos.CreateClientNeedDto dto)
        {
            if (!dto.RequiredSkills.Any())
                return BadRequest(new { message = "Au moins un skill requis est nécessaire." });

            var manager = await GetCurrentManagerAsync();
            if (manager == null) return Unauthorized();

            var need = await _repo.CreateClientNeedAsync(manager.ManagerId, dto);
            return Ok(ToNeedResponse(need));
        }

        // GET /api/manager/needs
        // Liste des besoins du manager connecté
        [HttpGet("needs")]
        public async Task<IActionResult> GetMyNeeds()
        {
            var manager = await GetCurrentManagerAsync();
            if (manager == null) return Unauthorized();

            var needs = await _repo.GetClientNeedsByManagerAsync(manager.ManagerId);
            return Ok(needs.Select(ToNeedResponse));
        }

        // GET /api/manager/needs/{needId}
        [HttpGet("needs/{needId:int}")]
        public async Task<IActionResult> GetNeed(int needId)
        {
            var need = await _repo.GetClientNeedAsync(needId);
            return need == null ? NotFound() : Ok(ToNeedResponse(need));
        }

        // ════════════════════════════════════════════════════════════════
        // 5.2 – Matching : lancer sur un besoin existant (persisté)
        // POST /api/manager/needs/{needId}/match
        //
        // FLUX COMPLET :
        //   1. Manager crée un besoin via POST /api/manager/needs
        //   2. Appelle POST /api/manager/needs/{id}/match
        //   3. Reçoit la liste triée par score avec critères + suggestions
        // ════════════════════════════════════════════════════════════════
        [HttpPost("needs/{needId:int}/match")]
        public async Task<IActionResult> MatchFromNeed(int needId)
        {
            var need = await _repo.GetClientNeedAsync(needId);
            if (need == null) return NotFound(new { message = "Besoin introuvable." });

            var collabs = await _repo.GetAllCollaboratorsFullAsync();
            if (!collabs.Any()) return Ok(new List<object>());

            var needs = ToNeedsDto(need);
            var matched = await _ai.MatchCollaboratorsAsync(needs, collabs);
            return Ok(matched);
        }

        // POST /api/manager/match  (matching direct sans persistance, pratique pour tests)
        [HttpPost("match")]
        public async Task<IActionResult> MatchDirect([FromBody] ManagerDtos.CreateClientNeedDto dto)
        {
            if (!dto.RequiredSkills.Any())
                return BadRequest(new { message = "Au moins un skill requis est nécessaire." });

            var collabs = await _repo.GetAllCollaboratorsFullAsync();
            if (!collabs.Any()) return Ok(new List<object>());

            var needs = new ManagerDtos.ClientNeedsDto(
                dto.Title,
                dto.Description,
                dto.RequiredSkills,
                dto.PreferredSkills,
                dto.MinYearsExperience,
                dto.AvailabilityRequired,
                dto.RequiredCertifications,
                dto.ContractType
            );

            var matched = await _ai.MatchCollaboratorsAsync(needs, collabs);
            return Ok(matched);
        }

        // ════════════════════════════════════════════════════════════════
        // 5.4 – Critères de matching pour un collaborateur précis
        // POST /api/manager/needs/{needId}/match/{collaboratorId}/criteria
        // ════════════════════════════════════════════════════════════════
        [HttpPost("needs/{needId:int}/match/{collaboratorId:int}/criteria")]
        public async Task<IActionResult> GetCriteria(int needId, int collaboratorId)
        {
            var need = await _repo.GetClientNeedAsync(needId);
            if (need == null) return NotFound(new { message = "Besoin introuvable." });

            var collab = await _repo.GetCollaboratorFullAsync(collaboratorId);
            if (collab == null) return NotFound(new { message = "Collaborateur introuvable." });

            var needs = ToNeedsDto(need);
            
            var (score, breakdown, matched, missing) = ManagerAiService.ComputeScore(needs, collab);

            return Ok(new
            {
                CollaboratorId = collab.CollaboratorId,
                CollaboratorName = $"{collab.User?.FirstName} {collab.User?.LastName}",
                MatchScore = Math.Round(score, 1),
                Breakdown = breakdown,
                MatchedSkills = matched,
                MissingSkills = missing,
                Badges = ManagerRepository.ComputeBadges(collab)
            });
        }

        // ════════════════════════════════════════════════════════════════
        // 5.5 – Suggestions d'amélioration (IA HuggingFace)
        // POST /api/manager/needs/{needId}/match/{collaboratorId}/suggestions
        // ════════════════════════════════════════════════════════════════
        [HttpPost("needs/{needId:int}/match/{collaboratorId:int}/suggestions")]
        public async Task<IActionResult> GetSuggestions(int needId, int collaboratorId)
        {
            var need = await _repo.GetClientNeedAsync(needId);
            if (need == null) return NotFound(new { message = "Besoin introuvable." });

            var collab = await _repo.GetCollaboratorFullAsync(collaboratorId);
            if (collab == null) return NotFound(new { message = "Collaborateur introuvable." });

            var suggestions = await _ai.GetImprovementSuggestionsAsync(ToNeedsDto(need), collab);
            return Ok(suggestions);
        }

        // ════════════════════════════════════════════════════════════════
        // 5.6 – Badges d'un collaborateur
        // GET /api/manager/collaborators/{collaboratorId}/badges
        // ════════════════════════════════════════════════════════════════
        [HttpGet("collaborators/{collaboratorId:int}/badges")]
        public async Task<IActionResult> GetBadges(int collaboratorId)
        {
            var collab = await _repo.GetCollaboratorFullAsync(collaboratorId);
            if (collab == null) return NotFound(new { message = "Collaborateur introuvable." });

            return Ok(new
            {
                CollaboratorId = collaboratorId,
                CollaboratorName = $"{collab.User?.FirstName} {collab.User?.LastName}",
                Badges = ManagerRepository.ComputeBadges(collab)
            });
        }

        // GET /api/manager/collaborators/{collaboratorId}
        [HttpGet("collaborators/{collaboratorId:int}")]
        public async Task<IActionResult> GetCollaboratorDetail(int collaboratorId)
        {
            var collab = await _repo.GetCollaboratorFullAsync(collaboratorId);
            if (collab == null) return NotFound(new { message = "Collaborateur introuvable." });

            return Ok(new
            {
                collab.CollaboratorId,
                FirstName = collab.User?.FirstName,
                LastName = collab.User?.LastName,
                AvatarUrl = collab.User?.AvatarUrl,
                collab.JobTitle,
                collab.Bio,
                collab.YearsExperience,
                collab.AvailabilityStatus,
                collab.AvailabilityDate,
                collab.LinkedinUrl,
                collab.GithubUrl,
                collab.IsPublic,
                Badges = ManagerRepository.ComputeBadges(collab),
                Skills = collab.CollaboratorSkills.Select(cs => new
                {
                    cs.CollabSkillId,
                    Name = cs.Skill?.Name,
                    cs.Level,
                    cs.YearsUsed,
                    cs.IsPrimary
                }),
                Experiences = collab.Experiences.OrderByDescending(e => e.StartDate),
                Educations = collab.Educations,
                Certifications = collab.Certifications,
                Projects = collab.Projects
            });
        }
    }
}