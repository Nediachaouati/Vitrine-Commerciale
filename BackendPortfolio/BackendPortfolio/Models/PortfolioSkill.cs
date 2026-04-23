using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class PortfolioSkill
{
    public int PortfolioId { get; set; }

    public int CollabSkillId { get; set; }

    public bool IsVisible { get; set; }

    public int DisplayOrder { get; set; }

    public virtual CollaboratorSkill CollabSkill { get; set; } = null!;

    public virtual Portfolio Portfolio { get; set; } = null!;
}
