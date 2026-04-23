using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Education
{
    public int EducationId { get; set; }

    public int CollaboratorId { get; set; }

    public string School { get; set; } = null!;

    public string Degree { get; set; } = null!;

    public string Field { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public bool IsCurrent { get; set; }

    public string? Grade { get; set; }

    public string? Description { get; set; }

    public virtual Collaborator Collaborator { get; set; } = null!;

    public virtual ICollection<PortfolioEducation> PortfolioEducations { get; set; } = new List<PortfolioEducation>();
}
