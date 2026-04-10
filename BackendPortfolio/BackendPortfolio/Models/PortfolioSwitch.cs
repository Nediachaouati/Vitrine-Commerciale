using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class PortfolioSwitch
{
    public int SwitchId { get; set; }

    public int SessionId { get; set; }

    public int OriginalPortfolioId { get; set; }

    public int NewPortfolioId { get; set; }

    public int ManagerId { get; set; }

    public string? ClientNeedDescription { get; set; }

    public string? FocusTheme { get; set; }

    public decimal? ScoreImprovement { get; set; }

    public DateTime SwitchedAt { get; set; }

    public virtual Manager Manager { get; set; } = null!;

    public virtual Portfolio NewPortfolio { get; set; } = null!;

    public virtual Portfolio OriginalPortfolio { get; set; } = null!;

    public virtual AiChatSession Session { get; set; } = null!;
}
