using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Experience
{
    public int ExperienceId { get; set; }

    public int CollaboratorId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string JobTitle { get; set; } = null!;

    public string? Description { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public bool IsCurrent { get; set; }

    public string? Location { get; set; }

    public string? Technologies { get; set; }

    public string? ContractType { get; set; }

    public virtual Collaborator Collaborator { get; set; } = null!;

    public virtual ICollection<PortfolioExperience> PortfolioExperiences { get; set; } = new List<PortfolioExperience>();
}
