using System.Text.Json;
using BackendPortfolio.DTO;
using BackendPortfolio.Models;
using BackendPortfolio.Repositories;
using BackendPortfolio.Repositories.Realisations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendPortfolio.Controllers
{
    [ApiController]
    [Route("api/realisations")]
    public class RealisationController : ControllerBase
    {
        private readonly IRealisationRepository _repo;
        private readonly IUsersRepository _users;
        private readonly IManagerRepository _managers;

        public RealisationController(
            IRealisationRepository repo,
            IUsersRepository users,
            IManagerRepository managers)
        {
            _repo = repo;
            _users = users;
            _managers = managers;
        }

        // ── Helper : résoudre le manager connecté ────────────────────────
        private async Task<Manager?> GetCurrentManagerAsync()
        {
            var userId = await _users.GetLocalUserIdAsync(User);
            if (userId == null) return null;
            return await _managers.GetManagerByUserIdAsync(userId.Value);
        }

        // ── Helper : mapper vers DTO réponse ─────────────────────────────
        private static RealisationDtos.RealisationResponseDto ToResponse(Realisation r) =>
            new(
                r.RealisationId,
                r.ManagerId,
                r.CollaboratorId,
                r.Collaborator?.User != null
                    ? $"{r.Collaborator.User.FirstName} {r.Collaborator.User.LastName}"
                    : null,
                r.Title,
                r.Description,
                r.ClientName,
                r.SiteUrl,
                r.ScreenshotUrl,
                r.TechnologiesJson != null
                    ? JsonSerializer.Deserialize<List<string>>(r.TechnologiesJson) ?? new()
                    : new(),
                r.Category,
                r.DeliveredAt,
                r.IsPublic,
                r.CreatedAt,
                r.UpdatedAt
            );

        private static RealisationDtos.RealisationSummaryDto ToSummary(Realisation r) =>
            new(
                r.RealisationId,
                r.Title,
                r.Description,
                r.ClientName,
                r.SiteUrl,
                r.ScreenshotUrl,
                r.TechnologiesJson != null
                    ? JsonSerializer.Deserialize<List<string>>(r.TechnologiesJson) ?? new()
                    : new(),
                r.Category,
                r.DeliveredAt
            );

        // ════════════════════════════════════════════════════════════════
        // MANAGER — routes protégées
        // ════════════════════════════════════════════════════════════════

        // GET /api/realisations/my
        // Liste des réalisations du manager connecté
        [HttpGet("my")]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> GetMine()
        {
            var manager = await GetCurrentManagerAsync();
            if (manager == null) return Unauthorized();

            var list = await _repo.GetByManagerAsync(manager.ManagerId);
            return Ok(list.Select(ToResponse));
        }

        // GET /api/realisations/{id}
        // Détail d'une réalisation
        [HttpGet("{id:int}")]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _repo.GetByIdAsync(id);
            return item == null ? NotFound() : Ok(ToResponse(item));
        }

        // POST /api/realisations
        // Créer une réalisation
        [HttpPost]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> Create([FromBody] RealisationDtos.UpsertRealisationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Le titre est obligatoire." });

            var manager = await GetCurrentManagerAsync();
            if (manager == null) return Unauthorized();

            var created = await _repo.CreateAsync(manager.ManagerId, dto);
            return CreatedAtAction(nameof(GetById), new { id = created.RealisationId }, ToResponse(created));
        }

        // PUT /api/realisations/{id}
        // Mettre à jour une réalisation
        [HttpPut("{id:int}")]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> Update(int id, [FromBody] RealisationDtos.UpsertRealisationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Le titre est obligatoire." });

            var manager = await GetCurrentManagerAsync();
            if (manager == null) return Unauthorized();

            var updated = await _repo.UpdateAsync(id, manager.ManagerId, dto);
            return updated == null ? NotFound() : Ok(ToResponse(updated));
        }

        // DELETE /api/realisations/{id}
        // Supprimer une réalisation
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var manager = await GetCurrentManagerAsync();
            if (manager == null) return Unauthorized();

            var deleted = await _repo.DeleteAsync(id, manager.ManagerId);
            return deleted ? NoContent() : NotFound();
        }

        // ════════════════════════════════════════════════════════════════
        // PUBLIC — vue client (aucune auth requise)
        // ════════════════════════════════════════════════════════════════

        // GET /api/realisations/public
        // Liste publique des réalisations (pour les clients)
        [HttpGet("public")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublic()
        {
            var list = await _repo.GetPublicAsync();
            return Ok(list.Select(ToSummary));
        }
    }
}