using BackendPortfolio.DTO;
using BackendPortfolio.Models;

namespace BackendPortfolio.Repositories.ShortList
{
    public interface IShortlistRepository
    {
        Task<Shortlist> CreateAsync(int managerId, ShortlistDtos.CreateShortlistDto dto);
        Task<Shortlist?> GetByIdAsync(int shortlistId);
        Task<Shortlist?> GetByTokenAsync(string token);
        Task<List<Shortlist>> GetByManagerAsync(int managerId);
        Task<Shortlist?> UpdateAsync(int shortlistId, ShortlistDtos.UpdateShortlistDto dto);
        Task<bool> DeleteAsync(int shortlistId);
        Task AddItemAsync(int shortlistId, ShortlistDtos.ShortlistItemInputDto item);
        Task RemoveItemAsync(int shortlistId, int portfolioId);
        Task LogAccessAsync(int shortlistId, Guid? clientUserId, string? ip);
    }
}
