using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Portfolio
{
    public int PortfolioId { get; set; }

    public int CollaboratorId { get; set; }

    public string Title { get; set; } = null!;

    public string Summary { get; set; } = null!;

    public string VersionType { get; set; } = null!;

    public string Theme { get; set; } = null!;

    public string Language { get; set; } = null!;

    public bool IsActive { get; set; }

    public string PublicSlug { get; set; } = null!;

    public DateTime AiGeneratedAt { get; set; }

    public int ViewCount { get; set; }

    public virtual ICollection<Certification> Certifications { get; set; } = new List<Certification>();

    public virtual Collaborator Collaborator { get; set; } = null!;

    public virtual ICollection<Experience> Experiences { get; set; } = new List<Experience>();

    public virtual ICollection<PortfolioSwitch> PortfolioSwitchNewPortfolios { get; set; } = new List<PortfolioSwitch>();

    public virtual ICollection<PortfolioSwitch> PortfolioSwitchOriginalPortfolios { get; set; } = new List<PortfolioSwitch>();

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();

    public virtual ICollection<ShortlistItem> ShortlistItems { get; set; } = new List<ShortlistItem>();
}
