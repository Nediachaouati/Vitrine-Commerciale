using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Collaborator
{
    public int CollaboratorId { get; set; }

    public Guid UserId { get; set; }

    public string JobTitle { get; set; } = null!;

    public string? Bio { get; set; }

    public int YearsExperience { get; set; }

    public string AvailabilityStatus { get; set; } = null!;

    public DateOnly? AvailabilityDate { get; set; }

    public string? LinkedinUrl { get; set; }

    public string? GithubUrl { get; set; }

    public string? City { get; set; }

    public string? Country { get; set; }

    public string? Phone { get; set; }

    public string? ContractType { get; set; }

    public string? RemotePreference { get; set; }

    public bool IsPublic { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Certification> Certifications { get; set; } = new List<Certification>();

    public virtual ICollection<CollaboratorSkill> CollaboratorSkills { get; set; } = new List<CollaboratorSkill>();

    public virtual ICollection<Education> Educations { get; set; } = new List<Education>();

    public virtual ICollection<Experience> Experiences { get; set; } = new List<Experience>();

    public virtual ICollection<Portfolio> Portfolios { get; set; } = new List<Portfolio>();

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();

    public virtual ICollection<Realisation> Realisations { get; set; } = new List<Realisation>();

    public virtual User User { get; set; } = null!;
}
