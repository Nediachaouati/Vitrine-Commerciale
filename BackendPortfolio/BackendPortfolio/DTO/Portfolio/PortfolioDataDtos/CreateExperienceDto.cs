/*namespace BackendPortfolio.DTO.Portfolio.PortfolioDataDtos
{
    // ── EXPERIENCE ──────────────────────────────────────────
    public class CreateExperienceDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string? Location { get; set; }
        public string? Technologies { get; set; }
        public string? ContractType { get; set; }
    }

    public class UpdateExperienceDto
    {
        public string? CompanyName { get; set; }
        public string? JobTitle { get; set; }
        public string? Description { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public bool? IsCurrent { get; set; }
        public string? Location { get; set; }
        public string? Technologies { get; set; }
        public string? ContractType { get; set; }
    }

    // ── SKILL ────────────────────────────────────────────────
    public class AddCollaboratorSkillDto
    {
        public int SkillId { get; set; }
        public string Level { get; set; } = string.Empty;
        public int YearsUsed { get; set; }
        public bool IsPrimary { get; set; }
    }

    public class UpdateCollaboratorSkillDto
    {
        public string? Level { get; set; }
        public int? YearsUsed { get; set; }
        public bool? IsPrimary { get; set; }
    }

    // ── CERTIFICATION ────────────────────────────────────────
    public class CreateCertificationDto
    {
        public string Name { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public DateOnly IssueDate { get; set; }
        public DateOnly? ExpiryDate { get; set; }
        public string? CredentialUrl { get; set; }
        public string? BadgeUrl { get; set; }
        public decimal? Score { get; set; }
    }

    public class UpdateCertificationDto
    {
        public string? Name { get; set; }
        public string? Issuer { get; set; }
        public DateOnly? IssueDate { get; set; }
        public DateOnly? ExpiryDate { get; set; }
        public string? CredentialUrl { get; set; }
        public decimal? Score { get; set; }
    }

    // ── EDUCATION ────────────────────────────────────────────
    public class CreateEducationDto
    {
        public string School { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public string Field { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string? Grade { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateEducationDto
    {
        public string? School { get; set; }
        public string? Degree { get; set; }
        public string? Field { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public bool? IsCurrent { get; set; }
        public string? Grade { get; set; }
        public string? Description { get; set; }
    }

    // ── PROJECT ──────────────────────────────────────────────
    public class CreateProjectDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Technologies { get; set; }
        public string? ProjectUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? ScreenshotUrl { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? RoleInProject { get; set; }
    }

    public class UpdateProjectDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Technologies { get; set; }
        public string? ProjectUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? ScreenshotUrl { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? RoleInProject { get; set; }
    }

    // ── PORTFOLIO ────────────────────────────────────────────
    public class CreatePortfolioDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Theme { get; set; } = "dark";
        public string Language { get; set; } = "fr";
        public string? TargetClient { get; set; }
    }

    public class UpdatePortfolioDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Theme { get; set; }
        public string? Language { get; set; }
        public string? TargetClient { get; set; }
        public bool? IsActive { get; set; }
    }

    // ── PORTFOLIO VISIBILITY ─────────────────────────────────
    // Pour ajouter/retirer un élément dans un portfolio
    public class PortfolioItemVisibilityDto
    {
        public bool IsVisible { get; set; } = true;
        public int DisplayOrder { get; set; } = 0;
    }

    // ── PORTFOLIO PUBLIC VIEW ────────────────────────────────
    // Ce que retourne le GET /portfolio/{slug}
    public class PortfolioPublicDto
    {
        public int PortfolioId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Theme { get; set; } = "dark";
        public string Language { get; set; } = "fr";
        public string? TargetClient { get; set; }
        public CollaboratorPublicDto Collaborator { get; set; } = new();
        public List<ExperiencePublicDto> Experiences { get; set; } = new();
        public List<SkillPublicDto> Skills { get; set; } = new();
        public List<CertificationPublicDto> Certifications { get; set; } = new();
        public List<EducationPublicDto> Education { get; set; } = new();
        public List<ProjectPublicDto> Projects { get; set; } = new();
    }

    public class CollaboratorPublicDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? JobTitle { get; set; }
        public string? Bio { get; set; }
        public int YearsExperience { get; set; }
        public string? AvatarUrl { get; set; }
        public string? LinkedinUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? AvailabilityStatus { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
    }

    public class ExperiencePublicDto
    {
        public int ExperienceId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string? Location { get; set; }
        public string? Technologies { get; set; }
        public string? ContractType { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class SkillPublicDto
    {
        public int SkillId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public string Level { get; set; } = string.Empty;
        public int YearsUsed { get; set; }
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class CertificationPublicDto
    {
        public int CertificationId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public DateOnly IssueDate { get; set; }
        public DateOnly? ExpiryDate { get; set; }
        public string? CredentialUrl { get; set; }
        public string? BadgeUrl { get; set; }
        public decimal? Score { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class EducationPublicDto
    {
        public int EducationId { get; set; }
        public string School { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public string Field { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string? Grade { get; set; }
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class ProjectPublicDto
    {
        public int ProjectId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Technologies { get; set; }
        public string? ProjectUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? ScreenshotUrl { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? RoleInProject { get; set; }
        public int DisplayOrder { get; set; }
    }
}*/