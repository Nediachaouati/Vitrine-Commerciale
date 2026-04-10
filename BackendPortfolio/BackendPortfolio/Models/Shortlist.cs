using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Shortlist
{
    public int ShortlistId { get; set; }

    public int ManagerId { get; set; }

    public int NeedId { get; set; }

    public int ClientId { get; set; }

    public string Title { get; set; } = null!;

    public string AccessToken { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? ViewedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Client Client { get; set; } = null!;

    public virtual Manager Manager { get; set; } = null!;

    public virtual ClientNeed Need { get; set; } = null!;
}
