namespace BackendPortfolio.DTO
{
    public static class ManagerDtos
    {
        // ── Dashboard ──────────────────────────────────────────────────
        public record CollaboratorSummaryDto(
            int CollaboratorId,
            string FirstName,
            string LastName,
            string? AvatarUrl,
            string JobTitle,
            string Bio,
            int YearsExperience,
            string AvailabilityStatus,
            DateOnly? AvailabilityDate,
            bool IsPublic,
            List<string> Badges,
            List<string> PrimarySkills,
            int PortfolioCount,
            int ViewCount,
            string? PublicSlug
        );

        // ── Besoins client ─────────────────────────────────────────────
        public record CreateClientNeedDto(
            string Title,
            string Description,
            List<string> RequiredSkills,
            List<string>? PreferredSkills,
            int? MinYearsExperience,
            string? AvailabilityRequired,
            List<string>? RequiredCertifications,
            string? ContractType,
            int? ClientId
        );

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

        // ── Matching ───────────────────────────────────────────────────
        public record MatchedCollaboratorDto(
            int CollaboratorId,
            int PortfolioId,
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

        public record MatchBreakdownDto(
            double SkillScore,
            double ExperienceScore,
            double CertificationScore,
            double AvailabilityScore,
            List<MatchCriterionDto> Details
        );

        public record MatchCriterionDto(
            string Criterion,
            string Status,
            string Detail
        );

        // ── Filtres portfolios ─────────────────────────────────────────
        public record PortfolioFilterDto(
            string? Search,
            List<string>? Skills,
            string? AvailabilityStatus,
            int? MinYearsExperience,
            int? MaxYearsExperience,
            string? Theme,
            string? Language,
            string? SortBy,
            string? SortDir
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

        // ── Suggestions ────────────────────────────────────────────────
        public record ImprovementSuggestionDto(
            int CollaboratorId,
            string CollaboratorName,
            List<string> Suggestions,
            double CurrentMatchScore,
            double PotentialMatchScore
        );

        // ── SWITCH PORTFOLIO ───────────────────────────────────────────
        public record BatchSwitchRequestDto(
            List<int> PortfolioIds,
            string TargetTech,
            string? MissionContext
        );

        public record BatchSwitchResultItemDto(
            int PortfolioId,
            int CollaboratorId,
            string CollaboratorName,
            string OriginalJobTitle,
            string TargetTech,
            string GeneratedTitle,
            string GeneratedBio,
            List<string> TransferableSkills,
            double RelevanceScore,
            string PublicShareSlug,
            int? SwitchedViewId,
            string Status
        );

        public record BatchSwitchResponseDto(
            string TargetTech,
            string? MissionContext,
            int Total,
            int SuccessCount,
            int ErrorCount,
            List<BatchSwitchResultItemDto> Results
        );

        // ── Vue switché (lecture manager) ──────────────────────────────
        public record SwitchedViewSummaryDto(
            int ViewId,
            int PortfolioId,
            string TargetTech,
            string GeneratedTitle,
            string GeneratedBio,
            string? MissionContext,
            string Status,
            DateTime UpdatedAt,
            string CollaboratorName,
            string OriginalJobTitle,
            string? PublicSlug,
            List<string> TransferableSkills,
            double? RelevanceScore,
            string? PublicShareSlug
        );

        // ── Vue publique (ce que le CLIENT voit) ───────────────────────
        public record PublicPortfolioViewDto(
            string TargetTech,
            string GeneratedTitle,
            string GeneratedBio,
            string? MissionContext,
            double? RelevanceScore,
            CollaboratorPublicInfoDto Collaborator,
            List<PublicProjectDto> Projects,
            List<PublicSkillDto> Skills,
            List<PublicExperienceDto> Experiences,
            List<PublicCertificationDto> Certifications
        );

        public record CollaboratorPublicInfoDto(
            string FirstName,
            string LastName,
            string? AvatarUrl,
            string JobTitle,
            int YearsExperience,
            string AvailabilityStatus,
            string? LinkedinUrl,
            string? GithubUrl
        );

        public record PublicProjectDto(
     int ProjectId,
     string Title,
     string? Description,
     string? Technologies,       
     string? ProjectUrl,
     string? ScreenshotUrl,      
     int RelevanceOrder
 );

        public record PublicExperienceDto(
            int ExperienceId,
            string CompanyName,         
            string JobTitle,
            string? Description,
            DateOnly StartDate,         
            DateOnly? EndDate,          
            bool IsCurrent,
            int RelevanceOrder
        );

        public record PublicSkillDto(
            int CollabSkillId,
            string Name,
            string Level,
            int YearsUsed,
            bool IsPrimary,
            int RelevanceOrder
        );



        public record PublicCertificationDto(
    int CertificationId,
    string Name,
    string Issuer,           
    DateOnly IssueDate,      
    DateOnly? ExpiryDate,    
    string? CredentialUrl,   
    int RelevanceOrder
);
    }
}