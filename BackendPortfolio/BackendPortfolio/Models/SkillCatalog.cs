using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class SkillCatalog
{
    public int SkillId { get; set; }

    public string Name { get; set; } = null!;

    public string Category { get; set; } = null!;

    public string? IconUrl { get; set; }

    public virtual ICollection<CollaboratorSkill> CollaboratorSkills { get; set; } = new List<CollaboratorSkill>();
}
