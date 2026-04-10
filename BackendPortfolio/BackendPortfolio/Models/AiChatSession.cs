using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class AiChatSession
{
    public int SessionId { get; set; }

    public string SessionType { get; set; } = null!;

    public string? Messages { get; set; }

    public string? ExtractedData { get; set; }

    public string Status { get; set; } = null!;

    public string? AiModel { get; set; }

    public DateTime StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public int TokensUsed { get; set; }

    public Guid UserId { get; set; }

    public virtual ICollection<PortfolioSwitch> PortfolioSwitches { get; set; } = new List<PortfolioSwitch>();

    public virtual User User { get; set; } = null!;
}
