using BackendPortfolio.DTO;
using BackendPortfolio.Models;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace BackendPortfolio.Repositories.Realisations
{
    public class RealisationRepository : IRealisationRepository
    {
        private readonly IDbContextFactory<VitrineDbContext> _factory;

        public RealisationRepository(IDbContextFactory<VitrineDbContext> factory)
            => _factory = factory;

        // ── Lecture : toutes les réalisations d'un manager ────────────────
        public async Task<List<Realisation>> GetByManagerAsync(int managerId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.Realisations
                .AsNoTracking()
                .Include(r => r.Collaborator).ThenInclude(c => c!.User)
                .Where(r => r.ManagerId == managerId)
                .OrderByDescending(r => r.DeliveredAt)
                .ToListAsync();
        }

        // ── Lecture : réalisations publiques (vue client) ─────────────────
        public async Task<List<Realisation>> GetPublicAsync()
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.Realisations
                .AsNoTracking()
                .Include(r => r.Collaborator).ThenInclude(c => c!.User)
                .Where(r => r.IsPublic)
                .OrderByDescending(r => r.DeliveredAt)
                .ToListAsync();
        }

        // ── Lecture : une réalisation par ID ─────────────────────────────
        public async Task<Realisation?> GetByIdAsync(int id)
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.Realisations
                .AsNoTracking()
                .Include(r => r.Collaborator).ThenInclude(c => c!.User)
                .FirstOrDefaultAsync(r => r.RealisationId == id);
        }

        // ── Création ──────────────────────────────────────────────────────
        public async Task<Realisation> CreateAsync(int managerId, RealisationDtos.UpsertRealisationDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();

            var realisation = new Realisation
            {
                ManagerId = managerId,
                CollaboratorId = dto.CollaboratorId,
                Title = dto.Title,
                Description = dto.Description,
                ClientName = dto.ClientName,
                SiteUrl = dto.SiteUrl,
                ScreenshotUrl = dto.ScreenshotUrl,
                TechnologiesJson = dto.Technologies != null
                    ? JsonSerializer.Serialize(dto.Technologies)
                    : null,
                Category = dto.Category,
                DeliveredAt = dto.DeliveredAt,
                IsPublic = dto.IsPublic,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            db.Realisations.Add(realisation);
            await db.SaveChangesAsync();
            return realisation;
        }

        // ── Mise à jour ───────────────────────────────────────────────────
        public async Task<Realisation?> UpdateAsync(
            int id, int managerId, RealisationDtos.UpsertRealisationDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();

            var realisation = await db.Realisations
                .FirstOrDefaultAsync(r => r.RealisationId == id && r.ManagerId == managerId);

            if (realisation == null) return null;

            realisation.CollaboratorId = dto.CollaboratorId;
            realisation.Title = dto.Title;
            realisation.Description = dto.Description;
            realisation.ClientName = dto.ClientName;
            realisation.SiteUrl = dto.SiteUrl;
            realisation.ScreenshotUrl = dto.ScreenshotUrl;
            realisation.TechnologiesJson = dto.Technologies != null
                ? JsonSerializer.Serialize(dto.Technologies)
                : null;
            realisation.Category = dto.Category;
            realisation.DeliveredAt = dto.DeliveredAt;
            realisation.IsPublic = dto.IsPublic;
            realisation.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return realisation;
        }

        // ── Suppression ───────────────────────────────────────────────────
        public async Task<bool> DeleteAsync(int id, int managerId)
        {
            await using var db = await _factory.CreateDbContextAsync();

            var realisation = await db.Realisations
                .FirstOrDefaultAsync(r => r.RealisationId == id && r.ManagerId == managerId);

            if (realisation == null) return false;

            db.Realisations.Remove(realisation);
            await db.SaveChangesAsync();
            return true;
        }
    }
}
