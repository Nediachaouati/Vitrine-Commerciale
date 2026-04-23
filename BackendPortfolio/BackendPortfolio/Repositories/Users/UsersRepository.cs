using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using BackendPortfolio.DTO.kc;
using BackendPortfolio.Models;
using backendPortfolio.Repositories;
using BackendPortfolio.DTO.Profile;

namespace BackendPortfolio.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly IDbContextFactory<VitrineDbContext> _factory;
        private readonly IDbExceptionLogger _logger;

        public UsersRepository(IDbContextFactory<VitrineDbContext> factory, IDbExceptionLogger logger)
        {
            _factory = factory;
            _logger = logger;
        }

        // ─── GET OR CREATE ───────────────────────────────────

        public async Task<User?> GetOrCreateAsync(ClaimsPrincipal principal)
        {
            await using var _db = await _factory.CreateDbContextAsync();
            try
            {
                var subStr =
                    principal.FindFirst("sub")?.Value
                    ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrWhiteSpace(subStr)) return null;
                if (!Guid.TryParse(subStr, out var subGuid)) return null;

                var existing = await _db.Users
                    .FirstOrDefaultAsync(u => u.UserId == subGuid);

                if (existing != null)
                {
                    
                    return existing;
                }

                var user = new User
                {
                    UserId = subGuid,
                    Email = principal.FindFirst("email")?.Value ?? string.Empty,
                    FirstName = principal.FindFirst("given_name")?.Value ?? string.Empty,
                    LastName = principal.FindFirst("family_name")?.Value ?? string.Empty,
                    CreatedAt = DateTime.UtcNow
                };

                await _db.Users.AddAsync(user);
                await _db.SaveChangesAsync();
                return user;
            }
            catch (DbUpdateException ex)
            {
                await _logger.LogAsync(ex, nameof(UsersRepository), nameof(GetOrCreateAsync));
                return null;
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(ex, nameof(UsersRepository), nameof(GetOrCreateAsync));
                return null;
            }
        }

        // ─── GET LOCAL USER ID ───────────────────────────────

        public async Task<Guid?> GetLocalUserIdAsync(ClaimsPrincipal principal)
        {
            await using var _db = await _factory.CreateDbContextAsync();
            try
            {
                var subStr =
                    principal.FindFirst("sub")?.Value
                    ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrWhiteSpace(subStr)) return null;
                if (!Guid.TryParse(subStr, out var subGuid)) return null;

                return await _db.Users
                    .Where(u => u.UserId == subGuid)
                    .Select(u => (Guid?)u.UserId)
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(ex, nameof(UsersRepository), nameof(GetLocalUserIdAsync));
                return null;
            }
        }

        // ─── UPSERT FROM KEYCLOAK (SYNC) ─────────────────────

        public async Task<(int created, int updated)> UpsertFromKeycloakAsync(IEnumerable<KcUser> kcUsers)
        {
            await using var _db = await _factory.CreateDbContextAsync();
            int created = 0, updated = 0;

            try
            {
                var list = kcUsers
                    .Where(u => !string.IsNullOrWhiteSpace(u.Id))
                    .Select(u =>
                    {
                        var ok = Guid.TryParse(u.Id, out var gid);
                        return new { ok, gid, u };
                    })
                    .Where(x => x.ok)
                    .ToList();

                if (list.Count == 0) return (0, 0);

                var ids = list.Select(x => x.gid).ToList();

                var existing = await _db.Users
                    .Where(u => ids.Contains(u.UserId))
                    .ToDictionaryAsync(u => u.UserId);

                foreach (var item in list)
                {
                    var subGuid = item.gid;
                    var kc = item.u;

                    if (existing.TryGetValue(subGuid, out var local))
                    {
                        bool changed = false;

                        if (!string.IsNullOrWhiteSpace(kc.Email) && local.Email != kc.Email)
                        { local.Email = kc.Email; changed = true; }

                        if (!string.IsNullOrWhiteSpace(kc.FirstName) && local.FirstName != kc.FirstName)
                        { local.FirstName = kc.FirstName; changed = true; }

                        if (!string.IsNullOrWhiteSpace(kc.LastName) && local.LastName != kc.LastName)
                        { local.LastName = kc.LastName; changed = true; }

                        var newRole = MapKeycloakRoleToLocal(kc.Roles); // List<string>
                        if (local.Role != newRole)
                        { local.Role = newRole; changed = true; }

                        if (changed) updated++;
                    }
                    else
                    {
                        var user = new User
                        {
                            UserId = subGuid,
                            Email = kc.Email ?? string.Empty,
                            FirstName = kc.FirstName ?? string.Empty,
                            LastName = kc.LastName ?? string.Empty,
                            Role = MapKeycloakRoleToLocal(kc.Roles), // List<string>
                            CreatedAt = DateTime.UtcNow
                        };

                        await _db.Users.AddAsync(user);
                        created++;
                    }
                }

                await _db.SaveChangesAsync();
                return (created, updated);
            }
            catch (DbUpdateException ex)
            {
                await _logger.LogAsync(ex, nameof(UsersRepository), nameof(UpsertFromKeycloakAsync));
                return (0, 0);
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(ex, nameof(UsersRepository), nameof(UpsertFromKeycloakAsync));
                return (0, 0);
            }
        }

        // ─── CREATE WITH ROLE ────────────────────────────────
        public async Task<bool> EmailExistsAsync(string email)
        {
            await using var _db = await _factory.CreateDbContextAsync();
            return await _db.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<User?> CreateWithRoleAsync(CreateUserDto dto, Guid keycloakId)
        {
            await using var _db = await _factory.CreateDbContextAsync();
            try
            {
                // 1) Créer User
                var user = new User
                {
                    UserId = keycloakId,
                    Email = dto.Email,
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Role = MapKeycloakRoleToLocal(dto.KcRole), // string
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                await _db.Users.AddAsync(user);
                await _db.SaveChangesAsync();

                // 2) Créer Collaborator ou Manager vide
                if (dto.KcRole == "vitrine-collaborator")
                {
                    var collab = new Models.Collaborator
                    {
                        UserId = keycloakId,
                        JobTitle = string.Empty,
                        Bio = string.Empty,
                        YearsExperience = 0,
                        LinkedinUrl = null,       // ✅ nullable
                        GithubUrl = null,       // ✅ nullable
                        AvailabilityStatus = "available",
                        AvailabilityDate = null,       // ✅ nullable
                      
                        IsPublic = false
                    };
                    await _db.Collaborators.AddAsync(collab);
                }
                else if (dto.KcRole == "vitrine-manager")
                {
                    var manager = new Manager
                    {
                        UserId = keycloakId,
                        Department = null,
                        ManagedProfilesCount = 0,
                        CreatedAt = DateTime.UtcNow
                    };
                    await _db.Managers.AddAsync(manager);
                }

                await _db.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(ex, nameof(UsersRepository), nameof(CreateWithRoleAsync));
                return null;
            }
        }

        // ─── DELETE (SOFT) ───────────────────────────────────

        public async Task<bool> DeleteAsync(Guid userId)
        {
            await using var _db = await _factory.CreateDbContextAsync();
            try
            {
                var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                if (user == null) return false;

                user.DeletedAt = DateTime.UtcNow;
                user.IsActive = false;
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(ex, nameof(UsersRepository), nameof(DeleteAsync));
                return false;
            }
        }

        // ─── MAPPING ─────────────────────────────────────────

        // Pour UpsertFromKeycloakAsync — reçoit List<string>
        private static string MapKeycloakRoleToLocal(List<string> kcRoles)
        {
            if (kcRoles.Contains("vitrine-admin")) return "ADMIN";
            if (kcRoles.Contains("vitrine-collaborator")) return "COLLABORATEUR";
            if (kcRoles.Contains("vitrine-manager")) return "MANAGER";
            if (kcRoles.Contains("vitrine-client")) return "CLIENT";
            return "COLLABORATEUR";
        }

        // Pour CreateWithRoleAsync — reçoit string simple
        private static string MapKeycloakRoleToLocal(string kcRole) => kcRole switch
        {
            "vitrine-admin" => "ADMIN",
            "vitrine-collaborator" => "COLLABORATEUR",
            "vitrine-manager" => "MANAGER",
            "vitrine-client" => "CLIENT",
            _ => "COLLABORATEUR"
        };


        //profile

        public async Task<User?> GetByIdAsync(Guid userId)
        {
            await using var _db = await _factory.CreateDbContextAsync();
            try
            {
                return await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(ex, nameof(UsersRepository), nameof(GetByIdAsync));
                return null;
            }
        }
        public async Task<object?> GetFullProfileAsync(Guid userId)
        {
            await using var _db = await _factory.CreateDbContextAsync();
            try
            {
                var user = await _db.Users
                    .Include(u => u.Collaborators)
                    .Include(u => u.Managers)
                    .FirstOrDefaultAsync(u => u.UserId == userId);

                if (user == null) return null;
                
                if (user.Role == "COLLABORATEUR" && user.Collaborators.Any())
                {
                    var collab = user.Collaborators.First();
                    return new
                    {
                        user.UserId,
                        user.Email,
                        user.FirstName,
                        user.LastName,
                        user.AvatarUrl,
                        user.Role,
                        user.IsActive,

                        jobTitle = collab.JobTitle,
                        bio = collab.Bio,
                        yearsExperience = collab.YearsExperience,
                        availabilityStatus = collab.AvailabilityStatus,
                        availabilityDate = collab.AvailabilityDate,
                        linkedinUrl = collab.LinkedinUrl,
                        githubUrl = collab.GithubUrl,
                        isPublic = collab.IsPublic,
                        //globalScore = collab.GlobalScore
                    };
                }
                else if (user.Role == "MANAGER" && user.Managers.Any())
                {
                    var manager = user.Managers.First();
                    return new
                    {
                        user.UserId,
                        user.Email,
                        user.FirstName,
                        user.LastName,
                        user.AvatarUrl,
                        user.Role,
                        user.IsActive,

                        department = manager.Department,
                        managedProfilesCount = manager.ManagedProfilesCount
                    };
                }

                // Par défaut (ADMIN, CLIENT...)
                return new
                {
                    user.UserId,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.AvatarUrl,
                    user.Role,
                    user.IsActive
                };
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(ex, nameof(UsersRepository), nameof(GetFullProfileAsync));
                return null;
            }
        }

        // Mise à jour complète du profil
        public async Task<User?> UpdateFullProfileAsync(Guid userId, UpdateProfileDto dto)
        {
            await using var _db = await _factory.CreateDbContextAsync();
            try
            {
                var user = await _db.Users
                    .Include(u => u.Collaborators)
                    .Include(u => u.Managers)
                    .FirstOrDefaultAsync(u => u.UserId == userId);

                if (user == null) return null;

                bool changed = false;

                // ── Champs communs ──
                if (!string.IsNullOrWhiteSpace(dto.FirstName) && user.FirstName != dto.FirstName)
                { user.FirstName = dto.FirstName; changed = true; }

                if (!string.IsNullOrWhiteSpace(dto.LastName) && user.LastName != dto.LastName)
                { user.LastName = dto.LastName; changed = true; }

                if (!string.IsNullOrWhiteSpace(dto.Email) && user.Email != dto.Email)
                { user.Email = dto.Email; changed = true; }

                // ── Collaborateur ──
                if (user.Role == "COLLABORATEUR")
                {
                    // Charger directement depuis le contexte pour garantir le tracking
                    var collab = await _db.Collaborators
                        .FirstOrDefaultAsync(c => c.UserId == userId);

                    if (collab != null)
                    {
                        if (!string.IsNullOrWhiteSpace(dto.JobTitle) && collab.JobTitle != dto.JobTitle)
                        { collab.JobTitle = dto.JobTitle; changed = true; }

                        if (!string.IsNullOrWhiteSpace(dto.Bio) && collab.Bio != dto.Bio)
                        { collab.Bio = dto.Bio; changed = true; }

                        if (dto.YearsExperience.HasValue && collab.YearsExperience != dto.YearsExperience.Value)
                        { collab.YearsExperience = dto.YearsExperience.Value; changed = true; }

                        if (!string.IsNullOrWhiteSpace(dto.LinkedinUrl) && collab.LinkedinUrl != dto.LinkedinUrl)
                        { collab.LinkedinUrl = dto.LinkedinUrl; changed = true; }

                        if (!string.IsNullOrWhiteSpace(dto.GithubUrl) && collab.GithubUrl != dto.GithubUrl)
                        { collab.GithubUrl = dto.GithubUrl; changed = true; }

                        if (!string.IsNullOrWhiteSpace(dto.AvailabilityStatus) && collab.AvailabilityStatus != dto.AvailabilityStatus)
                        { collab.AvailabilityStatus = dto.AvailabilityStatus; changed = true; }

                        if (dto.AvailabilityDate.HasValue && collab.AvailabilityDate != dto.AvailabilityDate.Value)
                        { collab.AvailabilityDate = dto.AvailabilityDate.Value; changed = true; }

                        if (dto.IsPublic.HasValue && collab.IsPublic != dto.IsPublic.Value)
                        { collab.IsPublic = dto.IsPublic.Value; changed = true; }
                    }
                }

                // ── Manager ──
                else if (user.Role == "MANAGER")
                {
                    // Charger directement depuis le contexte pour garantir le tracking
                    var manager = await _db.Managers
                        .FirstOrDefaultAsync(m => m.UserId == userId);

                    if (manager != null)
                    {
                        if (!string.IsNullOrWhiteSpace(dto.Department) && manager.Department != dto.Department)
                        {
                            manager.Department = dto.Department;
                            changed = true;
                        }
                    }
                }

                if (changed)
                {
                    user.UpdatedAt = DateTime.UtcNow;
                    await _db.SaveChangesAsync();
                }

                return user;
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(ex, nameof(UsersRepository), nameof(UpdateFullProfileAsync));
                return null;
            }
        }
        public async Task<User?> UpdateAvatarAsync(Guid userId, string? avatarUrl)
        {
            await using var _db = await _factory.CreateDbContextAsync();
            try
            {
                var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                if (user == null) return null;

                // ✅ Plus de manipulation — on sauvegarde directement l'URL reçue
                user.AvatarUrl = string.IsNullOrWhiteSpace(avatarUrl) ? null : avatarUrl.Trim();
                user.UpdatedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();

                return user;
            }
            catch (Exception ex)
            {
                await _logger.LogAsync(ex, nameof(UsersRepository), nameof(UpdateAvatarAsync));
                return null;
            }
        }


    }
}