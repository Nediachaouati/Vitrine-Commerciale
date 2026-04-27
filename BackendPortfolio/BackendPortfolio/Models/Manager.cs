using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Manager
{
    public int ManagerId { get; set; }

    public string? Department { get; set; }

    public int ManagedProfilesCount { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid UserId { get; set; }

    public virtual ICollection<ClientNeed> ClientNeeds { get; set; } = new List<ClientNeed>();

    public virtual User User { get; set; } = null!;
}
