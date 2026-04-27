using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BackendPortfolio.Models;

public partial class VitrineDbContext : DbContext
{
    public VitrineDbContext()
    {
    }

    public VitrineDbContext(DbContextOptions<VitrineDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Certification> Certifications { get; set; }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<ClientNeed> ClientNeeds { get; set; }

    public virtual DbSet<Collaborator> Collaborators { get; set; }

    public virtual DbSet<CollaboratorSkill> CollaboratorSkills { get; set; }

    public virtual DbSet<Education> Educations { get; set; }

    public virtual DbSet<ExceptionDb> ExceptionDbs { get; set; }

    public virtual DbSet<Experience> Experiences { get; set; }

    public virtual DbSet<Manager> Managers { get; set; }

    public virtual DbSet<Portfolio> Portfolios { get; set; }

    public virtual DbSet<PortfolioCertification> PortfolioCertifications { get; set; }

    public virtual DbSet<PortfolioEducation> PortfolioEducations { get; set; }

    public virtual DbSet<PortfolioExperience> PortfolioExperiences { get; set; }

    public virtual DbSet<PortfolioProject> PortfolioProjects { get; set; }

    public virtual DbSet<PortfolioSkill> PortfolioSkills { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<SkillCatalog> SkillCatalogs { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.;Database=VitrineDB;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Certification>(entity =>
        {
            entity.Property(e => e.CertificationId).HasColumnName("certification_id");
            entity.Property(e => e.BadgeUrl)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("badge_url");
            entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
            entity.Property(e => e.CredentialUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("credential_url");
            entity.Property(e => e.ExpiryDate).HasColumnName("expiry_date");
            entity.Property(e => e.IssueDate).HasColumnName("issue_date");
            entity.Property(e => e.Issuer)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("issuer");
            entity.Property(e => e.Name)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Score)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("score");

            entity.HasOne(d => d.Collaborator).WithMany(p => p.Certifications)
                .HasForeignKey(d => d.CollaboratorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Certifications_Collaborators");
        });

        modelBuilder.Entity<Client>(entity =>
        {
            entity.Property(e => e.ClientId).HasColumnName("client_id");
            entity.Property(e => e.CompanyName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("company_name");
            entity.Property(e => e.ContactPhone)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("contact_phone");
            entity.Property(e => e.Country)
                .HasMaxLength(80)
                .IsUnicode(false)
                .HasColumnName("country");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedByManagerId).HasColumnName("created_by_manager_id");
            entity.Property(e => e.Industry)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("industry");
            entity.Property(e => e.UserId).HasColumnName("user_id");
        });

        modelBuilder.Entity<ClientNeed>(entity =>
        {
            entity.HasKey(e => e.NeedId);

            entity.Property(e => e.NeedId).HasColumnName("need_id");
            entity.Property(e => e.AvailabilityRequired)
                .HasMaxLength(50)
                .HasColumnName("availability_required");
            entity.Property(e => e.BudgetRange)
                .HasMaxLength(100)
                .HasColumnName("budget_range");
            entity.Property(e => e.ClientId).HasColumnName("client_id");
            entity.Property(e => e.ContractType)
                .HasMaxLength(50)
                .HasColumnName("contract_type");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.LocationPreference)
                .HasMaxLength(200)
                .HasColumnName("location_preference");
            entity.Property(e => e.ManagerId).HasColumnName("manager_id");
            entity.Property(e => e.MinExperienceYears).HasColumnName("min_experience_years");
            entity.Property(e => e.PreferredSkills).HasColumnName("preferred_skills");
            entity.Property(e => e.RequiredCertificationsJson).HasColumnName("required_certifications_json");
            entity.Property(e => e.RequiredSkills).HasColumnName("required_skills");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("active")
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasDefaultValue("")
                .HasColumnName("title");

            entity.HasOne(d => d.Client).WithMany(p => p.ClientNeeds)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK_ClientNeeds_Clients");

            entity.HasOne(d => d.Manager).WithMany(p => p.ClientNeeds)
                .HasForeignKey(d => d.ManagerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClientNeeds_Managers");
        });

        modelBuilder.Entity<Collaborator>(entity =>
        {
            entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
            entity.Property(e => e.AvailabilityDate).HasColumnName("availability_date");
            entity.Property(e => e.AvailabilityStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("available")
                .HasColumnName("availability_status");
            entity.Property(e => e.Bio).HasColumnName("bio");
            entity.Property(e => e.City)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("city");
            entity.Property(e => e.ContractType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("contract_type");
            entity.Property(e => e.Country)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("country");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnName("created_at");
            entity.Property(e => e.GithubUrl)
                .HasMaxLength(255)
                .HasColumnName("github_url");
            entity.Property(e => e.IsPublic).HasColumnName("is_public");
            entity.Property(e => e.JobTitle)
                .HasMaxLength(120)
                .IsUnicode(false)
                .HasDefaultValue("")
                .HasColumnName("job_title");
            entity.Property(e => e.LinkedinUrl)
                .HasMaxLength(255)
                .HasColumnName("linkedin_url");
            entity.Property(e => e.Phone)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.RemotePreference)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("remote_preference");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.YearsExperience).HasColumnName("years_experience");

            entity.HasOne(d => d.User).WithMany(p => p.Collaborators)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Collaborators_Users");
        });

        modelBuilder.Entity<CollaboratorSkill>(entity =>
        {
            entity.HasKey(e => e.CollabSkillId);

            entity.HasIndex(e => new { e.CollaboratorId, e.SkillId }, "UQ_CollaboratorSkills").IsUnique();

            entity.Property(e => e.CollabSkillId).HasColumnName("collab_skill_id");
            entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
            entity.Property(e => e.IsPrimary).HasColumnName("is_primary");
            entity.Property(e => e.Level)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("level");
            entity.Property(e => e.SkillId).HasColumnName("skill_id");
            entity.Property(e => e.YearsUsed).HasColumnName("years_used");

            entity.HasOne(d => d.Collaborator).WithMany(p => p.CollaboratorSkills)
                .HasForeignKey(d => d.CollaboratorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CollaboratorSkills_Collaborators");

            entity.HasOne(d => d.Skill).WithMany(p => p.CollaboratorSkills)
                .HasForeignKey(d => d.SkillId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CollaboratorSkills_SkillCatalog");
        });

        modelBuilder.Entity<Education>(entity =>
        {
            entity.ToTable("Education");

            entity.Property(e => e.EducationId).HasColumnName("education_id");
            entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
            entity.Property(e => e.Degree)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("degree");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.Field)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("field");
            entity.Property(e => e.Grade)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("grade");
            entity.Property(e => e.IsCurrent).HasColumnName("is_current");
            entity.Property(e => e.School)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("school");
            entity.Property(e => e.StartDate).HasColumnName("start_date");

            entity.HasOne(d => d.Collaborator).WithMany(p => p.Educations)
                .HasForeignKey(d => d.CollaboratorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Education_Collaborators");
        });

        modelBuilder.Entity<ExceptionDb>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Exceptio__3214EC07BB496CF9");

            entity.ToTable("ExceptionDb");

            entity.Property(e => e.CreateDate).HasColumnType("datetime");
            entity.Property(e => e.FunctionName).HasMaxLength(200);
            entity.Property(e => e.Hresult).HasMaxLength(50);
            entity.Property(e => e.Repository).HasMaxLength(200);
        });

        modelBuilder.Entity<Experience>(entity =>
        {
            entity.Property(e => e.ExperienceId).HasColumnName("experience_id");
            entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
            entity.Property(e => e.CompanyName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("company_name");
            entity.Property(e => e.ContractType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("contract_type");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.IsCurrent).HasColumnName("is_current");
            entity.Property(e => e.JobTitle)
                .HasMaxLength(120)
                .IsUnicode(false)
                .HasColumnName("job_title");
            entity.Property(e => e.Location)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("location");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Technologies)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("technologies");

            entity.HasOne(d => d.Collaborator).WithMany(p => p.Experiences)
                .HasForeignKey(d => d.CollaboratorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Experiences_Collaborators");
        });

        modelBuilder.Entity<Manager>(entity =>
        {
            entity.Property(e => e.ManagerId).HasColumnName("manager_id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Department)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("department");
            entity.Property(e => e.ManagedProfilesCount).HasColumnName("managed_profiles_count");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Managers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Managers_Users");
        });

        modelBuilder.Entity<Portfolio>(entity =>
        {
            entity.HasIndex(e => e.PublicSlug, "UQ_Portfolios_Slug").IsUnique();

            entity.Property(e => e.PortfolioId).HasColumnName("portfolio_id");
            entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.Language)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("fr")
                .HasColumnName("language");
            entity.Property(e => e.PublicSlug)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("public_slug");
            entity.Property(e => e.TargetClient)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("target_client");
            entity.Property(e => e.Theme)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("dark")
                .HasColumnName("theme");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("title");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnName("updated_at");
            entity.Property(e => e.ViewCount).HasColumnName("view_count");

            entity.HasOne(d => d.Collaborator).WithMany(p => p.Portfolios)
                .HasForeignKey(d => d.CollaboratorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Portfolios_Collaborators");
        });

        modelBuilder.Entity<PortfolioCertification>(entity =>
        {
            entity.HasKey(e => new { e.PortfolioId, e.CertificationId });

            entity.Property(e => e.PortfolioId).HasColumnName("portfolio_id");
            entity.Property(e => e.CertificationId).HasColumnName("certification_id");
            entity.Property(e => e.DisplayOrder).HasColumnName("display_order");
            entity.Property(e => e.IsVisible).HasColumnName("is_visible");

            entity.HasOne(d => d.Certification).WithMany(p => p.PortfolioCertifications)
                .HasForeignKey(d => d.CertificationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioCertifications_Certifications");

            entity.HasOne(d => d.Portfolio).WithMany(p => p.PortfolioCertifications)
                .HasForeignKey(d => d.PortfolioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioCertifications_Portfolios");
        });

        modelBuilder.Entity<PortfolioEducation>(entity =>
        {
            entity.HasKey(e => new { e.PortfolioId, e.EducationId });

            entity.ToTable("PortfolioEducation");

            entity.Property(e => e.PortfolioId).HasColumnName("portfolio_id");
            entity.Property(e => e.EducationId).HasColumnName("education_id");
            entity.Property(e => e.DisplayOrder).HasColumnName("display_order");
            entity.Property(e => e.IsVisible).HasColumnName("is_visible");

            entity.HasOne(d => d.Education).WithMany(p => p.PortfolioEducations)
                .HasForeignKey(d => d.EducationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioEducation_Education");

            entity.HasOne(d => d.Portfolio).WithMany(p => p.PortfolioEducations)
                .HasForeignKey(d => d.PortfolioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioEducation_Portfolios");
        });

        modelBuilder.Entity<PortfolioExperience>(entity =>
        {
            entity.HasKey(e => new { e.PortfolioId, e.ExperienceId });

            entity.Property(e => e.PortfolioId).HasColumnName("portfolio_id");
            entity.Property(e => e.ExperienceId).HasColumnName("experience_id");
            entity.Property(e => e.DisplayOrder).HasColumnName("display_order");
            entity.Property(e => e.IsVisible).HasColumnName("is_visible");

            entity.HasOne(d => d.Experience).WithMany(p => p.PortfolioExperiences)
                .HasForeignKey(d => d.ExperienceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioExperiences_Experiences");

            entity.HasOne(d => d.Portfolio).WithMany(p => p.PortfolioExperiences)
                .HasForeignKey(d => d.PortfolioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioExperiences_Portfolios");
        });

        modelBuilder.Entity<PortfolioProject>(entity =>
        {
            entity.HasKey(e => new { e.PortfolioId, e.ProjectId });

            entity.Property(e => e.PortfolioId).HasColumnName("portfolio_id");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.DisplayOrder).HasColumnName("display_order");
            entity.Property(e => e.IsVisible).HasColumnName("is_visible");

            entity.HasOne(d => d.Portfolio).WithMany(p => p.PortfolioProjects)
                .HasForeignKey(d => d.PortfolioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioProjects_Portfolios");

            entity.HasOne(d => d.Project).WithMany(p => p.PortfolioProjects)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioProjects_Projects");
        });

        modelBuilder.Entity<PortfolioSkill>(entity =>
        {
            entity.HasKey(e => new { e.PortfolioId, e.CollabSkillId });

            entity.Property(e => e.PortfolioId).HasColumnName("portfolio_id");
            entity.Property(e => e.CollabSkillId).HasColumnName("collab_skill_id");
            entity.Property(e => e.DisplayOrder).HasColumnName("display_order");
            entity.Property(e => e.IsVisible).HasColumnName("is_visible");

            entity.HasOne(d => d.CollabSkill).WithMany(p => p.PortfolioSkills)
                .HasForeignKey(d => d.CollabSkillId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioSkills_CollaboratorSkills");

            entity.HasOne(d => d.Portfolio).WithMany(p => p.PortfolioSkills)
                .HasForeignKey(d => d.PortfolioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioSkills_Portfolios");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.GithubUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("github_url");
            entity.Property(e => e.ProjectUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("project_url");
            entity.Property(e => e.RoleInProject)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("role_in_project");
            entity.Property(e => e.ScreenshotUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("screenshot_url");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Technologies)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("technologies");
            entity.Property(e => e.Title)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("title");

            entity.HasOne(d => d.Collaborator).WithMany(p => p.Projects)
                .HasForeignKey(d => d.CollaboratorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Projects_Collaborators");
        });

        modelBuilder.Entity<SkillCatalog>(entity =>
        {
            entity.HasKey(e => e.SkillId);

            entity.ToTable("SkillCatalog");

            entity.HasIndex(e => e.Name, "UQ_SkillCatalog_Name").IsUnique();

            entity.Property(e => e.SkillId).HasColumnName("skill_id");
            entity.Property(e => e.Category)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("category");
            entity.Property(e => e.IconUrl)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("icon_url");
            entity.Property(e => e.Name)
                .HasMaxLength(80)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email, "UQ_Users_Email").IsUnique();

            entity.HasIndex(e => e.KeycloakId, "UQ_Users_KeycloakId").IsUnique();

            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("user_id");
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("avatar_url");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnName("created_at");
            entity.Property(e => e.DeletedAt).HasColumnName("deleted_at");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(80)
                .IsUnicode(false)
                .HasColumnName("first_name");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.KeycloakId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("keycloak_id");
            entity.Property(e => e.LastLogin)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnName("last_login");
            entity.Property(e => e.LastName)
                .HasMaxLength(80)
                .IsUnicode(false)
                .HasColumnName("last_name");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("COLLABORATEUR")
                .HasColumnName("role");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnName("updated_at");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
