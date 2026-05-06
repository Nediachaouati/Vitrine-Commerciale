using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Portfolio
{
    public int PortfolioId { get; set; }

    public int CollaboratorId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string Theme { get; set; } = null!;

    public string Language { get; set; } = null!;

    public bool IsActive { get; set; }

    public string PublicSlug { get; set; } = null!;

    public string? TargetClient { get; set; }

    public int ViewCount { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Collaborator Collaborator { get; set; } = null!;

    public virtual ICollection<ManagerPortfolioView> ManagerPortfolioViews { get; set; } = new List<ManagerPortfolioView>();

    public virtual ICollection<PortfolioCertification> PortfolioCertifications { get; set; } = new List<PortfolioCertification>();

    public virtual ICollection<PortfolioEducation> PortfolioEducations { get; set; } = new List<PortfolioEducation>();

    public virtual ICollection<PortfolioExperience> PortfolioExperiences { get; set; } = new List<PortfolioExperience>();

    public virtual ICollection<PortfolioProject> PortfolioProjects { get; set; } = new List<PortfolioProject>();

    public virtual ICollection<PortfolioSkill> PortfolioSkills { get; set; } = new List<PortfolioSkill>();

    public virtual ICollection<ShortlistItem> ShortlistItems { get; set; } = new List<ShortlistItem>();
}
