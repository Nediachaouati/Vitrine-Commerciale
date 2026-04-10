using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Collaborator
{
    public int CollaboratorId { get; set; }

    public string JobTitle { get; set; } = null!;

    public string Bio { get; set; } = null!;

    public int YearsExperience { get; set; }

    public string AvailabilityStatus { get; set; } = null!;

    public DateOnly? AvailabilityDate { get; set; }

    public decimal GlobalScore { get; set; }

    public string? LinkedinUrl { get; set; }

    public string? GithubUrl { get; set; }

    public bool IsPublic { get; set; }

    public Guid UserId { get; set; }

    public virtual ICollection<MatchingResult> MatchingResults { get; set; } = new List<MatchingResult>();

    public virtual ICollection<Portfolio> Portfolios { get; set; } = new List<Portfolio>();

    public virtual ICollection<ShortlistItem> ShortlistItems { get; set; } = new List<ShortlistItem>();

    public virtual ICollection<Testimonial> Testimonials { get; set; } = new List<Testimonial>();

    public virtual User User { get; set; } = null!;
}
