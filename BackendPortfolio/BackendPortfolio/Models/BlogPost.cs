using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class BlogPost
{
    public int PostId { get; set; }

    public int AuthorId { get; set; }

    public string Title { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public string Content { get; set; } = null!;

    public string? Excerpt { get; set; }

    public string? CoverImageUrl { get; set; }

    public string? Tags { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? PublishedAt { get; set; }

    public int ViewCount { get; set; }

    public Guid UserId { get; set; }

    public virtual User User { get; set; } = null!;
}
