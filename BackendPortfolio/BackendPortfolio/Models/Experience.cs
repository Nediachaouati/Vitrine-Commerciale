using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Experience
{
    public int ExperienceId { get; set; }

    public int PortfolioId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string JobTitle { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public bool IsCurrent { get; set; }

    public string Location { get; set; } = null!;

    public string Technologies { get; set; } = null!;

    public virtual Portfolio Portfolio { get; set; } = null!;
}
