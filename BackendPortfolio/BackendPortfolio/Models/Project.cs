using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Project
{
    public int ProjectId { get; set; }

    public int CollaboratorId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? Technologies { get; set; }

    public string? ProjectUrl { get; set; }

    public string? GithubUrl { get; set; }

    public string? ScreenshotUrl { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? RoleInProject { get; set; }

    public virtual Collaborator Collaborator { get; set; } = null!;

    public virtual ICollection<PortfolioProject> PortfolioProjects { get; set; } = new List<PortfolioProject>();
}
