using BackendPortfolio.DTO;
using BackendPortfolio.Models;

namespace BackendPortfolio.Repositories
{
    public interface IPortfolioRepository
    {
        Task<Portfolio> CreateAsync(int collaboratorId, CollaboratorDtos.CreatePortfolioDto dto);
        Task<Portfolio?> GetWithItemsAsync(int portfolioId);
        Task<Portfolio?> GetBySlugAsync(string slug);
        Task<List<Portfolio>> GetByCollaboratorAsync(int collaboratorId);
        Task<Portfolio?> UpdateAsync(int portfolioId, CollaboratorDtos.UpdatePortfolioDto dto);
        Task<bool> DeleteAsync(int portfolioId);

        // Gestion de la sélection (ce qui est visible dans ce portfolio)
        Task SetSkillsAsync(int portfolioId, List<CollaboratorDtos.PortfolioItemDto> items);
        Task SetExperiencesAsync(int portfolioId, List<CollaboratorDtos.PortfolioItemDto> items);
        Task SetEducationsAsync(int portfolioId, List<CollaboratorDtos.PortfolioItemDto> items);
        Task SetCertificationsAsync(int portfolioId, List<CollaboratorDtos.PortfolioItemDto> items);
        Task SetProjectsAsync(int portfolioId, List<CollaboratorDtos.PortfolioItemDto> items);
    }
}