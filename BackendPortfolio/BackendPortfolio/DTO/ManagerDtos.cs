namespace BackendPortfolio.DTO
{
    public static class ManagerDtos
    {
        // ── 5.1 Dashboard ──────────────────────────────────────────────
        public record CollaboratorSummaryDto(
            int CollaboratorId,
            string FirstName,
            string LastName,
            string? AvatarUrl,
            string JobTitle,
            string Bio,
            int YearsExperience,
            string AvailabilityStatus,
            DateOnly? AvailabilityDate,   // ✅ CORRIGÉ : DateOnly? aligné avec le modèle Collaborator
            bool IsPublic,
            List<string> Badges,          // 5.6
            List<string> PrimarySkills,
            int PortfolioCount,
            int ViewCount,
            string? PublicSlug
        );

        // ── 5.2 Besoins client - création (persisté en BDD) ───────────
        public record CreateClientNeedDto(
            string Title,
            string Description,
            List<string> RequiredSkills,
            List<string>? PreferredSkills,
            int? MinYearsExperience,
            string? AvailabilityRequired,      // "available" | "soon" | "any"
            List<string>? RequiredCertifications,
            string? ContractType,              // "CDI" | "freelance" | "stage"
            int? ClientId                       // optionnel : lier à un client existant
        );

        // Réponse après création/lecture d'un besoin client
        public record ClientNeedResponseDto(
            int NeedId,
            int ManagerId,
            int? ClientId,
            string Title,
            string Description,
            List<string> RequiredSkills,
            List<string>? PreferredSkills,
            int? MinYearsExperience,
            string? AvailabilityRequired,
            List<string>? RequiredCertifications,
            string? ContractType,
            string Status,
            DateTime CreatedAt
        );

        // DTO interne pour le moteur de scoring (parsé depuis ClientNeed)
        public record ClientNeedsDto(
            string Title,
            string Description,
            List<string> RequiredSkills,
            List<string>? PreferredSkills,
            int? MinYearsExperience,
            string? AvailabilityRequired,
            List<string>? RequiredCertifications,
            string? ContractType
        );

        // ── Résultat de matching (5.2 + 5.4 + 5.5) ───────────────────
        public record MatchedCollaboratorDto(
            int CollaboratorId,
            string FirstName,
            string LastName,
            string? AvatarUrl,
            string JobTitle,
            int YearsExperience,
            string AvailabilityStatus,
            double MatchScore,
            MatchBreakdownDto Breakdown,
            List<string> Badges,
            List<string> MatchedSkills,
            List<string> MissingSkills,
            List<string> Suggestions,
            string? PublicSlug
        );

        // ── 5.4 Détail des critères ────────────────────────────────────
        public record MatchBreakdownDto(
            double SkillScore,
            double ExperienceScore,
            double CertificationScore,
            double AvailabilityScore,
            List<MatchCriterionDto> Details
        );

        public record MatchCriterionDto(
            string Criterion,
            string Status,   // "matched" | "partial" | "missing"
            string Detail
        );

        // ── 5.3 Filtres portfolios ─────────────────────────────────────
        public record PortfolioFilterDto(
            string? Search,
            List<string>? Skills,
            string? AvailabilityStatus,
            int? MinYearsExperience,
            int? MaxYearsExperience,
            string? Theme,
            string? Language,
            string? SortBy,    // "views" | "name" | "date"
            string? SortDir    // "asc" | "desc"
        );

        public record PortfolioListItemDto(
            int PortfolioId,
            string Title,
            string? Description,
            string PublicSlug,
            string Theme,
            string Language,
            bool IsActive,
            int ViewCount,
            DateTime CreatedAt,
            CollaboratorSummaryDto Collaborator
        );

        // ── 5.5 Suggestions d'amélioration ────────────────────────────
        public record ImprovementSuggestionDto(
            int CollaboratorId,
            string CollaboratorName,
            List<string> Suggestions,
            double CurrentMatchScore,
            double PotentialMatchScore
        );
    }
}