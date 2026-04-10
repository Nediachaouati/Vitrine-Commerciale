using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Testimonial
{
    public int TestimonialId { get; set; }

    public int ClientId { get; set; }

    public int CollaboratorId { get; set; }

    public int ValidatedByManagerId { get; set; }

    public string Content { get; set; } = null!;

    public int Rating { get; set; }

    public string Status { get; set; } = null!;

    public bool IsPublic { get; set; }

    public bool ShowOnPortfolio { get; set; }

    public DateTime? ValidatedAt { get; set; }

    public virtual Client Client { get; set; } = null!;

    public virtual Collaborator Collaborator { get; set; } = null!;

    public virtual Manager ValidatedByManager { get; set; } = null!;
}
