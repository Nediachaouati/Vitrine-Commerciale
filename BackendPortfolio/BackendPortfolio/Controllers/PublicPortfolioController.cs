using System.Linq;
using System.Text.Json;
using BackendPortfolio.DTO;
using BackendPortfolio.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BackendPortfolio.Controllers
{
    [ApiController]
    [Route("api/public")]
    [AllowAnonymous]
    public class PublicPortfolioController : ControllerBase
    {
        private readonly IManagerRepository _repo;

        public PublicPortfolioController(IManagerRepository repo)
            => _repo = repo;

        // ════════════════════════════════════════════════════════════════
        // GET /api/public/portfolio-view/{shareSlug}
        // Ce que le CLIENT voit — portfolio filtré et repositionné
        // ════════════════════════════════════════════════════════════════
        [HttpGet("portfolio-view/{shareSlug}")]
        public async Task<IActionResult> GetPortfolioView(string shareSlug)
        {
            var view = await _repo.GetViewByShareSlugAsync(shareSlug);
            if (view == null)
                return NotFound(new { message = "Lien invalide ou expiré." });
            if (view.Status != "ready")
                return StatusCode(202, new { message = "Portfolio en cours de génération." });

            var collab = view.Portfolio.Collaborator;

            // Désérialise les IDs sélectionnés par l'IA
            var selectedProjectIds = DeserializeList<int>(view.SelectedProjectIdsJson);
            var selectedSkillIds = DeserializeList<int>(view.SelectedSkillIdsJson);
            var selectedExpIds = DeserializeList<int>(view.SelectedExperienceIdsJson);
            var selectedCertIds = DeserializeList<int>(view.SelectedCertificationIdsJson);

            // ── Projets filtrés et triés par ordre de pertinence IA ──
            var projects = collab.Projects
                .Where(p => selectedProjectIds.Contains(p.ProjectId))
                .OrderBy(p => selectedProjectIds.IndexOf(p.ProjectId))
                .Select((p, i) => new ManagerDtos.PublicProjectDto(
                    p.ProjectId,
                    p.Title,
                    p.Description,
                    p.Technologies,      // ✅ Technologies pas TechStack
                    p.ProjectUrl,
                    p.ScreenshotUrl,     // ✅ ScreenshotUrl pas ImageUrl
                    i))
                .ToList();

            // ── Skills filtrées et triées ────────────────────────────
            var skills = collab.CollaboratorSkills
                .Where(cs => selectedSkillIds.Contains(cs.CollabSkillId))
                .OrderBy(cs => selectedSkillIds.IndexOf(cs.CollabSkillId))
                .Select((cs, i) => new ManagerDtos.PublicSkillDto(
                    cs.CollabSkillId,
                    cs.Skill?.Name ?? "",
                    cs.Level,
                    cs.YearsUsed,
                    cs.IsPrimary,
                    i))
                .ToList();

            // ── Expériences filtrées ─────────────────────────────────
            var experiences = collab.Experiences
                .Where(e => selectedExpIds.Contains(e.ExperienceId))
                .OrderBy(e => selectedExpIds.IndexOf(e.ExperienceId))
                .Select((e, i) => new ManagerDtos.PublicExperienceDto(
                    e.ExperienceId,
                    e.CompanyName,       // ✅ CompanyName pas Company
                    e.JobTitle,
                    e.Description,
                    e.StartDate,         
                    e.EndDate,           
                    e.IsCurrent,
                    i))
                .ToList();

            // ── Certifications filtrées ──────────────────────────────
            var certifications = collab.Certifications
                .Where(c => selectedCertIds.Contains(c.CertificationId))
                .OrderBy(c => selectedCertIds.IndexOf(c.CertificationId))
                .Select((c, i) => new ManagerDtos.PublicCertificationDto(
                    c.CertificationId,
                    c.Name,
                    c.Issuer,          
                    c.IssueDate,       
                    c.ExpiryDate,      
                    c.CredentialUrl,
                    i))
                .ToList();

            var result = new ManagerDtos.PublicPortfolioViewDto(
                view.TargetTech,
                view.GeneratedTitle ?? "",
                view.GeneratedBio ?? "",
                view.MissionContext,
                view.RelevanceScore,
                new ManagerDtos.CollaboratorPublicInfoDto(
                    collab.User?.FirstName ?? "",
                    collab.User?.LastName ?? "",
                    collab.User?.AvatarUrl,
                    collab.JobTitle ?? "",
                    collab.YearsExperience,
                    collab.AvailabilityStatus,
                    collab.LinkedinUrl,
                    collab.GithubUrl),
                projects,
                skills,
                experiences,
                certifications);

            return Ok(result);
        }

        // ── Helper deserialize safe ───────────────────────────────────
        private static List<T> DeserializeList<T>(string? json)
        {
            if (string.IsNullOrEmpty(json)) return new List<T>();
            try
            {
                return JsonSerializer.Deserialize<List<T>>(json) ?? new List<T>();
            }
            catch
            {
                return new List<T>();
            }
        }
    }
}