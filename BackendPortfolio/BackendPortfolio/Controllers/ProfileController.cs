using Microsoft.AspNetCore.Mvc;
using BackendPortfolio.Repositories;
using BackendPortfolio.DTO.Profile;
using System.Security.Claims;

namespace BackendPortfolio.Controllers
{
    [Route("api/profile")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IUsersRepository _usersRepo;
        private readonly IKeycloakAdminService _keycloak;

        public ProfileController(IUsersRepository usersRepo, IKeycloakAdminService keycloak)
        {
            _usersRepo = usersRepo;
            _keycloak = keycloak;
        }

        private Guid? GetCurrentUserId()
        {
            var claim = User.FindFirst("local_user_id")?.Value
                     ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(claim, out var id) ? id : null;
        }

        // GET /api/profile
        [HttpGet]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "Token invalide" });

                var profile = await _usersRepo.GetFullProfileAsync(userId.Value);
                if (profile == null)
                    return NotFound(new { message = "Profil non trouvé" });

                return Ok(profile);
            }
            catch (Exception ex)
            {
                _ = ex; // supprime CS0168 — log ici si tu as un logger
                return StatusCode(500, new { message = "Erreur interne lors de la récupération du profil" });
            }
        }
       
        // PUT /api/profile
        [HttpPut]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "Token invalide" });

                var updated = await _usersRepo.UpdateFullProfileAsync(userId.Value, dto);
                if (updated == null)
                    return NotFound(new { message = "Utilisateur non trouvé" });

                // Changement de mot de passe dans Keycloak
                if (!string.IsNullOrWhiteSpace(dto.NewPassword))
                {
                    bool passwordChanged = await _keycloak.ChangePasswordAsync(
                        userId.Value.ToString(), dto.NewPassword);

                    if (!passwordChanged)
                    {
                        return BadRequest(new { message = "Échec du changement de mot de passe dans Keycloak" });
                    }
                }

                // Mise à jour des autres infos dans Keycloak (prénom, nom, email)
                bool hasIdentityChange = !string.IsNullOrWhiteSpace(dto.FirstName) ||
                                         !string.IsNullOrWhiteSpace(dto.LastName) ||
                                         !string.IsNullOrWhiteSpace(dto.Email);

                if (hasIdentityChange)
                {
                    await _keycloak.UpdateUserAsync(
                        userId.Value.ToString(),
                        dto.FirstName,
                        dto.LastName,
                        dto.Email);
                }

                return Ok(new { message = "Profil mis à jour avec succès" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la mise à jour du profil" });
            }
        }
        // POST /api/profile/avatar
        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile avatar)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "Token invalide" });

                if (avatar == null || avatar.Length == 0)
                    return BadRequest(new { message = "Fichier requis" });

                var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
                if (!allowedTypes.Contains(avatar.ContentType.ToLower()))
                    return BadRequest(new { message = "Format invalide. Acceptés : jpg, png, webp" });

                if (avatar.Length > 5 * 1024 * 1024)
                    return BadRequest(new { message = "Fichier trop lourd. Maximum 5MB" });

                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Resources", "avatars");
                Directory.CreateDirectory(uploadsPath);

                var extension = Path.GetExtension(avatar.FileName).ToLower();
                var fileName = $"{userId}{extension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                await using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await avatar.CopyToAsync(stream);
                }

                var baseUrl = $"{Request.Scheme}://{Request.Host}";
                var avatarUrl = $"{baseUrl}/Resources/avatars/{fileName}";

                var user = await _usersRepo.UpdateAvatarAsync(userId.Value, avatarUrl);
                if (user == null)
                    return NotFound(new { message = "Utilisateur non trouvé" });

                return Ok(new
                {
                    avatarUrl,
                    message = "Photo de profil mise à jour avec succès"
                });
            }
            catch (Exception ex)
            {
                _ = ex;
                return StatusCode(500, new { message = "Erreur lors de l'upload de l'avatar" });
            }
        }

        // DELETE /api/profile/avatar
        [HttpDelete("avatar")]
        public async Task<IActionResult> DeleteAvatar()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "Token invalide" });

                var user = await _usersRepo.GetByIdAsync(userId.Value);
                if (user == null)
                    return NotFound(new { message = "Utilisateur non trouvé" });

                if (!string.IsNullOrWhiteSpace(user.AvatarUrl))
                {
                    // Extraire le chemin relatif depuis l'URL absolue
                    var uri = new Uri(user.AvatarUrl);
                    var relativePath = uri.AbsolutePath.TrimStart('/');
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);

                    if (System.IO.File.Exists(filePath))
                        System.IO.File.Delete(filePath);
                }

                await _usersRepo.UpdateAvatarAsync(userId.Value, null);

                return Ok(new { message = "Photo de profil supprimée avec succès" });
            }
            catch (Exception ex)
            {
                _ = ex;
                return StatusCode(500, new { message = "Erreur lors de la suppression de l'avatar" });
            }
        }
    }
}