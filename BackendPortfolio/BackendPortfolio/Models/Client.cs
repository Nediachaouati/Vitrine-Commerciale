using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Client
{
    public int ClientId { get; set; }

    public int CreatedByManagerId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string Industry { get; set; } = null!;

    public string ContactPhone { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public Guid UserId { get; set; }

    public virtual ICollection<ClientNeed> ClientNeeds { get; set; } = new List<ClientNeed>();
}
