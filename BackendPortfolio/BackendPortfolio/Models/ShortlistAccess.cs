using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class ShortlistAccess
{
    public int AccessId { get; set; }

    public int ShortlistId { get; set; }

    public Guid? ClientUserId { get; set; }

    public DateTime ViewedAt { get; set; }

    public string? IpAddress { get; set; }

    public virtual Shortlist Shortlist { get; set; } = null!;
}
