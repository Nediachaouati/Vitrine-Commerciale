using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class PortfolioExperience
{
    public int PortfolioId { get; set; }

    public int ExperienceId { get; set; }

    public bool IsVisible { get; set; }

    public int DisplayOrder { get; set; }

    public virtual Experience Experience { get; set; } = null!;

    public virtual Portfolio Portfolio { get; set; } = null!;
}
