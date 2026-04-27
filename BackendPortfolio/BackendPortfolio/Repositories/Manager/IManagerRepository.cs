using BackendPortfolio.DTO;
using BackendPortfolio.Models;

namespace BackendPortfolio.Repositories
{
    public interface IManagerRepository
    {
        // 5.1 – Dashboard
        Task<List<ManagerDtos.CollaboratorSummaryDto>> GetAllCollaboratorSummariesAsync();

        // 5.3 – Filtres portfolios
        Task<List<ManagerDtos.PortfolioListItemDto>> GetFilteredPortfoliosAsync(
            ManagerDtos.PortfolioFilterDto filter);

        // Besoins client (persistance BDD)
        Task<ClientNeed> CreateClientNeedAsync(int managerId, ManagerDtos.CreateClientNeedDto dto);
        Task<ClientNeed?> GetClientNeedAsync(int needId);
        Task<List<ClientNeed>> GetClientNeedsByManagerAsync(int managerId);

        // Collaborateurs pour matching
        Task<Models.Collaborator?> GetCollaboratorFullAsync(int collaboratorId);
        Task<List<Models.Collaborator>> GetAllCollaboratorsFullAsync();

        // Manager courant
        Task<Manager?> GetManagerByUserIdAsync(Guid userId);
    }
}