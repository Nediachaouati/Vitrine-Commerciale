using BackendPortfolio.DTO.kc;
using BackendPortfolio.DTO.Profile;
using BackendPortfolio.Models;

namespace BackendPortfolio.Repositories
{
    public interface IUsersRepository
    {
        /// <summary>
        /// R�cup�re le user local � partir du token Keycloak.
        /// Si inexistant, il le cr�e.
        /// </summary>
        Task<User?> GetOrCreateAsync(ClaimsPrincipal principal);

        /// <summary>
        /// Retourne l'Id local (Guid) du user connect�.
        /// </summary>
        Task<Guid?> GetLocalUserIdAsync(ClaimsPrincipal principal);

        // ? sync depuis Keycloak (batch)
        Task<(int created, int updated)> UpsertFromKeycloakAsync(IEnumerable<KcUser> kcUsers);


        // ✅ NOUVEAU
        Task<User?> CreateWithRoleAsync(CreateUserDto dto, Guid keycloakId);
        Task<bool> EmailExistsAsync(string email);
        Task<bool> DeleteAsync(Guid userId);


        //profile
        Task<object?> GetFullProfileAsync(Guid userId);         
        Task<User?> UpdateFullProfileAsync(Guid userId, UpdateProfileDto dto);
        Task<User?> UpdateAvatarAsync(Guid userId, string? avatarUrl);
        Task<User?> GetByIdAsync(Guid userId);
    }
}