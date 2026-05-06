using Microsoft.AspNetCore.Mvc;
using BackendPortfolio.Repositories;
using BackendPortfolio.DTO.kc;
using BackendPortfolio.Repositories.Email;

namespace BackendPortfolio.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IKeycloakAdminService _keycloak;
        private readonly IUsersRepository _usersRepo;
        private readonly IEmailRepositorycs _emailRepo;


        public AdminController(IKeycloakAdminService keycloak, IUsersRepository usersRepo, IEmailRepositorycs emailRepo)
        {
            _keycloak = keycloak;
            _usersRepo = usersRepo;
            _emailRepo = emailRepo;
        }

        // GET /api/admin/users
        [HttpGet("users")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetAllUsers(
            [FromQuery] int first = 0,
            [FromQuery] int max = 200)
        {
            try
            {
                var users = await _keycloak.GetUsersAsync(first, max);
                return Ok(users);
            }
            catch (Exception ex)
            {
                _ = ex;
                return StatusCode(500, new { message = "Erreur lors de la récupération des utilisateurs" });
            }
        }

        // POST /api/admin/users
        [HttpPost("users")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            try
            {
                var emailExists = await _usersRepo.EmailExistsAsync(dto.Email);
                if (emailExists)
                    return Conflict(new { message = $"Un user avec l'email {dto.Email} existe déjà" });

                if (dto.KcRole != "vitrine-collaborator" && dto.KcRole != "vitrine-manager" && dto.KcRole != "vitrine-client")
                    
                    return BadRequest(new
                    {
                        message = "KcRole invalide. Valeurs acceptées : vitrine-collaborator, vitrine-manager, vitrine-client"
                    });

                // 1) Créer dans Keycloak
                string? kcId;
                try
                {
                    kcId = await _keycloak.CreateUserAsync(dto);
                }
                catch (HttpRequestException ex)
                {
                    return BadRequest(new { message = ex.Message });
                }

                if (string.IsNullOrWhiteSpace(kcId))
                    return BadRequest(new { message = "Échec récupération ID Keycloak" });

                // 2) Créer en BD
                var user = await _usersRepo.CreateWithRoleAsync(dto, Guid.Parse(kcId));
                if (user == null)
                    return StatusCode(500, new
                    {
                        message = "User créé dans Keycloak mais échec en BD",
                        keycloakId = kcId
                    });
                // 3) ✅ Envoyer l'email (fire-and-forget pour ne pas bloquer la réponse)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _emailRepo.SendWelcomeEmailAsync(
                            dto.Email, dto.FirstName, dto.LastName,
                            dto.Username, dto.Password, dto.KcRole
                        );
                    }
                    catch (Exception ex)
                    {
                        // Logger l'erreur sans faire échouer la création
                        Console.Error.WriteLine($"Email send failed: {ex.Message}");
                    }
                });
                return Ok(new
                {
                    id = kcId,
                    email = dto.Email,
                    role = dto.KcRole,
                    message = "User créé avec succès"
                });
            }
            catch (Exception ex)
            {
                _ = ex;
                return StatusCode(500, new { message = "Erreur lors de la création de l'utilisateur" });
            }
        }

        // DELETE /api/admin/users/{id}
        [HttpDelete("users/{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                // 1) Supprimer dans Keycloak
                try
                {
                    await _keycloak.DeleteUserAsync(id.ToString());
                }
                catch (HttpRequestException ex)
                {
                    return BadRequest(new { message = ex.Message });
                }

                // 2) Soft delete en BD
                var deleted = await _usersRepo.DeleteAsync(id);
                if (!deleted)
                    return NotFound(new { message = "User non trouvé en BD" });

                return Ok(new { message = "User supprimé avec succès" });
            }
            catch (Exception ex)
            {
                _ = ex;
                return StatusCode(500, new { message = "Erreur lors de la suppression de l'utilisateur" });
            }
        }
    }
}