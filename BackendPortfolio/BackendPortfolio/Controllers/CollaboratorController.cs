using BackendPortfolio.Repositories.Collaborator;
using BackendPortfolio.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BackendPortfolio.DTO.CollaboratorDtos;

namespace BackendPortfolio.Controllers
{
    [ApiController]
    [Route("api/collaborator")]
    [Authorize]
    public class CollaboratorController : ControllerBase
    {
        private readonly ICollaboratorRepository _repo;
        private readonly IUsersRepository _users;

        public CollaboratorController(ICollaboratorRepository repo, IUsersRepository users)
        {
            _repo = repo;
            _users = users;
        }

        private async Task<int?> GetCollabId()
        {
            var userId = await _users.GetLocalUserIdAsync(User);
            Console.WriteLine($"[GetCollabId] userId={userId}");
            if (userId == null) return null;

            var collab = await _repo.GetByUserIdAsync(userId.Value);
            Console.WriteLine($"[GetCollabId] collab={collab?.CollaboratorId}");
            return collab?.CollaboratorId;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = await _users.GetLocalUserIdAsync(User);
            if (userId == null) return Unauthorized();
            var collab = await _repo.GetByUserIdAsync(userId.Value);
            if (collab == null) return NotFound("Collaborateur introuvable");

            var full = await _repo.GetFullAsync(collab.CollaboratorId);
            return Ok(full);
        }

        // SKILLS
        [HttpPost("skills")]
        public async Task<IActionResult> AddSkill([FromBody] AddSkillDto dto)
        {
            var collabId = await GetCollabId();
            if (collabId == null) return Unauthorized();
            var skill = await _repo.AddSkillAsync(collabId.Value, dto);
            return Ok(skill);
        }

        [HttpPut("skills/{collabSkillId}")]
        public async Task<IActionResult> UpdateSkill(int collabSkillId, [FromBody] UpdateSkillDto dto)
        {
            var skill = await _repo.UpdateSkillAsync(collabSkillId, dto);
            return skill == null ? NotFound() : Ok(skill);
        }

        [HttpDelete("skills/{collabSkillId}")]
        public async Task<IActionResult> DeleteSkill(int collabSkillId)
        {
            var ok = await _repo.DeleteSkillAsync(collabSkillId);
            return ok ? Ok(new { message = "Skill supprimé" }) : NotFound();
        }

        // EXPERIENCES
        [HttpPost("experiences")]
        public async Task<IActionResult> AddExperience([FromBody] AddExperienceDto dto)
        {
            var collabId = await GetCollabId();
            if (collabId == null) return Unauthorized();
            var exp = await _repo.AddExperienceAsync(collabId.Value, dto);
            return Ok(exp);
        }

        [HttpPut("experiences/{experienceId:int}")]
        public async Task<IActionResult> UpdateExperience(int experienceId, [FromBody] UpdateExperienceDto dto)
        {
            var exp = await _repo.UpdateExperienceAsync(experienceId, dto);
            return exp == null ? NotFound() : Ok(exp);
        }

        [HttpDelete("experiences/{experienceId:int}")]
        public async Task<IActionResult> DeleteExperience(int experienceId)
        {
            var ok = await _repo.DeleteExperienceAsync(experienceId);
            return ok ? Ok(new { message = "Expérience supprimée" }) : NotFound();
        }

        

        // ── EDUCATION ────────────────────────────────────────────────────
        [HttpPost("education")]
        public async Task<IActionResult> AddEducation([FromBody] AddEducationDto dto)
        {
            var collabId = await GetCollabId();
            if (collabId == null) return Unauthorized();
            var ed = await _repo.AddEducationAsync(collabId.Value, dto);
            return Ok(ed);
        }

        [HttpPut("education/{educationId:int}")]
        public async Task<IActionResult> UpdateEducation(int educationId, [FromBody] UpdateEducationDto dto)
        {
            var ed = await _repo.UpdateEducationAsync(educationId, dto);
            return ed == null ? NotFound() : Ok(ed);
        }

        [HttpDelete("education/{educationId:int}")]
        public async Task<IActionResult> DeleteEducation(int educationId)
        {
            var ok = await _repo.DeleteEducationAsync(educationId);
            return ok ? Ok(new { message = "Formation supprimée" }) : NotFound();
        }

        // ── CERTIFICATIONS ───────────────────────────────────────────────
        [HttpPost("certifications")]
        public async Task<IActionResult> AddCertification([FromBody] AddCertificationDto dto)
        {
            var collabId = await GetCollabId();
            if (collabId == null) return Unauthorized();
            var cert = await _repo.AddCertificationAsync(collabId.Value, dto);
            return Ok(cert);
        }

        [HttpPut("certifications/{certificationId:int}")]
        public async Task<IActionResult> UpdateCertification(int certificationId, [FromBody] UpdateCertificationDto dto)
        {
            var cert = await _repo.UpdateCertificationAsync(certificationId, dto);
            return cert == null ? NotFound() : Ok(cert);
        }

        [HttpDelete("certifications/{certificationId:int}")]
        public async Task<IActionResult> DeleteCertification(int certificationId)
        {
            var ok = await _repo.DeleteCertificationAsync(certificationId);
            return ok ? Ok(new { message = "Certification supprimée" }) : NotFound();
        }

        // ── PROJECTS ─────────────────────────────────────────────────────
        [HttpPost("projects")]
        public async Task<IActionResult> AddProject([FromBody] AddProjectDto dto)
        {
            var collabId = await GetCollabId();
            if (collabId == null) return Unauthorized();
            var project = await _repo.AddProjectAsync(collabId.Value, dto);
            return Ok(project);
        }

        [HttpPut("projects/{projectId:int}")]
        public async Task<IActionResult> UpdateProject(int projectId, [FromBody] UpdateProjectDto dto)
        {
            var project = await _repo.UpdateProjectAsync(projectId, dto);
            return project == null ? NotFound() : Ok(project);
        }

        [HttpDelete("projects/{projectId:int}")]
        public async Task<IActionResult> DeleteProject(int projectId)
        {
            var ok = await _repo.DeleteProjectAsync(projectId);
            return ok ? Ok(new { message = "Projet supprimé" }) : NotFound();
        }
    }
}