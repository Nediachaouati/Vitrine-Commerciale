using Microsoft.AspNetCore.Mvc;
using BackendPortfolio.DTO.kc;
using BackendPortfolio.Repositories;

namespace BackendPortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IKeycloakAdminService _keycloak;

        public UsersController(IUsersRepository usersRepository, IKeycloakAdminService keycloak)
        {
            _usersRepository = usersRepository;
            _keycloak = keycloak;
        }

        // GET /api/users/by-roles?roles=vitrine-collaborator,vitrine-manager
        [HttpGet("by-roles")]
        public async Task<IActionResult> GetByRoles(
            [FromQuery] string roles,
            [FromQuery] int first = 0,
            [FromQuery] int max = 200)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(roles))
                    return BadRequest(new { message = "roles is required" });

                var roleNames = roles.Split(
                    ',',
                    StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries
                );

                var users = await _keycloak.GetUsersByClientRolesAsync(roleNames, first, max);

                return Ok(users.Select(u => new
                {
                    value = u.Id,
                    label = $"{u.LastName} {u.FirstName}".Trim(),
                    email = u.Email,
                    username = u.Username
                }));
            }
            catch (Exception ex)
            {
                _ = ex;
                return StatusCode(500, new { message = "Erreur lors de la récupération des utilisateurs par rôle" });
            }
        }

        // POST /api/users/sync
        public sealed class SyncUsersResult
        {
            public int TotalFromKeycloak { get; set; }
            public int Created { get; set; }
            public int Updated { get; set; }
            public int Failed { get; set; }
            public List<string> Errors { get; set; } = new();
        }

        [HttpPost("sync")]
        [AllowAnonymous]
        public async Task<IActionResult> SyncAllUsers(
            [FromQuery] int batchSize = 200,
            [FromQuery] int maxTotal = 20000)
        {
            try
            {
                if (batchSize <= 0 || batchSize > 1000) batchSize = 200;
                if (maxTotal <= 0) maxTotal = 20000;

                var result = new SyncUsersResult();
                int first = 0;

                while (first < maxTotal)
                {
                    List<KcUser> kcUsers;

                    try
                    {
                        kcUsers = await _keycloak.GetUsersAsync(first, batchSize);
                    }
                    catch (Exception ex)
                    {
                        result.Failed++;
                        result.Errors.Add($"Keycloak fetch failed at first={first}: {ex.Message}");
                        break;
                    }

                    if (kcUsers.Count == 0) break;

                    result.TotalFromKeycloak += kcUsers.Count;

                    try
                    {
                        var (created, updated) = await _usersRepository.UpsertFromKeycloakAsync(kcUsers);
                        result.Created += created;
                        result.Updated += updated;
                    }
                    catch (Exception ex)
                    {
                        result.Failed += kcUsers.Count;
                        result.Errors.Add($"DB upsert failed at first={first}: {ex.Message}");
                    }

                    first += batchSize;

                    if (kcUsers.Count < batchSize) break;
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _ = ex;
                return StatusCode(500, new { message = "Erreur lors de la synchronisation des utilisateurs" });
            }
        }
    }
}