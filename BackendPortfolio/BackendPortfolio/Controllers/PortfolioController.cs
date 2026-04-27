using BackendPortfolio.DTO;
using BackendPortfolio.Repositories;
using BackendPortfolio.Repositories.Collaborator;
using BackendPortfolio.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BackendPortfolio.DTO.CollaboratorDtos;

namespace BackendPortfolio.Controllers
{
    [ApiController]
    [Route("api/portfolio")]
    [Authorize]
    public class PortfolioController : ControllerBase
    {
        private readonly IPortfolioRepository _portfolioRepo;
        private readonly ICollaboratorRepository _collabRepo;
        private readonly IUsersRepository _users;
        private readonly IPortfolioAiService _ai;

        public PortfolioController(
            IPortfolioRepository portfolioRepo,
            ICollaboratorRepository collabRepo,
            IUsersRepository users,
            IPortfolioAiService ai)
        {
            _portfolioRepo = portfolioRepo;
            _collabRepo = collabRepo;
            _users = users;
            _ai = ai;
        }

        private async Task<int?> GetCollabId()
        {
            var userId = await _users.GetLocalUserIdAsync(User);
            if (userId == null) return null;
            var collab = await _collabRepo.GetByUserIdAsync(userId.Value);
            return collab?.CollaboratorId;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyPortfolios()
        {
            var collabId = await GetCollabId();
            if (collabId == null) return Unauthorized();
            return Ok(await _portfolioRepo.GetByCollaboratorAsync(collabId.Value));
        }

        [HttpGet("{portfolioId:int}")]
        public async Task<IActionResult> GetPortfolio(int portfolioId)
        {
            var portfolio = await _portfolioRepo.GetWithItemsAsync(portfolioId);
            return portfolio == null ? NotFound() : Ok(portfolio);
        }

        // ← Correction : GetBySlugAsync gère déjà le ViewCount
        [HttpGet("public/{slug}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublic(string slug)
        {
            var portfolio = await _portfolioRepo.GetBySlugAsync(slug);
            return portfolio == null ? NotFound() : Ok(portfolio);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePortfolioDto dto)
        {
            var collabId = await GetCollabId();
            if (collabId == null) return Unauthorized();
            return Ok(await _portfolioRepo.CreateAsync(collabId.Value, dto));
        }

        [HttpPut("{portfolioId:int}")]
        public async Task<IActionResult> Update(int portfolioId, [FromBody] UpdatePortfolioDto dto)
        {
            var portfolio = await _portfolioRepo.UpdateAsync(portfolioId, dto);
            return portfolio == null ? NotFound() : Ok(portfolio);
        }

        [HttpDelete("{portfolioId:int}")]
        public async Task<IActionResult> Delete(int portfolioId)
        {
            var ok = await _portfolioRepo.DeleteAsync(portfolioId);
            return ok ? Ok(new { message = "Portfolio supprimé" }) : NotFound();
        }

        [HttpPut("{portfolioId:int}/skills")]
        public async Task<IActionResult> SetSkills(int portfolioId, [FromBody] SetPortfolioItemsDto dto)
        {
            await _portfolioRepo.SetSkillsAsync(portfolioId, dto.Items);
            return Ok(new { message = "Skills mis à jour" });
        }

        [HttpPut("{portfolioId:int}/experiences")]
        public async Task<IActionResult> SetExperiences(int portfolioId, [FromBody] SetPortfolioItemsDto dto)
        {
            await _portfolioRepo.SetExperiencesAsync(portfolioId, dto.Items);
            return Ok(new { message = "Expériences mises à jour" });
        }

        [HttpPut("{portfolioId:int}/education")]
        public async Task<IActionResult> SetEducation(int portfolioId, [FromBody] SetPortfolioItemsDto dto)
        {
            await _portfolioRepo.SetEducationsAsync(portfolioId, dto.Items);
            return Ok(new { message = "Formations mises à jour" });
        }

        [HttpPut("{portfolioId:int}/certifications")]
        public async Task<IActionResult> SetCertifications(int portfolioId, [FromBody] SetPortfolioItemsDto dto)
        {
            await _portfolioRepo.SetCertificationsAsync(portfolioId, dto.Items);
            return Ok(new { message = "Certifications mises à jour" });
        }
        
        [HttpPut("{portfolioId:int}/projects")]
        public async Task<IActionResult> SetProjects(int portfolioId, [FromBody] SetPortfolioItemsDto dto)
        {
            await _portfolioRepo.SetProjectsAsync(portfolioId, dto.Items);
            return Ok(new { message = "Projets mis à jour" });
        }

       
        [HttpPost("{portfolioId:int}/chat")]
        public async Task<IActionResult> Chat(int portfolioId, [FromBody] ChatRequestDto dto)
        {
            var collabId = await GetCollabId();
            if (collabId == null) return Unauthorized();

            var collab = await _collabRepo.GetFullAsync(collabId.Value);
            if (collab == null) return NotFound(new { message = "Collaborateur introuvable" });

            var portfolio = await _portfolioRepo.GetWithItemsAsync(portfolioId);
            if (portfolio == null) return NotFound(new { message = "Portfolio introuvable" });

            var result = await _ai.ChatAsync(dto, collab, portfolio, _portfolioRepo, _collabRepo);
            return Ok(result);
        }
    }
}