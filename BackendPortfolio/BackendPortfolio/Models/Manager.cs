using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Manager
{
    public int ManagerId { get; set; }

    public string? Department { get; set; }

    public int ManagedProfilesCount { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid UserId { get; set; }

    public virtual ICollection<ClientNeed> ClientNeeds { get; set; } = new List<ClientNeed>();

    public virtual ICollection<ManagerPortfolioView> ManagerPortfolioViews { get; set; } = new List<ManagerPortfolioView>();

    public virtual ICollection<Realisation> Realisations { get; set; } = new List<Realisation>();

    public virtual ICollection<Shortlist> Shortlists { get; set; } = new List<Shortlist>();

    public virtual User User { get; set; } = null!;
}
