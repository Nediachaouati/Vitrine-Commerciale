using BackendPortfolio.DTO;
using BackendPortfolio.Models;

namespace BackendPortfolio.Repositories.Collaborator
{
    public interface ICollaboratorRepository
    {
        Task<Models.Collaborator?> GetByUserIdAsync(Guid userId);
        Task<Models.Collaborator?> GetFullAsync(int collaboratorId);

        // Skills
        Task<CollaboratorSkill> AddSkillAsync(int collaboratorId, CollaboratorDtos.AddSkillDto dto);
        Task<CollaboratorSkill?> UpdateSkillAsync(int collabSkillId, CollaboratorDtos.UpdateSkillDto dto);
        Task<bool> DeleteSkillAsync(int collabSkillId);

        // Experiences
        Task<Experience> AddExperienceAsync(int collaboratorId, CollaboratorDtos.AddExperienceDto dto);
        Task<Experience?> UpdateExperienceAsync(int experienceId, CollaboratorDtos.UpdateExperienceDto dto);
        Task<bool> DeleteExperienceAsync(int experienceId);

        // Education
        Task<Education> AddEducationAsync(int collaboratorId, CollaboratorDtos.AddEducationDto dto);
        Task<Education?> UpdateEducationAsync(int educationId, CollaboratorDtos.UpdateEducationDto dto);
        Task<bool> DeleteEducationAsync(int educationId);

        // Certifications
        Task<Certification> AddCertificationAsync(int collaboratorId, CollaboratorDtos.AddCertificationDto dto);
        Task<Certification?> UpdateCertificationAsync(int certificationId, CollaboratorDtos.UpdateCertificationDto dto);
        Task<bool> DeleteCertificationAsync(int certificationId);

        // Projects
        Task<Project> AddProjectAsync(int collaboratorId, CollaboratorDtos.AddProjectDto dto);
        Task<Project?> UpdateProjectAsync(int projectId, CollaboratorDtos.UpdateProjectDto dto);
        Task<bool> DeleteProjectAsync(int projectId);
    }
}