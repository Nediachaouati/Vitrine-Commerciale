using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Skill
{
    public int SkillId { get; set; }

    public string Name { get; set; } = null!;

    public string Category { get; set; } = null!;

    public string IconUrl { get; set; } = null!;

    public string Description { get; set; } = null!;

    public bool IsVerified { get; set; }
}
