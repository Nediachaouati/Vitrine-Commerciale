using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class ShortlistItem
{
    public int ShortlistId { get; set; }

    public int CollaboratorId { get; set; }

    public int PortfolioId { get; set; }

    public decimal? MatchingScore { get; set; }

    public int Position { get; set; }

    public string? ClientFeedback { get; set; }

    public bool IsSelected { get; set; }

    public virtual Collaborator Collaborator { get; set; } = null!;

    public virtual Portfolio Portfolio { get; set; } = null!;
}
