using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class MatchingResult
{
    public int ResultId { get; set; }

    public int NeedId { get; set; }

    public int CollaboratorId { get; set; }

    public decimal TotalScore { get; set; }

    public string? ScoreBreakdown { get; set; }

    public string? Badges { get; set; }

    public string? Suggestions { get; set; }

    public int? Rank { get; set; }

    public DateTime ComputedAt { get; set; }

    public string AiModelVersion { get; set; } = null!;

    public virtual Collaborator Collaborator { get; set; } = null!;

    public virtual ClientNeed Need { get; set; } = null!;
}
