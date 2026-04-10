using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class CollaboratorSkill
{
    public int CollaboratorId { get; set; }

    public int SkillId { get; set; }

    public string Level { get; set; } = null!;

    public int YearsUsed { get; set; }

    public bool IsPrimary { get; set; }

    public int EndorsedCount { get; set; }

    public virtual Collaborator Collaborator { get; set; } = null!;

    public virtual Skill Skill { get; set; } = null!;
}
