using BackendPortfolio.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendPortfolio.Controllers
{
    [ApiController]
    [Route("api/skillcatalog")]
    public class SkillCatalogController : ControllerBase
    {
        private readonly VitrineDbContext _db;

        public SkillCatalogController(VitrineDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromQuery] string? category = null)
        {
            var query = _db.SkillCatalogs.AsQueryable();
            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(s => s.Category == category);

            return Ok(await query.OrderBy(s => s.Category).ThenBy(s => s.Name).ToListAsync());
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Add([FromBody] CreateSkillDto dto)
        {
            var skill = new SkillCatalog
            {
                Name = dto.Name.Trim(),
                Category = dto.Category.Trim(),
                IconUrl = dto.IconUrl?.Trim()
            };
            _db.SkillCatalogs.Add(skill);
            await _db.SaveChangesAsync();
            return Ok(skill);
        }

        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Delete(int id)
        {
            var skill = await _db.SkillCatalogs.FindAsync(id);
            if (skill == null) return NotFound();
            _db.SkillCatalogs.Remove(skill);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

    public record CreateSkillDto(string Name, string Category, string? IconUrl);
}