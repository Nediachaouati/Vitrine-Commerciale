/*
using BackendPortfolio.Models;
using BackendPortfolio.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static BackendPortfolio.DTO.CollaboratorDtos;


namespace BackendPortfolio.Controllers
{
    [ApiController]
    [Route("api/collaborator")]
    [Authorize]
    public class CollaboratorDataController : ControllerBase
    {
        private readonly VitrineDbContext _db;
        private readonly IUsersRepository _users;

        public CollaboratorDataController(VitrineDbContext db, IUsersRepository users)
        {
            _db = db;
            _users = users;
        }

        // ── Helper : récupère le collaborator de l'utilisateur connecté ──
        private async Task<Collaborator?> GetMyCollaboratorAsync()
        {
            var userId = await _users.GetLocalUserIdAsync(User);
            if (userId == null) return null;
            return await _db.Collaborators.FirstOrDefaultAsync(c => c.UserId == userId);
        }

        // ════════════════════════════════════════════════════════════
        // EXPÉRIENCES
        // ════════════════════════════════════════════════════════════

        // GET /api/collaborator/experiences
        [HttpGet("experiences")]
        public async Task<IActionResult> GetMyExperiences()
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var exps = await _db.Experiences
                .Where(e => e.CollaboratorId == collab.CollaboratorId)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync();

            return Ok(exps);
        }

        // POST /api/collaborator/experiences
        [HttpPost("experiences")]
        public async Task<IActionResult> AddExperience([FromBody] AddExperienceDto dto)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            if (!dto.IsCurrent && dto.EndDate.HasValue && dto.EndDate.Value < dto.StartDate)
                return BadRequest(new { message = "La date de fin ne peut pas être antérieure à la date de début" });

            var exp = new Experience
            {
                CollaboratorId = collab.CollaboratorId,
                CompanyName = dto.CompanyName.Trim(),
                JobTitle = dto.JobTitle.Trim(),
                Description = dto.Description?.Trim(),
                StartDate = dto.StartDate,
                EndDate = dto.IsCurrent ? null : dto.EndDate,
                IsCurrent = dto.IsCurrent,
                Location = dto.Location?.Trim(),
                Technologies = dto.Technologies?.Trim(),
                ContractType = dto.ContractType
            };

            _db.Experiences.Add(exp);
            await _db.SaveChangesAsync();
            return Ok(exp);
        }

        // PUT /api/collaborator/experiences/{id}
        [HttpPut("experiences/{id}")]
        public async Task<IActionResult> UpdateExperience(int id, [FromBody] UpdateExperienceDto dto)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var exp = await _db.Experiences
                .FirstOrDefaultAsync(e => e.ExperienceId == id && e.CollaboratorId == collab.CollaboratorId);
            if (exp == null) return NotFound();

            if (dto.CompanyName != null) exp.CompanyName = dto.CompanyName.Trim();
            if (dto.JobTitle != null) exp.JobTitle = dto.JobTitle.Trim();
            if (dto.Description != null) exp.Description = dto.Description.Trim();
            if (dto.Location != null) exp.Location = dto.Location.Trim();
            if (dto.Technologies != null) exp.Technologies = dto.Technologies.Trim();
            if (dto.ContractType != null) exp.ContractType = dto.ContractType;
            if (dto.StartDate.HasValue) exp.StartDate = dto.StartDate.Value;
            if (dto.IsCurrent.HasValue)
            {
                exp.IsCurrent = dto.IsCurrent.Value;
                if (dto.IsCurrent.Value) exp.EndDate = null;
            }
            if (dto.EndDate.HasValue && !exp.IsCurrent) exp.EndDate = dto.EndDate.Value;

            await _db.SaveChangesAsync();
            return Ok(exp);
        }

        // DELETE /api/collaborator/experiences/{id}
        [HttpDelete("experiences/{id}")]
        public async Task<IActionResult> DeleteExperience(int id)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var exp = await _db.Experiences
                .FirstOrDefaultAsync(e => e.ExperienceId == id && e.CollaboratorId == collab.CollaboratorId);
            if (exp == null) return NotFound();

            // Supprimer d'abord les liaisons portfolio
            var links = _db.PortfolioExperiences.Where(pe => pe.ExperienceId == id);
            _db.PortfolioExperiences.RemoveRange(links);

            _db.Experiences.Remove(exp);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // ════════════════════════════════════════════════════════════
        // SKILLS
        // ════════════════════════════════════════════════════════════

        // GET /api/collaborator/skills
        [HttpGet("skills")]
        public async Task<IActionResult> GetMySkills()
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var skills = await _db.CollaboratorSkills
                .Include(cs => cs.Skill)
                .Where(cs => cs.CollaboratorId == collab.CollaboratorId)
                .OrderByDescending(cs => cs.IsPrimary)
                .ThenBy(cs => cs.Skill!.Name)
                .Select(cs => new
                {
                    cs.CollabSkillId,
                    cs.SkillId,
                    SkillName = cs.Skill!.Name,
                    Category = cs.Skill.Category,
                    IconUrl = cs.Skill.IconUrl,
                    cs.Level,
                    cs.YearsUsed,
                    cs.IsPrimary
                })
                .ToListAsync();

            return Ok(skills);
        }

        // POST /api/collaborator/skills
        [HttpPost("skills")]
        public async Task<IActionResult> AddSkill([FromBody] AddSkillDto dto)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var skillExists = await _db.SkillCatalogs.AnyAsync(s => s.SkillId == dto.SkillId);
            if (!skillExists) return NotFound(new { message = $"Skill {dto.SkillId} introuvable dans le catalogue" });

            var alreadyExists = await _db.CollaboratorSkills
                .AnyAsync(cs => cs.CollaboratorId == collab.CollaboratorId && cs.SkillId == dto.SkillId);
            if (alreadyExists) return Conflict(new { message = "Ce skill est déjà associé à ce collaborateur" });

            var skill = new CollaboratorSkill
            {
                CollaboratorId = collab.CollaboratorId,
                SkillId = dto.SkillId,
                Level = dto.Level,
                YearsUsed = dto.YearsUsed,
                IsPrimary = dto.IsPrimary
            };

            _db.CollaboratorSkills.Add(skill);
            await _db.SaveChangesAsync();
            return Ok(skill);
        }

        // PUT /api/collaborator/skills/{skillId}
        [HttpPut("skills/{skillId}")]
        public async Task<IActionResult> UpdateSkill(int skillId, [FromBody] UpdateSkillDto dto)
        { 
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var skill = await _db.CollaboratorSkills
                .FirstOrDefaultAsync(cs => cs.CollaboratorId == collab.CollaboratorId && cs.SkillId == skillId);
            if (skill == null) return NotFound();

            if (dto.Level != null) skill.Level = dto.Level;
            if (dto.YearsUsed.HasValue) skill.YearsUsed = dto.YearsUsed.Value;
            if (dto.IsPrimary.HasValue) skill.IsPrimary = dto.IsPrimary.Value;

            await _db.SaveChangesAsync();
            return Ok(skill);
        }

        // DELETE /api/collaborator/skills/{skillId}
        [HttpDelete("skills/{skillId}")]
        public async Task<IActionResult> DeleteSkill(int skillId)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var skill = await _db.CollaboratorSkills
                .FirstOrDefaultAsync(cs => cs.CollaboratorId == collab.CollaboratorId && cs.SkillId == skillId);
            if (skill == null) return NotFound();

            // Supprimer les liaisons portfolio
            var links = _db.PortfolioSkills.Where(ps => ps.CollabSkillId == skill.CollabSkillId);
            _db.PortfolioSkills.RemoveRange(links);

            _db.CollaboratorSkills.Remove(skill);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // ════════════════════════════════════════════════════════════
        // CERTIFICATIONS
        // ════════════════════════════════════════════════════════════

        // GET /api/collaborator/certifications
        [HttpGet("certifications")]
        public async Task<IActionResult> GetMyCertifications()
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var certs = await _db.Certifications
                .Where(c => c.CollaboratorId == collab.CollaboratorId)
                .OrderByDescending(c => c.IssueDate)
                .ToListAsync();

            return Ok(certs);
        }

        // POST /api/collaborator/certifications
        [HttpPost("certifications")]
        public async Task<IActionResult> AddCertification([FromBody] AddCertificationDto dto)

        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var cert = new Certification
            {
                CollaboratorId = collab.CollaboratorId,
                Name = dto.Name,
                Issuer = dto.Issuer,
                IssueDate = dto.IssueDate,
                ExpiryDate = dto.ExpiryDate,
                CredentialUrl = dto.CredentialUrl,
                BadgeUrl = dto.BadgeUrl,
                Score = dto.Score
            };

            _db.Certifications.Add(cert);
            await _db.SaveChangesAsync();
            return Ok(cert);
        }

        // PUT /api/collaborator/certifications/{id}
        [HttpPut("certifications/{id}")]
        public async Task<IActionResult> UpdateCertification(int id, [FromBody] UpdateCertificationDto dto)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var cert = await _db.Certifications
                .FirstOrDefaultAsync(c => c.CertificationId == id && c.CollaboratorId == collab.CollaboratorId);
            if (cert == null) return NotFound();

            if (dto.Name != null) cert.Name = dto.Name;
            if (dto.Issuer != null) cert.Issuer = dto.Issuer;
            if (dto.IssueDate.HasValue) cert.IssueDate = dto.IssueDate.Value;
            if (dto.ExpiryDate.HasValue) cert.ExpiryDate = dto.ExpiryDate.Value;
            if (dto.CredentialUrl != null) cert.CredentialUrl = dto.CredentialUrl;
            if (dto.Score.HasValue) cert.Score = dto.Score.Value;

            await _db.SaveChangesAsync();
            return Ok(cert);
        }

        // DELETE /api/collaborator/certifications/{id}
        [HttpDelete("certifications/{id}")]
        public async Task<IActionResult> DeleteCertification(int id)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var cert = await _db.Certifications
                .FirstOrDefaultAsync(c => c.CertificationId == id && c.CollaboratorId == collab.CollaboratorId);
            if (cert == null) return NotFound();

            var links = _db.PortfolioCertifications.Where(pc => pc.CertificationId == id);
            _db.PortfolioCertifications.RemoveRange(links);

            _db.Certifications.Remove(cert);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // ════════════════════════════════════════════════════════════
        // EDUCATION
        // ════════════════════════════════════════════════════════════

        // GET /api/collaborator/education
        [HttpGet("education")]
        public async Task<IActionResult> GetMyEducation()
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var edu = await _db.Educations
                .Where(e => e.CollaboratorId == collab.CollaboratorId)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync();

            return Ok(edu);
        }

        // POST /api/collaborator/education
        [HttpPost("education")]
        public async Task<IActionResult> AddEducation([FromBody] AddEducationDto dto)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var edu = new Education
            {
                CollaboratorId = collab.CollaboratorId,
                School = dto.School,
                Degree = dto.Degree,
                Field = dto.Field,
                StartDate = dto.StartDate,
                EndDate = dto.IsCurrent ? null : dto.EndDate,
                IsCurrent = dto.IsCurrent,
                Grade = dto.Grade,
                Description = dto.Description
            };

            _db.Educations.Add(edu);
            await _db.SaveChangesAsync();
            return Ok(edu);
        }

        // PUT /api/collaborator/education/{id}
        [HttpPut("education/{id}")]
        public async Task<IActionResult> UpdateEducation(int id, [FromBody] UpdateEducationDto dto)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var edu = await _db.Educations
                .FirstOrDefaultAsync(e => e.EducationId == id && e.CollaboratorId == collab.CollaboratorId);
            if (edu == null) return NotFound();

            if (dto.School != null) edu.School = dto.School;
            if (dto.Degree != null) edu.Degree = dto.Degree;
            if (dto.Field != null) edu.Field = dto.Field;
            if (dto.StartDate.HasValue) edu.StartDate = dto.StartDate.Value;
            if (dto.IsCurrent.HasValue)
            {
                edu.IsCurrent = dto.IsCurrent.Value;
                if (dto.IsCurrent.Value) edu.EndDate = null;
            }
            if (dto.EndDate.HasValue && !edu.IsCurrent) edu.EndDate = dto.EndDate.Value;
            if (dto.Grade != null) edu.Grade = dto.Grade;
            if (dto.Description != null) edu.Description = dto.Description;

            await _db.SaveChangesAsync();
            return Ok(edu);
        }

        // DELETE /api/collaborator/education/{id}
        [HttpDelete("education/{id}")]
        public async Task<IActionResult> DeleteEducation(int id)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var edu = await _db.Educations
                .FirstOrDefaultAsync(e => e.EducationId == id && e.CollaboratorId == collab.CollaboratorId);
            if (edu == null) return NotFound();

            var links = _db.PortfolioEducations.Where(pe => pe.EducationId == id);
            _db.PortfolioEducations.RemoveRange(links);

            _db.Educations.Remove(edu);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // ════════════════════════════════════════════════════════════
        // PROJECTS
        // ════════════════════════════════════════════════════════════

        // GET /api/collaborator/projects
        [HttpGet("projects")]
        public async Task<IActionResult> GetMyProjects()
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var projects = await _db.Projects
                .Where(p => p.CollaboratorId == collab.CollaboratorId)
                .OrderByDescending(p => p.StartDate)
                .ToListAsync();

            return Ok(projects);
        }

        // POST /api/collaborator/projects
        [HttpPost("projects")]
        public async Task<IActionResult> AddProject([FromBody] AddProjectDto dto)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var project = new Project
            {
                CollaboratorId = collab.CollaboratorId,
                Title = dto.Title,
                Description = dto.Description,
                Technologies = dto.Technologies,
                ProjectUrl = dto.ProjectUrl,
                GithubUrl = dto.GithubUrl,
                ScreenshotUrl = dto.ScreenshotUrl,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                RoleInProject = dto.RoleInProject
            };

            _db.Projects.Add(project);
            await _db.SaveChangesAsync();
            return Ok(project);
        }

        // PUT /api/collaborator/projects/{id}
        [HttpPut("projects/{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] UpdateProjectDto dto)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var project = await _db.Projects
                .FirstOrDefaultAsync(p => p.ProjectId == id && p.CollaboratorId == collab.CollaboratorId);
            if (project == null) return NotFound();

            if (dto.Title != null) project.Title = dto.Title;
            if (dto.Description != null) project.Description = dto.Description;
            if (dto.Technologies != null) project.Technologies = dto.Technologies;
            if (dto.ProjectUrl != null) project.ProjectUrl = dto.ProjectUrl;
            if (dto.GithubUrl != null) project.GithubUrl = dto.GithubUrl;
            if (dto.ScreenshotUrl != null) project.ScreenshotUrl = dto.ScreenshotUrl;
            if (dto.StartDate.HasValue) project.StartDate = dto.StartDate.Value;
            if (dto.EndDate.HasValue) project.EndDate = dto.EndDate.Value;
            if (dto.RoleInProject != null) project.RoleInProject = dto.RoleInProject;

            await _db.SaveChangesAsync();
            return Ok(project);
        }

        // DELETE /api/collaborator/projects/{id}
        [HttpDelete("projects/{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var collab = await GetMyCollaboratorAsync();
            if (collab == null) return Unauthorized();

            var project = await _db.Projects
                .FirstOrDefaultAsync(p => p.ProjectId == id && p.CollaboratorId == collab.CollaboratorId);
            if (project == null) return NotFound();

            var links = _db.PortfolioProjects.Where(pp => pp.ProjectId == id);
            _db.PortfolioProjects.RemoveRange(links);

            _db.Projects.Remove(project);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // ════════════════════════════════════════════════════════════
        // SKILL CATALOG (lecture seule pour le collaborateur)
        // ════════════════════════════════════════════════════════════

        // GET /api/collaborator/skill-catalog
        [HttpGet("skill-catalog")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSkillCatalog([FromQuery] string? category = null)
        {
            var query = _db.SkillCatalogs.AsQueryable();
            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(s => s.Category == category);

            var skills = await query
                .OrderBy(s => s.Category)
                .ThenBy(s => s.Name)
                .ToListAsync();

            return Ok(skills);
        }

        [HttpPost("skill-catalog")]
        [AllowAnonymous] // Mets [Authorize(Roles="Admin")] en prod
        public async Task<IActionResult> Add([FromBody] CreateSkillDto dto)
        {
            var skill = new SkillCatalog
            {
                Name = dto.Name.Trim(),
                Category = dto.Category.Trim(),
                IconUrl = dto.IconUrl?.Trim()
            };
            _db.SkillCatalogs.Add(skill);
            await _db.SaveChangesAsync();
            return Ok(skill);
        }

        // DELETE /api/skillcatalog/{id}
        [HttpDelete("skill-catalog/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Delete(int id)
        {
            var skill = await _db.SkillCatalogs.FindAsync(id);
            if (skill == null) return NotFound();
            _db.SkillCatalogs.Remove(skill);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

    public record CreateSkillDto(string Name, string Category, string? IconUrl);
}
*/