using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Shortlist
{
    public int ShortlistId { get; set; }

    public int ManagerId { get; set; }

    public int? ClientId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string Status { get; set; } = null!;

    public string ShareToken { get; set; } = null!;

    public DateTime? ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Client? Client { get; set; }

    public virtual Manager Manager { get; set; } = null!;

    public virtual ICollection<ShortlistAccess> ShortlistAccesses { get; set; } = new List<ShortlistAccess>();

    public virtual ICollection<ShortlistItem> ShortlistItems { get; set; } = new List<ShortlistItem>();
}
