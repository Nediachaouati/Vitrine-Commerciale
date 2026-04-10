using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class CompanyAchievement
{
    public int AchievementId { get; set; }

    public int CreatedBy { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? ClientCompany { get; set; }

    public string? Technologies { get; set; }

    public string? CoverImageUrl { get; set; }

    public DateOnly? ProjectDate { get; set; }

    public string? Category { get; set; }

    public bool IsFeatured { get; set; }

    public bool IsPublic { get; set; }

    public Guid UserId { get; set; }

    public virtual User User { get; set; } = null!;
}
