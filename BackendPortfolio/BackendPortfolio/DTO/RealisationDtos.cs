namespace BackendPortfolio.DTO
{
    public static class RealisationDtos
    {
        // ── Création / Mise à jour ───────────────
        public record UpsertRealisationDto(
            string Title,
            string? Description,
            string? ClientName,
            string? SiteUrl,
            string? ScreenshotUrl,
            List<string>? Technologies,
            string? Category,
            DateOnly? DeliveredAt,
            bool IsPublic,
            int? CollaboratorId
        );

        // ── Réponse complète ─────────────────────
        public record RealisationResponseDto(
            int RealisationId,
            int ManagerId,
            int? CollaboratorId,
            string? CollaboratorName,   // prénom + nom du collab
            string Title,
            string? Description,
            string? ClientName,
            string? SiteUrl,
            string? ScreenshotUrl,
            List<string> Technologies,
            string? Category,
            DateOnly? DeliveredAt,
            bool IsPublic,
            DateTime CreatedAt,
            DateTime UpdatedAt
        );

        // ── Résumé pour liste publique (clients) ────────────
        public record RealisationSummaryDto(
            int RealisationId,
            string Title,
            string? Description,
            string? ClientName,
            string? SiteUrl,
            string? ScreenshotUrl,
            List<string> Technologies,
            string? Category,
            DateOnly? DeliveredAt
        );
    }
}