using BackendPortfolio.DTO;
using BackendPortfolio.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendPortfolio.Repositories
{
    public class PortfolioRepository : IPortfolioRepository
    {
        private readonly IDbContextFactory<VitrineDbContext> _factory;

        public PortfolioRepository(IDbContextFactory<VitrineDbContext> factory)
            => _factory = factory;

        public async Task<Portfolio> CreateAsync(int collaboratorId, CollaboratorDtos.CreatePortfolioDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var slug = $"portfolio-{collaboratorId}-{Guid.NewGuid().ToString("N")[..6]}";
            var portfolio = new Portfolio
            {
                CollaboratorId = collaboratorId,
                Title = dto.Title,
                Description = dto.Description,
                TargetClient = dto.TargetClient,
                Theme = dto.Theme,
                Language = dto.Language,
                PublicSlug = slug,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            db.Portfolios.Add(portfolio);
            await db.SaveChangesAsync();
            return portfolio;
        }

        public async Task<Portfolio?> GetWithItemsAsync(int portfolioId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.Portfolios
                .AsNoTracking()
                .AsSplitQuery()
                .Include(p => p.Collaborator).ThenInclude(c => c.User)
                .Include(p => p.PortfolioSkills)
    .ThenInclude(ps => ps.CollabSkill).ThenInclude(cs => cs.Skill)
                .Include(p => p.PortfolioExperiences).ThenInclude(pe => pe.Experience)
                .Include(p => p.PortfolioEducations).ThenInclude(pe => pe.Education)
                .Include(p => p.PortfolioCertifications).ThenInclude(pc => pc.Certification)
                .Include(p => p.PortfolioProjects).ThenInclude(pp => pp.Project)
                .FirstOrDefaultAsync(p => p.PortfolioId == portfolioId);
        }

        public async Task<Portfolio?> GetBySlugAsync(string slug)
        {
            await using var db = await _factory.CreateDbContextAsync();

            var portfolio = await db.Portfolios
                .AsNoTracking()
                .AsSplitQuery()
                .Include(p => p.Collaborator).ThenInclude(c => c.User)
                // ✅ Ajouter les données du collaborateur
                .Include(p => p.Collaborator).ThenInclude(c => c.CollaboratorSkills)
                    .ThenInclude(cs => cs.Skill)
                .Include(p => p.Collaborator).ThenInclude(c => c.Experiences)
                .Include(p => p.Collaborator).ThenInclude(c => c.Educations)
                .Include(p => p.Collaborator).ThenInclude(c => c.Certifications)
                .Include(p => p.Collaborator).ThenInclude(c => c.Projects)
                // Items du portfolio
                .Include(p => p.PortfolioSkills)
                    .ThenInclude(ps => ps.CollabSkill).ThenInclude(cs => cs.Skill)
                .Include(p => p.PortfolioExperiences.Where(pe => pe.IsVisible))
                    .ThenInclude(pe => pe.Experience)
                .Include(p => p.PortfolioEducations.Where(pe => pe.IsVisible))
                    .ThenInclude(pe => pe.Education)
                .Include(p => p.PortfolioCertifications.Where(pc => pc.IsVisible))
                    .ThenInclude(pc => pc.Certification)
                .Include(p => p.PortfolioProjects.Where(pp => pp.IsVisible))
                    .ThenInclude(pp => pp.Project)
                .FirstOrDefaultAsync(p => p.PublicSlug == slug && p.IsActive);

            if (portfolio == null) return null;

            await db.Portfolios
                .Where(p => p.PortfolioId == portfolio.PortfolioId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(p => p.ViewCount, p => p.ViewCount + 1)
                    .SetProperty(p => p.UpdatedAt, DateTime.UtcNow));

            return portfolio;
        }
        public async Task<List<Portfolio>> GetByCollaboratorAsync(int collaboratorId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.Portfolios
                .AsNoTracking()
                .Where(p => p.CollaboratorId == collaboratorId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Portfolio?> UpdateAsync(int portfolioId, CollaboratorDtos.UpdatePortfolioDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var portfolio = await db.Portfolios.FindAsync(portfolioId);
            if (portfolio == null) return null;
            if (dto.Title != null) portfolio.Title = dto.Title;
            if (dto.Description != null) portfolio.Description = dto.Description;
            if (dto.TargetClient != null) portfolio.TargetClient = dto.TargetClient;
            if (dto.Theme != null) portfolio.Theme = dto.Theme;
            if (dto.Language != null) portfolio.Language = dto.Language;
            if (dto.IsActive.HasValue) portfolio.IsActive = dto.IsActive.Value;
            portfolio.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return portfolio;
        }

        public async Task<bool> DeleteAsync(int portfolioId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var portfolio = await db.Portfolios.FindAsync(portfolioId);
            if (portfolio == null) return false;
            db.Portfolios.Remove(portfolio);
            await db.SaveChangesAsync();
            return true;
        }

        public async Task SetSkillsAsync(int portfolioId, List<CollaboratorDtos.PortfolioItemDto> items)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var existing = await db.PortfolioSkills
                .Where(ps => ps.PortfolioId == portfolioId).ToListAsync();
            db.PortfolioSkills.RemoveRange(existing);
            db.PortfolioSkills.AddRange(items.Select(i => new PortfolioSkill
            {
                PortfolioId = portfolioId,
                CollabSkillId = i.Id,
                IsVisible = i.IsVisible,
                DisplayOrder = i.DisplayOrder
            }));
            await db.SaveChangesAsync();
        }

        public async Task SetExperiencesAsync(int portfolioId, List<CollaboratorDtos.PortfolioItemDto> items)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var existing = await db.PortfolioExperiences
                .Where(pe => pe.PortfolioId == portfolioId).ToListAsync();
            db.PortfolioExperiences.RemoveRange(existing);
            db.PortfolioExperiences.AddRange(items.Select(i => new PortfolioExperience
            {
                PortfolioId = portfolioId,
                ExperienceId = i.Id,
                IsVisible = i.IsVisible,
                DisplayOrder = i.DisplayOrder
            }));
            await db.SaveChangesAsync();
        }

        public async Task SetEducationsAsync(int portfolioId, List<CollaboratorDtos.PortfolioItemDto> items)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var existing = await db.PortfolioEducations
                .Where(pe => pe.PortfolioId == portfolioId).ToListAsync();
            db.PortfolioEducations.RemoveRange(existing);
            db.PortfolioEducations.AddRange(items.Select(i => new PortfolioEducation
            {
                PortfolioId = portfolioId,
                EducationId = i.Id,
                IsVisible = i.IsVisible,
                DisplayOrder = i.DisplayOrder
            }));
            await db.SaveChangesAsync();
        }

        public async Task SetCertificationsAsync(int portfolioId, List<CollaboratorDtos.PortfolioItemDto> items)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var existing = await db.PortfolioCertifications
                .Where(pc => pc.PortfolioId == portfolioId).ToListAsync();
            db.PortfolioCertifications.RemoveRange(existing);
            db.PortfolioCertifications.AddRange(items.Select(i => new PortfolioCertification
            {
                PortfolioId = portfolioId,
                CertificationId = i.Id,
                IsVisible = i.IsVisible,
                DisplayOrder = i.DisplayOrder
            }));
            await db.SaveChangesAsync();
        }
        
        public async Task SetProjectsAsync(int portfolioId, List<CollaboratorDtos.PortfolioItemDto> items)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var existing = await db.PortfolioProjects
                .Where(pp => pp.PortfolioId == portfolioId).ToListAsync();
            db.PortfolioProjects.RemoveRange(existing);
            db.PortfolioProjects.AddRange(items.Select(i => new PortfolioProject
            {
                PortfolioId = portfolioId,
                ProjectId = i.Id,
                IsVisible = i.IsVisible,
                DisplayOrder = i.DisplayOrder
            }));
            await db.SaveChangesAsync();
        }
    }
}