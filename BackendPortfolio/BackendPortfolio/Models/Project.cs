using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Project
{
    public int ProjectId { get; set; }

    public int PortfolioId { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Technologies { get; set; } = null!;

    public string ProjectUrl { get; set; } = null!;

    public string ScreenshotUrl { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public bool IsFeatured { get; set; }

    public virtual Portfolio Portfolio { get; set; } = null!;
}
