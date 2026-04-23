/*using BackendPortfolio.DTO.Portfolio;
using BackendPortfolio.Models;
using BackendPortfolio.Repositories.PortfolioAi;
using BackendPortfolio.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BackendPortfolio.Controllers
{
    [ApiController]
    [Route("api/portfolio-ai")]
    [Authorize]
    public class PortfolioAiController : ControllerBase
    {
        private readonly IPortfolioAiService _ai;
        private readonly IUsersRepository _users;
        private readonly DbVitrineContext _db;

        public PortfolioAiController(IPortfolioAiService ai, IUsersRepository users, DbVitrineContext db)
        { _ai = ai; _users = users; _db = db; }

        // POST api/portfolio-ai/chat
        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequestDto dto)
        {
            var result = await _ai.ChatAsync(dto);
            return Ok(result);
        }

        // POST api/portfolio-ai/generate
        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] GeneratePortfolioDto dto)
        {
            try
            {
                var html = await _ai.GeneratePortfolioHtmlAsync(dto.CollaboratorId, _db);
                return Content(html, "text/html");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST api/portfolio-ai/correct
        [HttpPost("correct")]
        public async Task<IActionResult> Correct([FromBody] ChatCorrectRequestDto dto)
        {
            try
            {
                var result = await _ai.CorrectAndUpdateAsync(dto, _db);
                return Ok(new
                {
                    message = result.Message,
                    entityType = result.EntityType,
                    action = result.Action,
                    updatedHtml = result.UpdatedHtml
                });
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("indisponible") || ex.Message.Contains("UNAVAILABLE"))
            {
                return StatusCode(503, new
                {
                    message = "L'IA est temporairement surchargée. Réessaie dans quelques secondes.",
                    retryable = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CORRECT ERROR] {ex.Message}");
                return StatusCode(500, new { message = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        // PATCH api/portfolio-ai/patch-profile/{collaboratorId}
        // Mise à jour immédiate du HTML depuis la BD — ZÉRO appel Gemini.
        [HttpPatch("patch-profile/{collaboratorId}")]
        public async Task<IActionResult> PatchProfile(int collaboratorId)
        {
            try
            {
                var html = await _ai.PatchPortfolioFromProfileAsync(collaboratorId, _db);
                return Ok(new
                {
                    success = true,
                    updatedHtml = html,
                    message = "Portfolio mis à jour automatiquement depuis le profil."
                });
            }
            catch (Exception ex) when (ex.Message.Contains("Portfolio introuvable"))
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PATCH ERROR] {ex.Message}");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // GET api/portfolio-ai/my-portfolio-state/{collaboratorId}
        // Retourne le HTML existant + indique si le profil a changé depuis la dernière génération.
        [HttpGet("my-portfolio-state/{collaboratorId}")]
        public async Task<IActionResult> GetMyPortfolioState(int collaboratorId)
        {
            try
            {
                var portfolio = await _db.Portfolios
                    .FirstOrDefaultAsync(p => p.CollaboratorId == collaboratorId && p.IsActive == true);

                var currentHash = await _ai.GetProfileHashAsync(collaboratorId, _db);

                if (portfolio == null)
                    return Ok(new
                    {
                        hasPortfolio = false,
                        html = (string?)null,
                        profileChanged = false,
                        profileHash = currentHash
                    });

                var profileChanged = portfolio.LastProfileHash != currentHash;

                Console.WriteLine($"[STATE] collabId={collaboratorId} | current={currentHash} | saved={portfolio.LastProfileHash} | changed={profileChanged}");

                // autopatch : si le profil a changé, on met à jour le HTML immédiatement
                if (profileChanged)
                {
                    try
                    {
                        Console.WriteLine($"[STATE] ⚡ Profile changed → auto-patch HTML for collabId={collaboratorId}");
                        var updatedHtml = await _ai.PatchPortfolioFromProfileAsync(collaboratorId, _db);

                        return Ok(new
                        {
                            hasPortfolio = true,
                            html = updatedHtml,
                            portfolioId = portfolio.PortfolioId,
                            generatedAt = portfolio.AiGeneratedAt,
                            profileChanged = false,   // ← déjà synchronisé
                            profileHash = currentHash
                        });
                    }
                    catch (Exception patchEx)
                    {
                        // Si le patch échoue, on retourne quand même l'ancien HTML sans crasher
                        Console.WriteLine($"[STATE] ⚠️ Auto-patch failed: {patchEx.Message} → returning stale HTML");
                    }
                }

                return Ok(new
                {
                    hasPortfolio = true,
                    html = portfolio.HtmlContent,
                    portfolioId = portfolio.PortfolioId,
                    generatedAt = portfolio.AiGeneratedAt,
                    profileChanged,
                    profileHash = currentHash
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST api/portfolio-ai/regenerate apres modification
        [HttpPost("regenerate")]
        public async Task<IActionResult> Regenerate([FromBody] GeneratePortfolioDto dto)
        {
            try
            {
                var html = await _ai.GeneratePortfolioHtmlAsync(dto.CollaboratorId, _db);
                return Ok(new { success = true, updatedHtml = html, message = "Portfolio régénéré avec les data-* attributes." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        // GET api/portfolio-ai/me
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            try
            {
                var userId = await _users.GetLocalUserIdAsync(User);
                if (userId == null) return Unauthorized();

                var collab = await _db.Collaborators
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (collab == null)
                    return NotFound(new { message = "Profil collaborateur introuvable" });

                return Ok(new { collaboratorId = collab.CollaboratorId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}*/