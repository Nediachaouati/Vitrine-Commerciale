namespace BackendPortfolio.DTO.Profile
{
    public class UpdateProfileDto
    {
        // Champs communs (User)
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }

        public string? NewPassword { get; set; }

        // Champs spécifiques Collaborator
        public string? JobTitle { get; set; }
        public string? Bio { get; set; }
        public int? YearsExperience { get; set; }
        public string? LinkedinUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? AvailabilityStatus { get; set; }
        public DateOnly? AvailabilityDate { get; set; }
        public bool? IsPublic { get; set; }

        // Champs spécifiques Manager
        public string? Department { get; set; }
    }
}