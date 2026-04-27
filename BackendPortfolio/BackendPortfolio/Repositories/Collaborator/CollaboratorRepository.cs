using BackendPortfolio.DTO;
using BackendPortfolio.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendPortfolio.Repositories.Collaborator
{
    public class CollaboratorRepository : ICollaboratorRepository
    {
        private readonly IDbContextFactory<VitrineDbContext> _factory;

        public CollaboratorRepository(IDbContextFactory<VitrineDbContext> factory)
            => _factory = factory;

        public async Task<Models.Collaborator?> GetByUserIdAsync(Guid userId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.Collaborators
                .AsNoTracking()
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

        public async Task<Models.Collaborator?> GetFullAsync(int collaboratorId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.Collaborators
                .AsNoTracking()
                .Include(c => c.User)
                .Include(c => c.CollaboratorSkills).ThenInclude(s => s.Skill)  // ← CollaboratorSkills
                .Include(c => c.Experiences)
                .Include(c => c.Educations)
                .Include(c => c.Certifications)
                .Include(c => c.Projects)
                .Include(c => c.Portfolios)
                .FirstOrDefaultAsync(c => c.CollaboratorId == collaboratorId);
        }

        // ── SKILLS ──────────────────────────────────────────────────────
        public async Task<CollaboratorSkill> AddSkillAsync(int collaboratorId, CollaboratorDtos.AddSkillDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();

            // Vérifier que le skill existe dans le catalogue
            var skillExists = await db.SkillCatalogs.AnyAsync(s => s.SkillId == dto.SkillId);
            if (!skillExists) throw new KeyNotFoundException($"Skill {dto.SkillId} introuvable dans le catalogue");

            // Vérifier doublon
            var exists = await db.CollaboratorSkills
                .AnyAsync(cs => cs.CollaboratorId == collaboratorId && cs.SkillId == dto.SkillId);
            if (exists) throw new InvalidOperationException("Ce skill est déjà associé au collaborateur");

            var skill = new CollaboratorSkill
            {
                CollaboratorId = collaboratorId,
                SkillId = dto.SkillId,
                Level = dto.Level,
                YearsUsed = dto.YearsUsed,
                IsPrimary = dto.IsPrimary
            };
            db.CollaboratorSkills.Add(skill);
            await db.SaveChangesAsync();
            return skill;
        }

        public async Task<CollaboratorSkill?> UpdateSkillAsync(int collabSkillId, CollaboratorDtos.UpdateSkillDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var skill = await db.CollaboratorSkills.FindAsync(collabSkillId);
            if (skill == null) return null;
            if (dto.Level != null) skill.Level = dto.Level;
            if (dto.YearsUsed.HasValue) skill.YearsUsed = dto.YearsUsed.Value;
            if (dto.IsPrimary.HasValue) skill.IsPrimary = dto.IsPrimary.Value;
            await db.SaveChangesAsync();
            return skill;
        }

        public async Task<bool> DeleteSkillAsync(int collabSkillId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var skill = await db.CollaboratorSkills.FindAsync(collabSkillId);
            if (skill == null) return false;
            db.CollaboratorSkills.Remove(skill);
            await db.SaveChangesAsync();
            return true;
        }

        // ── EXPERIENCES ──────────────────────────────────────────────────
        public async Task<Experience> AddExperienceAsync(int collaboratorId, CollaboratorDtos.AddExperienceDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var exp = new Experience
            {
                CollaboratorId = collaboratorId,
                CompanyName = dto.CompanyName,
                JobTitle = dto.JobTitle,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.IsCurrent ? null : dto.EndDate,
                IsCurrent = dto.IsCurrent,
                Location = dto.Location,
                Technologies = dto.Technologies,
                ContractType = dto.ContractType
            };
            db.Experiences.Add(exp);
            await db.SaveChangesAsync();
            return exp;
        }

        public async Task<Experience?> UpdateExperienceAsync(int experienceId, CollaboratorDtos.UpdateExperienceDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var exp = await db.Experiences.FindAsync(experienceId);
            if (exp == null) return null;
            if (dto.CompanyName != null) exp.CompanyName = dto.CompanyName;
            if (dto.JobTitle != null) exp.JobTitle = dto.JobTitle;
            if (dto.Description != null) exp.Description = dto.Description;
            if (dto.StartDate.HasValue) exp.StartDate = dto.StartDate.Value;
            if (dto.IsCurrent.HasValue)
            {
                exp.IsCurrent = dto.IsCurrent.Value;
                if (dto.IsCurrent.Value) exp.EndDate = null;
            }
            if (dto.EndDate.HasValue && !exp.IsCurrent) exp.EndDate = dto.EndDate.Value;
            if (dto.Location != null) exp.Location = dto.Location;
            if (dto.Technologies != null) exp.Technologies = dto.Technologies;
            if (dto.ContractType != null) exp.ContractType = dto.ContractType;
            await db.SaveChangesAsync();
            return exp;
        }

        public async Task<bool> DeleteExperienceAsync(int experienceId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var exp = await db.Experiences.FindAsync(experienceId);
            if (exp == null) return false;
            db.Experiences.Remove(exp);
            await db.SaveChangesAsync();
            return true;
        }

        // ── EDUCATION ────────────────────────────────────────────────────
        public async Task<Education> AddEducationAsync(int collaboratorId, CollaboratorDtos.AddEducationDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var ed = new Education
            {
                CollaboratorId = collaboratorId,
                School = dto.School,
                Degree = dto.Degree,
                Field = dto.Field,
                StartDate = dto.StartDate,
                EndDate = dto.IsCurrent ? null : dto.EndDate,
                IsCurrent = dto.IsCurrent,
                Grade = dto.Grade,
                Description = dto.Description
            };
            db.Educations.Add(ed);
            await db.SaveChangesAsync();
            return ed;
        }

        public async Task<Education?> UpdateEducationAsync(int educationId, CollaboratorDtos.UpdateEducationDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var ed = await db.Educations.FindAsync(educationId);
            if (ed == null) return null;
            if (dto.School != null) ed.School = dto.School;
            if (dto.Degree != null) ed.Degree = dto.Degree;
            if (dto.Field != null) ed.Field = dto.Field;
            if (dto.StartDate.HasValue) ed.StartDate = dto.StartDate.Value;
            if (dto.IsCurrent.HasValue)
            {
                ed.IsCurrent = dto.IsCurrent.Value;
                if (dto.IsCurrent.Value) ed.EndDate = null;
            }
            if (dto.EndDate.HasValue && !ed.IsCurrent) ed.EndDate = dto.EndDate.Value;
            if (dto.Grade != null) ed.Grade = dto.Grade;
            if (dto.Description != null) ed.Description = dto.Description;
            await db.SaveChangesAsync();
            return ed;
        }

        public async Task<bool> DeleteEducationAsync(int educationId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var ed = await db.Educations.FindAsync(educationId);
            if (ed == null) return false;
            db.Educations.Remove(ed);
            await db.SaveChangesAsync();
            return true;
        }

        // ── CERTIFICATIONS ───────────────────────────────────────────────
        public async Task<Certification> AddCertificationAsync(int collaboratorId, CollaboratorDtos.AddCertificationDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var cert = new Certification
            {
                CollaboratorId = collaboratorId,
                Name = dto.Name,
                Issuer = dto.Issuer,
                IssueDate = dto.IssueDate,
                ExpiryDate = dto.ExpiryDate,
                CredentialUrl = dto.CredentialUrl,
                BadgeUrl = dto.BadgeUrl,
                Score = dto.Score
            };
            db.Certifications.Add(cert);
            await db.SaveChangesAsync();
            return cert;
        }

        public async Task<Certification?> UpdateCertificationAsync(int certificationId, CollaboratorDtos.UpdateCertificationDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var cert = await db.Certifications.FindAsync(certificationId);
            if (cert == null) return null;
            if (dto.Name != null) cert.Name = dto.Name;
            if (dto.Issuer != null) cert.Issuer = dto.Issuer;
            if (dto.IssueDate.HasValue) cert.IssueDate = dto.IssueDate.Value;
            if (dto.ExpiryDate.HasValue) cert.ExpiryDate = dto.ExpiryDate.Value;
            if (dto.CredentialUrl != null) cert.CredentialUrl = dto.CredentialUrl;
            if (dto.Score.HasValue) cert.Score = dto.Score.Value;
            await db.SaveChangesAsync();
            return cert;
        }

        public async Task<bool> DeleteCertificationAsync(int certificationId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var cert = await db.Certifications.FindAsync(certificationId);
            if (cert == null) return false;
            db.Certifications.Remove(cert);
            await db.SaveChangesAsync();
            return true;
        }

        // ── PROJECTS ─────────────────────────────────────────────────────
        public async Task<Project> AddProjectAsync(int collaboratorId, CollaboratorDtos.AddProjectDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var project = new Project
            {
                CollaboratorId = collaboratorId,
                Title = dto.Title,
                Description = dto.Description,
                Technologies = dto.Technologies,
                ProjectUrl = dto.ProjectUrl,
                GithubUrl = dto.GithubUrl,
                ScreenshotUrl = dto.ScreenshotUrl,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                RoleInProject = dto.RoleInProject,
               
            };
            db.Projects.Add(project);
            await db.SaveChangesAsync();
            return project;
        }

        public async Task<Project?> UpdateProjectAsync(int projectId, CollaboratorDtos.UpdateProjectDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var project = await db.Projects.FindAsync(projectId);
            if (project == null) return null;
            if (dto.Title != null) project.Title = dto.Title;
            if (dto.Description != null) project.Description = dto.Description;
            if (dto.Technologies != null) project.Technologies = dto.Technologies;
            if (dto.ProjectUrl != null) project.ProjectUrl = dto.ProjectUrl;
            if (dto.GithubUrl != null) project.GithubUrl = dto.GithubUrl;
            if (dto.StartDate.HasValue) project.StartDate = dto.StartDate.Value;
            if (dto.EndDate.HasValue) project.EndDate = dto.EndDate.Value;
            if (dto.RoleInProject != null) project.RoleInProject = dto.RoleInProject;
        
            await db.SaveChangesAsync();
            return project;
        }

        public async Task<bool> DeleteProjectAsync(int projectId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var project = await db.Projects.FindAsync(projectId);
            if (project == null) return false;
            db.Projects.Remove(project);
            await db.SaveChangesAsync();
            return true;
        }

        //update bio
        public async Task UpdateBioAsync(int collaboratorId, string bio)
        {
            await using var db = await _factory.CreateDbContextAsync();
            await db.Collaborators
                .Where(c => c.CollaboratorId == collaboratorId)
                .ExecuteUpdateAsync(s => s.SetProperty(c => c.Bio, bio));
        }
    }
}