using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class Client
{
    public int ClientId { get; set; }

    public int CreatedByManagerId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string Industry { get; set; } = null!;

    public string ContactPhone { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public Guid UserId { get; set; }

    public virtual ICollection<ClientNeed> ClientNeeds { get; set; } = new List<ClientNeed>();

    public virtual Manager CreatedByManager { get; set; } = null!;

    public virtual ICollection<Shortlist> Shortlists { get; set; } = new List<Shortlist>();

    public virtual ICollection<Testimonial> Testimonials { get; set; } = new List<Testimonial>();

    public virtual User User { get; set; } = null!;
}
