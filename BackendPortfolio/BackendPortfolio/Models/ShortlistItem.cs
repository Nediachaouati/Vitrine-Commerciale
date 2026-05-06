using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class ShortlistItem
{
    public int ItemId { get; set; }

    public int ShortlistId { get; set; }

    public int PortfolioId { get; set; }

    public int? SwitchedViewId { get; set; }

    public int DisplayOrder { get; set; }

    public string? ManagerNote { get; set; }

    public DateTime AddedAt { get; set; }

    public virtual Portfolio Portfolio { get; set; } = null!;

    public virtual Shortlist Shortlist { get; set; } = null!;

    public virtual ManagerPortfolioView? SwitchedView { get; set; }
}
