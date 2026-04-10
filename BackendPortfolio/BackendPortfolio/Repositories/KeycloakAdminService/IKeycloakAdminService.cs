using BackendPortfolio.Models;
using BackendPortfolio.DTO.kc;

namespace BackendPortfolio.Repositories

{
    public interface IKeycloakAdminService
    {
        Task<IReadOnlyList<KcUser>> GetUsersByClientRolesAsync(
        string[] roleNames,
        int first = 0,
        int max = 1000);

        // ✅ nouveau : récupérer tous les users Keycloak (pagination)
        Task<List<KcUser>> GetUsersAsync(int first = 0, int max = 200);


        // ✅ NOUVEAU
        Task<string?> CreateUserAsync(CreateUserDto dto);
        Task DeleteUserAsync(string keycloakId);

       Task<bool> UpdateUserAsync(string keycloakId, string? firstName, string? lastName, string? email);

        Task<bool> ChangePasswordAsync(string keycloakUserId, string newPassword);
    }
}
