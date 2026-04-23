using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class PortfolioEducation
{
    public int PortfolioId { get; set; }

    public int EducationId { get; set; }

    public bool IsVisible { get; set; }

    public int DisplayOrder { get; set; }

    public virtual Education Education { get; set; } = null!;

    public virtual Portfolio Portfolio { get; set; } = null!;
}
