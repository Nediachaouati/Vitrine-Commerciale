using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Client
{
    public int ClientId { get; set; }

    public int? CreatedByManagerId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string? Country { get; set; }

    public string? Industry { get; set; }

    public string? ContactPhone { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid UserId { get; set; }

    public virtual ICollection<ClientNeed> ClientNeeds { get; set; } = new List<ClientNeed>();

    public virtual ICollection<Shortlist> Shortlists { get; set; } = new List<Shortlist>();

    public virtual User User { get; set; } = null!;
}
