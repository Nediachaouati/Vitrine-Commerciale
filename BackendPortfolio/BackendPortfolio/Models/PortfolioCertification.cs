using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class PortfolioCertification
{
    public int PortfolioId { get; set; }

    public int CertificationId { get; set; }

    public bool IsVisible { get; set; }

    public int DisplayOrder { get; set; }

    public virtual Certification Certification { get; set; } = null!;

    public virtual Portfolio Portfolio { get; set; } = null!;
}
