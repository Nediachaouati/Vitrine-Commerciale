using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class ManagerPortfolioView
{
    public int ViewId { get; set; }

    public int PortfolioId { get; set; }

    public int ManagerId { get; set; }

    public string TargetTech { get; set; } = null!;

    public string? GeneratedTitle { get; set; }

    public string? GeneratedBio { get; set; }

    public string? TransferableSkillsJson { get; set; }

    public string? MissionContext { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public string? SelectedProjectIdsJson { get; set; }

    public string? SelectedSkillIdsJson { get; set; }

    public string? SelectedExperienceIdsJson { get; set; }

    public string? SelectedCertificationIdsJson { get; set; }

    public double? RelevanceScore { get; set; }

    public string? PublicShareSlug { get; set; }

    public virtual Manager Manager { get; set; } = null!;

    public virtual Portfolio Portfolio { get; set; } = null!;

    public virtual ICollection<ShortlistItem> ShortlistItems { get; set; } = new List<ShortlistItem>();
}
