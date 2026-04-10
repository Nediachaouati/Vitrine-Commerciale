using System;
using System.Collections.Generic;

namespace BackendPortfolio.Models;

public partial class User
{
    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? AvatarUrl { get; set; }

    public bool IsActive { get; set; }

    public DateTime? LastLogin { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Guid KeycloakId { get; set; }

    public Guid UserId { get; set; }

    public string Role { get; set; } = null!;

    public virtual ICollection<AiChatSession> AiChatSessions { get; set; } = new List<AiChatSession>();

    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

    public virtual ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();

    public virtual ICollection<Client> Clients { get; set; } = new List<Client>();

    public virtual ICollection<Collaborator> Collaborators { get; set; } = new List<Collaborator>();

    public virtual ICollection<CompanyAchievement> CompanyAchievements { get; set; } = new List<CompanyAchievement>();

    public virtual ICollection<Manager> Managers { get; set; } = new List<Manager>();
}
