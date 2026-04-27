using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class ClientNeed
{
    public int NeedId { get; set; }

    public int ManagerId { get; set; }

    public int? ClientId { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string RequiredSkills { get; set; } = null!;

    public string? PreferredSkills { get; set; }

    public int? MinExperienceYears { get; set; }

    public string? LocationPreference { get; set; }

    public string? BudgetRange { get; set; }

    public string? AvailabilityRequired { get; set; }

    public string? RequiredCertificationsJson { get; set; }

    public string? ContractType { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Client? Client { get; set; }

    public virtual Manager Manager { get; set; } = null!;
}
