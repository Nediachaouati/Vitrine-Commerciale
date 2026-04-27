using BackendPortfolio.DTO;
using BackendPortfolio.Models;

namespace BackendPortfolio.Repositories.Realisations
{
    public interface IRealisationRepository
    {
        Task<List<Realisation>> GetByManagerAsync(int managerId);
        Task<List<Realisation>> GetPublicAsync();           // pour les clients
        Task<Realisation?> GetByIdAsync(int id);
        Task<Realisation> CreateAsync(int managerId, RealisationDtos.UpsertRealisationDto dto);
        Task<Realisation?> UpdateAsync(int id, int managerId, RealisationDtos.UpsertRealisationDto dto);
        Task<bool> DeleteAsync(int id, int managerId);
    }
}
