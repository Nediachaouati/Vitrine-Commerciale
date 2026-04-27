using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Realisation
{
    public int RealisationId { get; set; }

    public int ManagerId { get; set; }

    public int? CollaboratorId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? ClientName { get; set; }

    public string? SiteUrl { get; set; }

    public string? ScreenshotUrl { get; set; }

    public string? TechnologiesJson { get; set; }

    public string? Category { get; set; }

    public DateOnly? DeliveredAt { get; set; }

    public bool IsPublic { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Collaborator? Collaborator { get; set; }

    public virtual Manager Manager { get; set; } = null!;
}
