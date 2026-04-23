using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Certification
{
    public int CertificationId { get; set; }

    public int CollaboratorId { get; set; }

    public string Name { get; set; } = null!;

    public string Issuer { get; set; } = null!;

    public DateOnly IssueDate { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    public string? CredentialUrl { get; set; }

    public string? BadgeUrl { get; set; }

    public decimal? Score { get; set; }

    public virtual Collaborator Collaborator { get; set; } = null!;

    public virtual ICollection<PortfolioCertification> PortfolioCertifications { get; set; } = new List<PortfolioCertification>();
}
