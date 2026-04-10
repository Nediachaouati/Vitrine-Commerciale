using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Certification
{
    public int CertificationId { get; set; }

    public int PortfolioId { get; set; }

    public string Name { get; set; } = null!;

    public string Issuer { get; set; } = null!;

    public DateOnly IssueDate { get; set; }

    public DateOnly ExpiryDate { get; set; }

    public string CredentialUrl { get; set; } = null!;

    public string BadgeUrl { get; set; } = null!;

    public decimal Score { get; set; }

    public virtual Portfolio Portfolio { get; set; } = null!;
}
