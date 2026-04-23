using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class CollaboratorSkill
{
    public int CollabSkillId { get; set; }

    public int CollaboratorId { get; set; }

    public int SkillId { get; set; }

    public string Level { get; set; } = null!;

    public int YearsUsed { get; set; }

    public bool IsPrimary { get; set; }

    public virtual Collaborator Collaborator { get; set; } = null!;

    public virtual ICollection<PortfolioSkill> PortfolioSkills { get; set; } = new List<PortfolioSkill>();

    public virtual SkillCatalog Skill { get; set; } = null!;
}
