namespace BackendPortfolio.DTO
{
    public static class CollaboratorDtos
    {
        // ── Skills ──
        public record AddSkillDto(int SkillId, string Level, int YearsUsed, bool IsPrimary);
        public record UpdateSkillDto(string? Level, int? YearsUsed, bool? IsPrimary);

        // ── Experiences ──
        public record AddExperienceDto(
            string CompanyName,
            string JobTitle,
            string? Description,
            DateOnly StartDate,
            DateOnly? EndDate,
            bool IsCurrent,
            string? Location,
            string? Technologies,
            string? ContractType);

        public record UpdateExperienceDto(
            string? CompanyName,
            string? JobTitle,
            string? Description,
            DateOnly? StartDate,
            DateOnly? EndDate,
            bool? IsCurrent,
            string? Location,
            string? Technologies,
            string? ContractType);

        // ── Education ──
        public record AddEducationDto(
            string School,
            string Degree,
            string Field,
            DateOnly StartDate,
            DateOnly? EndDate,
            bool IsCurrent,
            string? Grade,
            string? Description,
            string? Location);

        public record UpdateEducationDto(
            string? School,
            string? Degree,
            string? Field,
            DateOnly? StartDate,
            DateOnly? EndDate,
            bool? IsCurrent,
            string? Grade,
            string? Description,
            string? Location);

        // ── Certifications ──
        public record AddCertificationDto(
            string Name,
            string Issuer,
            DateOnly IssueDate,
            DateOnly? ExpiryDate,
            string? CredentialUrl,
            string? BadgeUrl,
            decimal? Score);

        public record UpdateCertificationDto(
            string? Name,
            string? Issuer,
            DateOnly? IssueDate,
            DateOnly? ExpiryDate,
            string? CredentialUrl,
            decimal? Score);

        // ── Projects ──
        public record AddProjectDto(
            string Title,
            string? Description,
            string? Technologies,
            string? ProjectUrl,
            string? GithubUrl,
            string? ScreenshotUrl,
            DateOnly? StartDate,
            DateOnly? EndDate,
            string? RoleInProject,
            bool IsFeatured);

        public record UpdateProjectDto(
            string? Title,
            string? Description,
            string? Technologies,
            string? ProjectUrl,
            string? GithubUrl,
            string? ScreenshotUrl,
            DateOnly? StartDate,
            DateOnly? EndDate,
            string? RoleInProject,
            bool? IsFeatured);

        // ── Portfolio ──
        public record CreatePortfolioDto(
            string Title,
            string? Description,
            string? TargetClient,
            string Theme = "dark",
            string Language = "fr");

        public record UpdatePortfolioDto(
            string? Title,
            string? Description,
            string? TargetClient,
            string? Theme,
            string? Language,
            bool? IsActive);

        // ── Sélection d'items pour un portfolio (ce que l'on veut afficher)
        public class SetPortfolioItemsDto
        {
            public List<PortfolioItemDto> Items { get; set; } = new();
        }

        public class PortfolioItemDto
        {
            public int Id { get; set; }
            public bool IsVisible { get; set; }
            public int DisplayOrder { get; set; }
        }

        // ── Chat IA ──
        public record ChatMessageDto(string Role, string Content);
        public record ChatRequestDto(List<ChatMessageDto> Messages, int CollaboratorId);
        public record ChatResponseDto(string Message, bool IsComplete, object? Action = null);
    }
}