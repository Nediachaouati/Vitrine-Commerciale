namespace BackendPortfolio.DTO
{
    public static class ShortlistDtos
    {
        // ── Création d'une shortlist ──────────────────────────────────────
        public record CreateShortlistDto(
            string Title,
            string? Description,
            int? ClientId,
            DateTime? ExpiresAt,
            List<ShortlistItemInputDto> Items
        );

        public record ShortlistItemInputDto(
            int PortfolioId,
            int? SwitchedViewId,
            int DisplayOrder,
            string? ManagerNote
        );

        // ── Mise à jour ───────────────────────────────────────────────────
        public record UpdateShortlistDto(
            string? Title,
            string? Description,
            string? Status,
            DateTime? ExpiresAt
        );

        // ── Réponses ──────────────────────────────────────────────────────
        public record ShortlistSummaryDto(
            int ShortlistId,
            string Title,
            string? Description,
            string Status,
            string ShareToken,
            DateTime? ExpiresAt,
            DateTime CreatedAt,
            int ItemCount,
            string? ClientName
        );

        public record ShortlistDetailDto(
            int ShortlistId,
            string Title,
            string? Description,
            string Status,
            string ShareToken,
            string ShareUrl,          // URL complète avec token
            DateTime? ExpiresAt,
            DateTime CreatedAt,
            string ManagerName,
            string? ClientName,
            List<ShortlistItemDto> Items
        );

        public record ShortlistItemDto(
            int ItemId,
            int PortfolioId,
            int? SwitchedViewId,
            int DisplayOrder,
            string? ManagerNote,
            // Données du collaborateur
            int CollaboratorId,
            string FirstName,
            string LastName,
            string? AvatarUrl,
            string JobTitle,
            int YearsExperience,
            string AvailabilityStatus,
            List<string> PrimarySkills,
            List<string> Badges,
            string? PublicSlug,
            // Si vue switchée
            string? SwitchedTitle,
            string? SwitchedBio,
            List<string>? TransferableSkills,
            double? RelevanceScore,
            string? PublicShareSlug
        );

        // ── Vue client (publique via token) ──────────────────────────────
        public record ClientShortlistViewDto(
            string Title,
            string? Description,
            string ManagerName,
            DateTime CreatedAt,
            List<ShortlistItemDto> Items
        );

        public record SendShortlistOptionsDto(
            string Mode,           // "email" | "pdf" | "notification"
            string? ClientEmail,
            string? ClientName,
            string? Subject,
            string? MessageBody
);
    }
}
