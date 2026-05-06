using BackendPortfolio.DTO;
using BackendPortfolio.Models;

namespace BackendPortfolio.Repositories.ShortList
{
    public class ShortlistRepository : IShortlistRepository
    {
        private readonly IDbContextFactory<VitrineDbContext> _factory;

        public ShortlistRepository(IDbContextFactory<VitrineDbContext> factory)
            => _factory = factory;

        public async Task<Shortlist> CreateAsync(int managerId, ShortlistDtos.CreateShortlistDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();

            var token = GenerateToken();
            var shortlist = new Shortlist
            {
                ManagerId = managerId,
                ClientId = dto.ClientId,
                Title = dto.Title,
                Description = dto.Description,
                Status = "draft",
                ShareToken = token,
                ExpiresAt = dto.ExpiresAt,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            db.Shortlists.Add(shortlist);
            await db.SaveChangesAsync();

            // Ajouter les items
            if (dto.Items.Any())
            {
                var uniqueItems = dto.Items
                    .GroupBy(i => i.PortfolioId)
                    .Select((g, idx) =>
                    {
                        var first = g.First();
                        return new ShortlistItem
                        {
                            ShortlistId = shortlist.ShortlistId,
                            PortfolioId = g.Key,
                            SwitchedViewId = first.SwitchedViewId,
                            DisplayOrder = first.DisplayOrder > 0 ? first.DisplayOrder : idx + 1,
                            ManagerNote = first.ManagerNote,
                            AddedAt = DateTime.UtcNow
                        };
                    })
                    .ToList();
                db.ShortlistItems.AddRange(dto.Items.Select(i => new ShortlistItem
                {
                    ShortlistId = shortlist.ShortlistId,
                    PortfolioId = i.PortfolioId,
                    SwitchedViewId = i.SwitchedViewId,
                    DisplayOrder = i.DisplayOrder,
                    ManagerNote = i.ManagerNote,
                    AddedAt = DateTime.UtcNow
                }));
                await db.SaveChangesAsync();
            }

            return shortlist;
        }

        public async Task<Shortlist?> GetByIdAsync(int shortlistId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.Shortlists
                .AsNoTracking()
                .AsSplitQuery()
                .Include(s => s.Manager).ThenInclude(m => m.User)
                .Include(s => s.Client)
                .Include(s => s.ShortlistItems)
                    .ThenInclude(i => i.Portfolio)
                        .ThenInclude(p => p.Collaborator)
                            .ThenInclude(c => c.User)
                .Include(s => s.ShortlistItems)
                    .ThenInclude(i => i.Portfolio)
                        .ThenInclude(p => p.Collaborator)
                            .ThenInclude(c => c.CollaboratorSkills)
                                .ThenInclude(cs => cs.Skill)
                .Include(s => s.ShortlistItems)
                    .ThenInclude(i => i.Portfolio)
                        .ThenInclude(p => p.Collaborator)
                            .ThenInclude(c => c.Certifications)
                .Include(s => s.ShortlistItems)
                    .ThenInclude(i => i.SwitchedView)
                .FirstOrDefaultAsync(s => s.ShortlistId == shortlistId);
        }

        public async Task<Shortlist?> GetByTokenAsync(string token)
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.Shortlists
                .AsNoTracking()
                .AsSplitQuery()
                .Include(s => s.Manager).ThenInclude(m => m.User)
                .Include(s => s.Client)
                .Include(s => s.ShortlistItems.OrderBy(i => i.DisplayOrder))
                    .ThenInclude(i => i.Portfolio)
                        .ThenInclude(p => p.Collaborator)
                            .ThenInclude(c => c.User)
                .Include(s => s.ShortlistItems)
                    .ThenInclude(i => i.Portfolio)
                        .ThenInclude(p => p.Collaborator)
                            .ThenInclude(c => c.CollaboratorSkills)
                                .ThenInclude(cs => cs.Skill)
                .Include(s => s.ShortlistItems)
                    .ThenInclude(i => i.Portfolio)
                        .ThenInclude(p => p.Collaborator)
                            .ThenInclude(c => c.Certifications)
                .Include(s => s.ShortlistItems)
                    .ThenInclude(i => i.SwitchedView)
                .FirstOrDefaultAsync(s => s.ShareToken == token
                    && (s.ExpiresAt == null || s.ExpiresAt > DateTime.UtcNow)
                    && s.Status != "archived");
        }

        public async Task<List<Shortlist>> GetByManagerAsync(int managerId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            return await db.Shortlists
                .AsNoTracking()
                .Include(s => s.Client)
                .Include(s => s.ShortlistItems)
                .Where(s => s.ManagerId == managerId)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<Shortlist?> UpdateAsync(int shortlistId, ShortlistDtos.UpdateShortlistDto dto)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var shortlist = await db.Shortlists.FindAsync(shortlistId);
            if (shortlist == null) return null;

            if (dto.Title != null) shortlist.Title = dto.Title;
            if (dto.Description != null) shortlist.Description = dto.Description;
            if (dto.Status != null) shortlist.Status = dto.Status;
            if (dto.ExpiresAt.HasValue) shortlist.ExpiresAt = dto.ExpiresAt;
            shortlist.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return shortlist;
        }

        public async Task<bool> DeleteAsync(int shortlistId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var s = await db.Shortlists.FindAsync(shortlistId);
            if (s == null) return false;
            db.Shortlists.Remove(s);
            await db.SaveChangesAsync();
            return true;
        }

        public async Task AddItemAsync(int shortlistId, ShortlistDtos.ShortlistItemInputDto item)
        {
            await using var db = await _factory.CreateDbContextAsync();
            db.ShortlistItems.Add(new ShortlistItem
            {
                ShortlistId = shortlistId,
                PortfolioId = item.PortfolioId,
                SwitchedViewId = item.SwitchedViewId,
                DisplayOrder = item.DisplayOrder,
                ManagerNote = item.ManagerNote,
               
                AddedAt = DateTime.UtcNow
            });
            await db.SaveChangesAsync();
        }

        public async Task RemoveItemAsync(int shortlistId, int portfolioId)
        {
            await using var db = await _factory.CreateDbContextAsync();
            var item = await db.ShortlistItems
                .FirstOrDefaultAsync(i => i.ShortlistId == shortlistId && i.PortfolioId == portfolioId);
            if (item != null)
            {
                db.ShortlistItems.Remove(item);
                await db.SaveChangesAsync();
            }
        }

        public async Task LogAccessAsync(int shortlistId, Guid? clientUserId, string? ip)
        {
            await using var db = await _factory.CreateDbContextAsync();

            // Met à jour le statut en "viewed" si c'était "sent"
            var shortlist = await db.Shortlists.FindAsync(shortlistId);
            if (shortlist != null && shortlist.Status == "sent")
            {
                shortlist.Status = "viewed";
                shortlist.UpdatedAt = DateTime.UtcNow;
            }

            db.ShortlistAccesses.Add(new ShortlistAccess
            {
                ShortlistId = shortlistId,
                ClientUserId = clientUserId,
                ViewedAt = DateTime.UtcNow,
                IpAddress = ip
            });

            await db.SaveChangesAsync();
        }

        // ── Token sécurisé 32 chars URL-safe ─────────────────────────────
        private static string GenerateToken()
            => Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(24))
                .Replace("+", "-").Replace("/", "_").Replace("=", "");
    }
}
