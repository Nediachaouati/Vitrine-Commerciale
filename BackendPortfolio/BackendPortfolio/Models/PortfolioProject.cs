using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class PortfolioProject
{
    public int PortfolioId { get; set; }

    public int ProjectId { get; set; }

    public bool IsVisible { get; set; }

    public int DisplayOrder { get; set; }

    public virtual Portfolio Portfolio { get; set; } = null!;

    public virtual Project Project { get; set; } = null!;
}
