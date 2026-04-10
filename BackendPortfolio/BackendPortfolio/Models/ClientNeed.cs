using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class ClientNeed
{
    public int NeedId { get; set; }

    public int ManagerId { get; set; }

    public int ClientId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? RequiredSkills { get; set; }

    public int MinExperienceYears { get; set; }

    public string? LocationPreference { get; set; }

    public string? BudgetRange { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Client Client { get; set; } = null!;

    public virtual Manager Manager { get; set; } = null!;

    public virtual ICollection<MatchingResult> MatchingResults { get; set; } = new List<MatchingResult>();

    public virtual ICollection<Shortlist> Shortlists { get; set; } = new List<Shortlist>();
}
