using System.Text.Json;
using BackendPortfolio.DTO;
using BackendPortfolio.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendPortfolio.Repositories
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly IDbContextFactory<VitrineDbContext> _factory;

        public ManagerRepository(IDbContextFactory<VitrineDbContext> factory)
            => _factory = factory;

        // ── 5.1 Dashboard ────────────────────────────────────────────────
        public async Task<List<ManagerDtos.CollaboratorSummaryDto>> GetAllCollaboratorSummariesAsync()
        {
            await using var db = await _factory.CreateDbContextAsync();
            var collabs = await db.Collaborators
                .AsNoTracking()
                .AsSplitQuery() // ✅
                .Include(c => c.User)
                .Include(c => c.CollaboratorSkills).ThenInclude(cs => cs.Skill)
                .Include(c => c.Certifications)
                .Include(c => c.Portfolios)
                .Where(c => c.IsPublic && c.Portfolios.Any(p => p.IsActive && p.PublicSlug != null))
                .ToListAsync();

            return collabs.Select(MapToSummary).ToList();
        }
        // ── 5.3 Portfolios filtrés ───────────────────────────────────────
        public async Task<List<ManagerDtos.PortfolioListItemDto>> GetFilteredPortfoliosAsync(
    ManagerDtos.PortfolioFilterDto filter)
        {
            await using var db = await _factory.CreateDbContextAsync();
            db.Database.SetCommandTimeout(120);

            // ── Étape 1 : récupérer les portfolios actifs avec données de base ──
            var query = db.Portfolios
                .AsNoTracking()
                .Include(p => p.Collaborator).ThenInclude(c => c.User)
                .Include(p => p.Collaborator).ThenInclude(c => c.CollaboratorSkills).ThenInclude(cs => cs.Skill)
                .Include(p => p.Collaborator).ThenInclude(c => c.Certifications)
                .Where(p => p.IsActive)
                .AsQueryable();

            // ── Filtres ──
            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var s = filter.Search.ToLower();
                query = query.Where(p =>
                    p.Title.ToLower().Contains(s) ||
                    (p.Description != null && p.Description.ToLower().Contains(s)) ||
                    p.Collaborator.JobTitle.ToLower().Contains(s) ||
                    p.Collaborator.User.FirstName.ToLower().Contains(s) ||
                    p.Collaborator.User.LastName.ToLower().Contains(s));
            }

            if (!string.IsNullOrWhiteSpace(filter.AvailabilityStatus))
                query = query.Where(p => p.Collaborator.AvailabilityStatus == filter.AvailabilityStatus);

            if (filter.MinYearsExperience.HasValue)
                query = query.Where(p => p.Collaborator.YearsExperience >= filter.MinYearsExperience.Value);

            if (filter.MaxYearsExperience.HasValue)
                query = query.Where(p => p.Collaborator.YearsExperience <= filter.MaxYearsExperience.Value);

            if (!string.IsNullOrWhiteSpace(filter.Theme))
                query = query.Where(p => p.Theme == filter.Theme);

            if (!string.IsNullOrWhiteSpace(filter.Language))
                query = query.Where(p => p.Language == filter.Language);

            if (filter.Skills != null && filter.Skills.Any())
            {
                var skillsLower = filter.Skills.Select(s => s.ToLower()).ToList();
                query = query.Where(p =>
                    p.Collaborator.CollaboratorSkills.Any(cs =>
                        skillsLower.Contains(cs.Skill.Name.ToLower())));
            }

            // ── Tri ──
            query = (filter.SortBy?.ToLower(), filter.SortDir?.ToLower()) switch
            {
                ("views", "asc") => query.OrderBy(p => p.ViewCount),
                ("views", _) => query.OrderByDescending(p => p.ViewCount),
                ("name", "desc") => query.OrderByDescending(p => p.Collaborator.User.LastName),
                ("name", _) => query.OrderBy(p => p.Collaborator.User.LastName),
                ("date", "asc") => query.OrderBy(p => p.CreatedAt),
                ("date", _) => query.OrderByDescending(p => p.CreatedAt),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var portfolios = await query.ToListAsync();

            if (!portfolios.Any()) return new List<ManagerDtos.PortfolioListItemDto>();

            // ── Étape 2 : charger les portfolios du collaborateur séparément ──
            var collabIds = portfolios.Select(p => p.CollaboratorId).Distinct().ToList();

            var allPortfoliosOfCollabs = await db.Portfolios
                .AsNoTracking()
                .Where(p => collabIds.Contains(p.CollaboratorId))
                .ToListAsync();

            // ── Attacher manuellement les portfolios au collaborateur ──
            foreach (var p in portfolios)
            {
                p.Collaborator.Portfolios = allPortfoliosOfCollabs
                    .Where(pp => pp.CollaboratorId == p.CollaboratorId)
                    .ToList();
            }

            return portfolios.Select(p => new ManagerDtos.PortfolioListItemDto(
                p.PortfolioId,
                p.Title,
                p.Description,
                p.PublicSlug,
                p.Theme,
                p.Language,
                p.IsActive,
                p.ViewCount,
                p.CreatedAt,
                MapToSummary(p.Collaborator)
            )).ToList();
        }
        // ── Besoins client (ClientNeeds) ─────────────────────────────────

        public async Task<ClientNeed> CreateClientNeedAsync(int managerId, ManagerDtos.CreateClientNeedDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();

            var need = new ClientNeed
            {
                ManagerId = managerId,
                ClientId = dto.ClientId,
                Title = dto.Title,
                Description = dto.Description,
                RequiredSkills = JsonSerializer.Serialize(dto.RequiredSkills),
                PreferredSkills = dto.PreferredSkills != null
                    ? JsonSerializer.Serialize(dto.PreferredSkills)
                    : null,
                MinExperienceYears = dto.MinYearsExperience,
                AvailabilityRequired = dto.AvailabilityRequired,
                RequiredCertificationsJson = dto.RequiredCertifications != null
                    ? JsonSerializer.Serialize(dto.RequiredCertifications)
                    : null,
                ContractType = dto.ContractType,
                Status = "active",
                CreatedAt = DateTime.UtcNow
            };

            db.ClientNeeds.Add(need);
            await db.SaveChangesAsync();
            return need;
        }

        public async Task<ClientNeed?> GetClientNeedAsync(int needId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.ClientNeeds.AsNoTracking()
                .FirstOrDefaultAsync(n => n.NeedId == needId);
        }

        public async Task<List<ClientNeed>> GetClientNeedsByManagerAsync(int managerId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.ClientNeeds.AsNoTracking()
                .Where(n => n.ManagerId == managerId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        // ── Collaborateurs ────────────────────────────────────────────────
        public async Task<Models.Collaborator?> GetCollaboratorFullAsync(int collaboratorId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            db.Database.SetCommandTimeout(60);

            var collab = await db.Collaborators
                .AsNoTracking()
                .Include(c => c.User)
                .Include(c => c.CollaboratorSkills)
                    .ThenInclude(cs => cs.Skill)
                .Include(c => c.Certifications)
                .Include(c => c.Experiences)
                .Include(c => c.Educations)
                .Include(c => c.Projects)
                .FirstOrDefaultAsync(c => c.CollaboratorId == collaboratorId);

            if (collab == null) return null;

            // Portfolios séparément
            collab.Portfolios = await db.Portfolios
                .AsNoTracking()
                .Where(p => p.CollaboratorId == collaboratorId)
                .ToListAsync();

            return collab;
        }
        public async Task<List<Models.Collaborator>> GetAllCollaboratorsFullAsync()
        {
            await using var db = await _factory.CreateDbContextAsync();
            db.Database.SetCommandTimeout(120);

            var collabs = await db.Collaborators
                .AsNoTracking()
                .AsSplitQuery() // ✅
                .Include(c => c.User)
                .Include(c => c.CollaboratorSkills)
                    .ThenInclude(cs => cs.Skill)
                .Include(c => c.Certifications)
                .ToListAsync();

            var collabIds = collabs.Select(c => c.CollaboratorId).ToList();

            var portfolios = await db.Portfolios
                .AsNoTracking()
                .Where(p => collabIds.Contains(p.CollaboratorId))
                .ToListAsync();

            var experiences = await db.Experiences
                .AsNoTracking()
                .Where(e => collabIds.Contains(e.CollaboratorId))
                .ToListAsync();

            foreach (var collab in collabs)
            {
                collab.Portfolios = portfolios
                    .Where(p => p.CollaboratorId == collab.CollaboratorId)
                    .ToList();
                collab.Experiences = experiences
                    .Where(e => e.CollaboratorId == collab.CollaboratorId)
                    .ToList();
            }

            return collabs;
        }
        public async Task<Manager?> GetManagerByUserIdAsync(Guid userId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.Managers.AsNoTracking()
                .FirstOrDefaultAsync(m => m.UserId == userId);
        }

        // ── Mapping + badges ──────────────────────────────────────────────

        private static ManagerDtos.CollaboratorSummaryDto MapToSummary(Models.Collaborator c)
        {
            var primarySkills = c.CollaboratorSkills
                .Where(cs => cs.IsPrimary)
                .Select(cs => cs.Skill?.Name ?? "")
                .Where(n => !string.IsNullOrEmpty(n))
                .ToList();

            return new ManagerDtos.CollaboratorSummaryDto(
                c.CollaboratorId,
                c.User?.FirstName ?? "",
                c.User?.LastName ?? "",
                c.User?.AvatarUrl,
                c.JobTitle ?? "",
                c.Bio ?? "",
                c.YearsExperience,
                c.AvailabilityStatus,
                c.AvailabilityDate,   
                c.IsPublic,
                ComputeBadges(c),
                primarySkills,
                c.Portfolios?.Count ?? 0,
                c.Portfolios?.Sum(p => p.ViewCount) ?? 0,
               c.Portfolios?.FirstOrDefault(p => p.IsActive && p.PublicSlug != null)?.PublicSlug
    );
        }

        // ── 5.6 Badges ───────────────────────────────────────────────────
        public static List<string> ComputeBadges(Models.Collaborator c)
        {
            var badges = new List<string>();

            if (c.YearsExperience >= 7 || c.CollaboratorSkills.Count(cs => cs.IsPrimary) >= 3)
                badges.Add("expert");

            if (c.AvailabilityStatus == "available")
                badges.Add("disponible");

            if (c.AvailabilityStatus == "soon")
                badges.Add("bientot_disponible");

            if (c.YearsExperience >= 10)
                badges.Add("senior");

            if (c.Certifications != null && c.Certifications.Any())
                badges.Add("certifie");

            if (c.Portfolios != null && c.Portfolios.Any(p => p.ViewCount >= 100))
                badges.Add("top_profil");

            return badges;
        }
    }
}