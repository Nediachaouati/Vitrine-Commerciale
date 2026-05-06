using BackendPortfolio.DTO;
using BackendPortfolio.Models;
using BackendPortfolio.Repositories;
using BackendPortfolio.Repositories.ShortList;
using BackendPortfolio.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using static BackendPortfolio.DTO.ShortlistDtos;

namespace BackendPortfolio.Controllers
{
    [ApiController]
    [Route("api/shortlists")]
    public class ShortlistController : ControllerBase
    {
        private readonly IShortlistRepository _repo;
        private readonly IManagerRepository _managerRepo;
        private readonly IUsersRepository _users;
        private readonly IConfiguration _config;
        private readonly ILogger<ShortlistController> _logger;

        public ShortlistController(
            IShortlistRepository repo,
            IManagerRepository managerRepo,
            IUsersRepository users,
            IConfiguration config,
            ILogger<ShortlistController> logger)
        {
            _repo = repo;
            _managerRepo = managerRepo;
            _users = users;
            _config = config;
            _logger = logger;
        }

        private async Task<Manager?> GetCurrentManagerAsync()
        {
            var userId = await _users.GetLocalUserIdAsync(User);
            if (userId == null) return null;
            return await _managerRepo.GetManagerByUserIdAsync(userId.Value);
        }

        private string BuildShareUrl(string token)
        {
            var baseUrl = _config["App:FrontendUrl"] ?? "https://vitrine.local";
            return $"{baseUrl}/shortlist/{token}";
        }

        private ShortlistDtos.ShortlistDetailDto ToDetailDto(Shortlist s)
        {
            var items = s.ShortlistItems.OrderBy(i => i.DisplayOrder).Select(i =>
            {
                var collab = i.Portfolio.Collaborator;
                var primarySkills = collab.CollaboratorSkills
                    .Where(cs => cs.IsPrimary)
                    .Select(cs => cs.Skill?.Name ?? "")
                    .Where(n => !string.IsNullOrEmpty(n))
                    .ToList();

                return new ShortlistDtos.ShortlistItemDto(
                    i.ItemId,
                    i.PortfolioId,
                    i.SwitchedViewId,
                    i.DisplayOrder,
                    i.ManagerNote,
                    collab.CollaboratorId,
                    collab.User?.FirstName ?? "",
                    collab.User?.LastName ?? "",
                    collab.User?.AvatarUrl,
                    collab.JobTitle ?? "",
                    collab.YearsExperience,
                    collab.AvailabilityStatus ?? "",
                    primarySkills,
                    ManagerRepository.ComputeBadges(collab),
                    i.Portfolio.PublicSlug,
                    i.SwitchedView?.GeneratedTitle,
                    i.SwitchedView?.GeneratedBio,
                    i.SwitchedView?.TransferableSkillsJson != null
                        ? JsonSerializer.Deserialize<List<string>>(i.SwitchedView.TransferableSkillsJson)
                        : null,
                    i.SwitchedView?.RelevanceScore,
                    i.SwitchedView?.PublicShareSlug
                );
            }).ToList();

            var managerName = $"{s.Manager?.User?.FirstName} {s.Manager?.User?.LastName}".Trim();
            var clientName = s.Client != null ? s.Client.CompanyName : null;

            return new ShortlistDtos.ShortlistDetailDto(
                s.ShortlistId,
                s.Title,
                s.Description,
                s.Status,
                s.ShareToken,
                BuildShareUrl(s.ShareToken),
                s.ExpiresAt,
                s.CreatedAt,
                managerName,
                clientName,
                items
            );
        }

        // ════════════════════════════════════════════════════════════════
        // MANAGER — CRUD Shortlists
        // ════════════════════════════════════════════════════════════════

        // POST /api/shortlists
        [HttpPost]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> Create([FromBody] ShortlistDtos.CreateShortlistDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Le titre est requis." });

            if (!dto.Items.Any())
                return BadRequest(new { message = "Sélectionnez au moins un collaborateur." });

            var manager = await GetCurrentManagerAsync();
            if (manager == null) return Unauthorized();

            var shortlist = await _repo.CreateAsync(manager.ManagerId, dto);
            var full = await _repo.GetByIdAsync(shortlist.ShortlistId);
            return Ok(ToDetailDto(full!));
        }

        // GET /api/shortlists
        [HttpGet]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> GetMyShortlists()
        {
            var manager = await GetCurrentManagerAsync();
            if (manager == null) return Unauthorized();

            var list = await _repo.GetByManagerAsync(manager.ManagerId);
            return Ok(list.Select(s => new ShortlistDtos.ShortlistSummaryDto(
                s.ShortlistId,
                s.Title,
                s.Description,
                s.Status,
                s.ShareToken,
                s.ExpiresAt,
                s.CreatedAt,
                s.ShortlistItems.Count,
                s.Client?.CompanyName
            )));
        }

        // GET /api/shortlists/{id}
        [HttpGet("{id:int}")]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var shortlist = await _repo.GetByIdAsync(id);
            if (shortlist == null) return NotFound();
            return Ok(ToDetailDto(shortlist));
        }

        // PUT /api/shortlists/{id}
        [HttpPut("{id:int}")]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ShortlistDtos.UpdateShortlistDto dto)
        {
            var updated = await _repo.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            var full = await _repo.GetByIdAsync(id);
            return Ok(ToDetailDto(full!));
        }

        // DELETE /api/shortlists/{id}
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _repo.DeleteAsync(id);
            return ok ? Ok(new { message = "Shortlist supprimée." }) : NotFound();
        }

        // POST /api/shortlists/{id}/items
        [HttpPost("{id:int}/items")]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> AddItem(int id, [FromBody] ShortlistDtos.ShortlistItemInputDto item)
        {
            await _repo.AddItemAsync(id, item);
            return Ok(new { message = "Collaborateur ajouté à la shortlist." });
        }

        // DELETE /api/shortlists/{id}/items/{portfolioId}
        [HttpDelete("{id:int}/items/{portfolioId:int}")]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> RemoveItem(int id, int portfolioId)
        {
            await _repo.RemoveItemAsync(id, portfolioId);
            return Ok(new { message = "Collaborateur retiré de la shortlist." });
        }

        // ════════════════════════════════════════════════════════════════
        // POST /api/shortlists/{id}/send
        // ════════════════════════════════════════════════════════════════
        [HttpPost("{id:int}/send")]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> Send(
            int id,
            [FromBody] SendShortlistOptionsDto dto,
            [FromServices] IShortlistEmailService emailService,
            [FromServices] IShortlistPdfService pdfService)
        {
            _logger.LogInformation("=== [Send] START — shortlistId={Id} ===", id);

            try
            {
                // ── STEP 1 : Lire le body reçu ────────────────────────────────
                _logger.LogInformation("[Send] DTO reçu → Mode={Mode} | Email={Email} | ClientName={ClientName}",
                    dto?.Mode ?? "NULL",
                    dto?.ClientEmail ?? "NULL",
                    dto?.ClientName ?? "NULL");

                if (dto == null)
                {
                    _logger.LogWarning("[Send] DTO est NULL — body mal désérialisé");
                    return BadRequest(new { message = "Body de la requête invalide." });
                }

                // ── STEP 2 : Récupérer la shortlist ───────────────────────────
                _logger.LogInformation("[Send] Récupération shortlist id={Id}", id);
                var shortlist = await _repo.GetByIdAsync(id);
                if (shortlist == null)
                {
                    _logger.LogWarning("[Send] Shortlist introuvable id={Id}", id);
                    return NotFound(new { message = "Shortlist introuvable." });
                }
                _logger.LogInformation("[Send] Shortlist trouvée → Title={Title} | Items={Count}",
                    shortlist.Title, shortlist.ShortlistItems.Count);

                // ── STEP 3 : Récupérer le manager ─────────────────────────────
                _logger.LogInformation("[Send] Récupération manager courant");
                var manager = await GetCurrentManagerAsync();
                if (manager == null)
                {
                    _logger.LogWarning("[Send] Manager introuvable — utilisateur non reconnu");
                    return Unauthorized();
                }
                _logger.LogInformation("[Send] Manager trouvé → {First} {Last}",
                    manager.User?.FirstName, manager.User?.LastName);

                var shareUrl = BuildShareUrl(shortlist.ShareToken);
                var managerName = $"{manager.User?.FirstName} {manager.User?.LastName}".Trim();
                _logger.LogInformation("[Send] ShareUrl={Url}", shareUrl);

                // ── STEP 4 : Marquer comme envoyée ────────────────────────────
                _logger.LogInformation("[Send] Mise à jour statut → 'sent'");
                await _repo.UpdateAsync(id, new ShortlistDtos.UpdateShortlistDto(null, null, "sent", null));
                _logger.LogInformation("[Send] Statut mis à jour avec succès");

                // ── STEP 5 : Mode EMAIL ───────────────────────────────────────
                if (dto.Mode == "email")
                {
                    _logger.LogInformation("[Send] Mode EMAIL → ToEmail={Email}", dto.ClientEmail);

                    if (string.IsNullOrWhiteSpace(dto.ClientEmail))
                    {
                        _logger.LogWarning("[Send] Email manquant en mode email");
                        return BadRequest(new { message = "L'adresse email du client est requise." });
                    }

                    var emailRequest = new ShortlistEmailRequest
                    {
                        ToEmail = dto.ClientEmail,
                        ToName = dto.ClientName ?? "Client",
                        ShortlistTitle = shortlist.Title,
                        ShareUrl = shareUrl,
                        Subject = dto.Subject ?? $"Profils recommandés — {shortlist.Title}",
                        MessageBody = dto.MessageBody ?? $"Bonjour,\n\nVeuillez trouver ci-dessous les profils recommandés.\n\nCordialement,\n{managerName}",
                        ManagerName = managerName
                    };

                    _logger.LogInformation("[Send] Appel emailService.SendShortlistEmailAsync → To={Email} | Subject={Subject}",
                        emailRequest.ToEmail, emailRequest.Subject);

                    await emailService.SendShortlistEmailAsync(emailRequest);

                    _logger.LogInformation("[Send] Email envoyé avec succès ✓");

                    return Ok(new
                    {
                        message = "Email envoyé avec succès au client.",
                        shareToken = shortlist.ShareToken,
                        shareUrl
                    });
                }

                // ── STEP 6 : Mode PDF ─────────────────────────────────────────
                if (dto.Mode == "pdf")
                {
                    _logger.LogInformation("[Send] Mode PDF");

                    var pdfRequest = BuildPdfRequest(shortlist, managerName, shareUrl, dto.ClientName);
                    _logger.LogInformation("[Send] BuildPdfRequest OK → {Count} items", pdfRequest.Items.Count);

                    var pdfBytes = pdfService.GenerateShortlistPdf(pdfRequest);
                    _logger.LogInformation("[Send] PDF généré → {Size} bytes", pdfBytes.Length);

                    if (!string.IsNullOrWhiteSpace(dto.ClientEmail))
                    {
                        _logger.LogInformation("[Send] Envoi email PDF → {Email}", dto.ClientEmail);
                        await emailService.SendShortlistEmailAsync(new ShortlistEmailRequest
                        {
                            ToEmail = dto.ClientEmail,
                            ToName = dto.ClientName ?? "Client",
                            ShortlistTitle = shortlist.Title,
                            ShareUrl = shareUrl,
                            Subject = dto.Subject ?? $"Rapport PDF — {shortlist.Title}",
                            MessageBody = dto.MessageBody ?? $"Bonjour,\n\nVeuillez trouver en pièce jointe le rapport.\n\nCordialement,\n{managerName}",
                            ManagerName = managerName
                        });
                        _logger.LogInformation("[Send] Email PDF envoyé ✓");
                    }

                    return File(pdfBytes, "text/html; charset=utf-8",
                        $"shortlist-{shortlist.ShortlistId}-{DateTime.Now:yyyyMMdd}.html");
                }

                // ── STEP 7 : Mode LINK (défaut) ───────────────────────────────
                _logger.LogInformation("[Send] Mode LINK (défaut) → retour shareUrl");
                return Ok(new
                {
                    message = "Shortlist marquée comme envoyée.",
                    shareToken = shortlist.ShareToken,
                    shareUrl
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "[Send] ERREUR — Type={Type} | Message={Msg} | Inner={Inner}",
                    ex.GetType().FullName,
                    ex.Message,
                    ex.InnerException?.Message ?? "aucune");

                return StatusCode(500, new
                {
                    message = ex.Message,
                    type = ex.GetType().Name,
                    inner = ex.InnerException?.Message
                });
            }
        }

        // ════════════════════════════════════════════════════════════════
        // CLIENT — Consultation via token
        // GET /api/shortlists/view/{token}
        // ════════════════════════════════════════════════════════════════
        [HttpGet("view/{token}")]
        [Authorize]
        public async Task<IActionResult> ViewByToken(string token)
        {
            var shortlist = await _repo.GetByTokenAsync(token);
            if (shortlist == null)
                return NotFound(new { message = "Shortlist introuvable ou expirée." });

            var userId = await _users.GetLocalUserIdAsync(User);
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            await _repo.LogAccessAsync(shortlist.ShortlistId, userId, ip);

            var items = shortlist.ShortlistItems.OrderBy(i => i.DisplayOrder).Select(i =>
            {
                var collab = i.Portfolio.Collaborator;
                var primarySkills = collab.CollaboratorSkills
                    .Where(cs => cs.IsPrimary)
                    .Select(cs => cs.Skill?.Name ?? "")
                    .Where(n => !string.IsNullOrEmpty(n))
                    .ToList();

                return new ShortlistDtos.ShortlistItemDto(
                    i.ItemId,
                    i.PortfolioId,
                    i.SwitchedViewId,
                    i.DisplayOrder,
                    i.ManagerNote,
                    collab.CollaboratorId,
                    collab.User?.FirstName ?? "",
                    collab.User?.LastName ?? "",
                    collab.User?.AvatarUrl,
                    collab.JobTitle ?? "",
                    collab.YearsExperience,
                    collab.AvailabilityStatus ?? "",
                    primarySkills,
                    ManagerRepository.ComputeBadges(collab),
                    i.Portfolio.PublicSlug,
                    i.SwitchedView?.GeneratedTitle,
                    i.SwitchedView?.GeneratedBio,
                    i.SwitchedView?.TransferableSkillsJson != null
                        ? JsonSerializer.Deserialize<List<string>>(i.SwitchedView.TransferableSkillsJson)
                        : null,
                    i.SwitchedView?.RelevanceScore,
                    i.SwitchedView?.PublicShareSlug
                );
            }).ToList();

            return Ok(new ShortlistDtos.ClientShortlistViewDto(
                shortlist.Title,
                shortlist.Description,
                $"{shortlist.Manager?.User?.FirstName} {shortlist.Manager?.User?.LastName}".Trim(),
                shortlist.CreatedAt,
                items
            ));
        }

        // ════════════════════════════════════════════════════════════════
        // GET /api/shortlists/{id}/pdf
        // ════════════════════════════════════════════════════════════════
        [HttpGet("{id:int}/pdf")]
        [Authorize(Roles = "vitrine-manager,vitrine-admin")]
        public async Task<IActionResult> DownloadPdf(
            int id,
            [FromServices] IShortlistPdfService pdfService)
        {
            var shortlist = await _repo.GetByIdAsync(id);
            if (shortlist == null) return NotFound();

            var manager = await GetCurrentManagerAsync();
            if (manager == null) return Unauthorized();

            var managerName = $"{manager.User?.FirstName} {manager.User?.LastName}".Trim();
            var shareUrl = BuildShareUrl(shortlist.ShareToken);
            var pdfRequest = BuildPdfRequest(shortlist, managerName, shareUrl);
            var bytes = pdfService.GenerateShortlistPdf(pdfRequest);

            return File(bytes, "text/html; charset=utf-8",
                $"shortlist-{shortlist.ShortlistId}.html");
        }

        // ════════════════════════════════════════════════════════════════
        // HELPER — BuildPdfRequest
        // ════════════════════════════════════════════════════════════════
        private ShortlistPdfRequest BuildPdfRequest(
            Shortlist shortlist,
            string managerName,
            string shareUrl,
            string? overrideClientName = null)
        {
            return new ShortlistPdfRequest
            {
                Title = shortlist.Title,
                Description = shortlist.Description,
                ManagerName = managerName,
                ClientName = shortlist.Client?.CompanyName ?? overrideClientName,
                ShareUrl = shareUrl,
                CreatedAt = shortlist.CreatedAt,
                Items = shortlist.ShortlistItems
                    .OrderBy(i => i.DisplayOrder)
                    .Select(i =>
                    {
                        var collab = i.Portfolio.Collaborator;
                        var skills = collab.CollaboratorSkills
                            .Where(cs => cs.IsPrimary)
                            .Select(cs => cs.Skill?.Name ?? "")
                            .Where(n => !string.IsNullOrEmpty(n))
                            .ToList();
                        return new ShortlistPdfItem
                        {
                            FirstName = collab.User?.FirstName ?? "",
                            LastName = collab.User?.LastName ?? "",
                            JobTitle = collab.JobTitle ?? "",
                            AvailabilityStatus = collab.AvailabilityStatus ?? "",
                            YearsExperience = collab.YearsExperience,
                            PrimarySkills = skills,
                            RelevanceScore = i.SwitchedView?.RelevanceScore,
                            ManagerNote = i.ManagerNote
                        };
                    }).ToList()
            };
        }
    }
}