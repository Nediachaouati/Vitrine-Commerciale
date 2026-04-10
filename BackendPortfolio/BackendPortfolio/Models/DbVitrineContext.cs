using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BackendPortfolio.Models;

public partial class DbVitrineContext : DbContext
{
    public DbVitrineContext()
    {
    }

    public DbVitrineContext(DbContextOptions<DbVitrineContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AiChatSession> AiChatSessions { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<BlogPost> BlogPosts { get; set; }

    public virtual DbSet<Certification> Certifications { get; set; }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<ClientNeed> ClientNeeds { get; set; }

    public virtual DbSet<Collaborator> Collaborators { get; set; }

    public virtual DbSet<CollaboratorSkill> CollaboratorSkills { get; set; }

    public virtual DbSet<CompanyAchievement> CompanyAchievements { get; set; }

    public virtual DbSet<ExceptionDb> ExceptionDbs { get; set; }

    public virtual DbSet<Experience> Experiences { get; set; }

    public virtual DbSet<Manager> Managers { get; set; }

    public virtual DbSet<MatchingResult> MatchingResults { get; set; }

    public virtual DbSet<Portfolio> Portfolios { get; set; }

    public virtual DbSet<PortfolioSwitch> PortfolioSwitches { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<Shortlist> Shortlists { get; set; }

    public virtual DbSet<ShortlistItem> ShortlistItems { get; set; }

    public virtual DbSet<Skill> Skills { get; set; }

    public virtual DbSet<Testimonial> Testimonials { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.;Database=DbVitrine;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AiChatSession>(entity =>
        {
            entity.HasKey(e => e.SessionId);

            entity.Property(e => e.SessionId).HasColumnName("session_id");
            entity.Property(e => e.AiModel)
                .HasMaxLength(80)
                .IsUnicode(false)
                .HasColumnName("ai_model");
            entity.Property(e => e.CompletedAt)
                .HasColumnType("datetime")
                .HasColumnName("completed_at");
            entity.Property(e => e.ExtractedData)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("extracted_data");
            entity.Property(e => e.Messages)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("messages");
            entity.Property(e => e.SessionType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("session_type");
            entity.Property(e => e.StartedAt)
                .HasColumnType("datetime")
                .HasColumnName("started_at");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.TokensUsed).HasColumnName("tokens_used");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.AiChatSessions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AiChatSessions_Users");
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.LogId);

            entity.Property(e => e.LogId).HasColumnName("log_id");
            entity.Property(e => e.Action)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("action");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.EntityId).HasColumnName("entity_id");
            entity.Property(e => e.EntityType)
                .HasMaxLength(80)
                .IsUnicode(false)
                .HasColumnName("entity_type");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.NewValue)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("new_value");
            entity.Property(e => e.OldValue)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("old_value");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.AuditLogs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AuditLogs_Users");
        });

        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasKey(e => e.PostId);

            entity.Property(e => e.PostId).HasColumnName("post_id");
            entity.Property(e => e.AuthorId).HasColumnName("author_id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CoverImageUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("cover_image_url");
            entity.Property(e => e.Excerpt)
                .HasColumnType("text")
                .HasColumnName("excerpt");
            entity.Property(e => e.PublishedAt)
                .HasColumnType("datetime")
                .HasColumnName("published_at");
            entity.Property(e => e.Slug)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("slug");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.Tags)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("tags");
            entity.Property(e => e.Title)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("title");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.ViewCount).HasColumnName("view_count");

            entity.HasOne(d => d.User).WithMany(p => p.BlogPosts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BlogPosts_Users");
        });

        modelBuilder.Entity<Certification>(entity =>
        {
            entity.Property(e => e.CertificationId).HasColumnName("certification_id");
            entity.Property(e => e.BadgeUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("badge_url");
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
            entity.Property(e => e.PortfolioId).HasColumnName("portfolio_id");
            entity.Property(e => e.Score)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("score");

            entity.HasOne(d => d.Portfolio).WithMany(p => p.Certifications)
                .HasForeignKey(d => d.PortfolioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Certifications_Portfolios");
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

            entity.HasOne(d => d.CreatedByManager).WithMany(p => p.Clients)
                .HasForeignKey(d => d.CreatedByManagerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Clients_Managers");

            entity.HasOne(d => d.User).WithMany(p => p.Clients)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Clients_Users");
        });

        modelBuilder.Entity<ClientNeed>(entity =>
        {
            entity.HasKey(e => e.NeedId);

            entity.Property(e => e.NeedId)
                .ValueGeneratedNever()
                .HasColumnName("need_id");
            entity.Property(e => e.BudgetRange)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("budget_range");
            entity.Property(e => e.ClientId).HasColumnName("client_id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.LocationPreference)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("location_preference");
            entity.Property(e => e.ManagerId).HasColumnName("manager_id");
            entity.Property(e => e.MinExperienceYears).HasColumnName("min_experience_years");
            entity.Property(e => e.RequiredSkills)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("required_skills");
            entity.Property(e => e.Status)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("title");

            entity.HasOne(d => d.Client).WithMany(p => p.ClientNeeds)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
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
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("availability_status");
            entity.Property(e => e.Bio)
                .HasColumnType("text")
                .HasColumnName("bio");
            entity.Property(e => e.GithubUrl)
                .HasMaxLength(255)
                .HasColumnName("github_url");
            entity.Property(e => e.GlobalScore)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("global_score");
            entity.Property(e => e.IsPublic).HasColumnName("is_public");
            entity.Property(e => e.JobTitle)
                .HasMaxLength(120)
                .IsUnicode(false)
                .HasColumnName("job_title");
            entity.Property(e => e.LinkedinUrl)
                .HasMaxLength(255)
                .HasColumnName("linkedin_url");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("user_id");
            entity.Property(e => e.YearsExperience).HasColumnName("years_experience");

            entity.HasOne(d => d.User).WithMany(p => p.Collaborators)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Collaborators_Users");
        });

        modelBuilder.Entity<CollaboratorSkill>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
            entity.Property(e => e.EndorsedCount).HasColumnName("endorsed_count");
            entity.Property(e => e.IsPrimary).HasColumnName("is_primary");
            entity.Property(e => e.Level)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("level");
            entity.Property(e => e.SkillId).HasColumnName("skill_id");
            entity.Property(e => e.YearsUsed).HasColumnName("years_used");

            entity.HasOne(d => d.Collaborator).WithMany()
                .HasForeignKey(d => d.CollaboratorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CollaboratorSkills_Collaborators");

            entity.HasOne(d => d.Skill).WithMany()
                .HasForeignKey(d => d.SkillId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CollaboratorSkills_Skills");
        });

        modelBuilder.Entity<CompanyAchievement>(entity =>
        {
            entity.HasKey(e => e.AchievementId);

            entity.Property(e => e.AchievementId).HasColumnName("achievement_id");
            entity.Property(e => e.Category)
                .HasMaxLength(80)
                .IsUnicode(false)
                .HasColumnName("category");
            entity.Property(e => e.ClientCompany)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("client_company");
            entity.Property(e => e.CoverImageUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("cover_image_url");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.IsFeatured).HasColumnName("is_featured");
            entity.Property(e => e.IsPublic).HasColumnName("is_public");
            entity.Property(e => e.ProjectDate).HasColumnName("project_date");
            entity.Property(e => e.Technologies)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("technologies");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("title");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.CompanyAchievements)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CompanyAchievements_Users");
        });

        modelBuilder.Entity<ExceptionDb>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Exceptio__3214EC07D94F75D0");

            entity.ToTable("ExceptionDb");

            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FunctionName).HasMaxLength(200);
            entity.Property(e => e.Hresult).HasMaxLength(50);
            entity.Property(e => e.Repository).HasMaxLength(200);
        });

        modelBuilder.Entity<Experience>(entity =>
        {
            entity.Property(e => e.ExperienceId).HasColumnName("experience_id");
            entity.Property(e => e.CompanyName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("company_name");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
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
            entity.Property(e => e.PortfolioId).HasColumnName("portfolio_id");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Technologies)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("technologies");

            entity.HasOne(d => d.Portfolio).WithMany(p => p.Experiences)
                .HasForeignKey(d => d.PortfolioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Experiences_Portfolios");
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
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Managers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Managers_Users");
        });

        modelBuilder.Entity<MatchingResult>(entity =>
        {
            entity.HasKey(e => e.ResultId);

            entity.Property(e => e.ResultId).HasColumnName("result_id");
            entity.Property(e => e.AiModelVersion)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ai_model_version");
            entity.Property(e => e.Badges)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("badges");
            entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
            entity.Property(e => e.ComputedAt)
                .HasColumnType("datetime")
                .HasColumnName("computed_at");
            entity.Property(e => e.NeedId).HasColumnName("need_id");
            entity.Property(e => e.Rank).HasColumnName("rank");
            entity.Property(e => e.ScoreBreakdown)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("score_breakdown");
            entity.Property(e => e.Suggestions)
                .HasColumnType("text")
                .HasColumnName("suggestions");
            entity.Property(e => e.TotalScore)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("total_score");

            entity.HasOne(d => d.Collaborator).WithMany(p => p.MatchingResults)
                .HasForeignKey(d => d.CollaboratorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MatchingResults_Collaborators");

            entity.HasOne(d => d.Need).WithMany(p => p.MatchingResults)
                .HasForeignKey(d => d.NeedId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MatchingResults_ClientNeeds");
        });

        modelBuilder.Entity<Portfolio>(entity =>
        {
            entity.Property(e => e.PortfolioId).HasColumnName("portfolio_id");
            entity.Property(e => e.AiGeneratedAt)
                .HasColumnType("datetime")
                .HasColumnName("ai_generated_at");
            entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.Language)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("language");
            entity.Property(e => e.PublicSlug)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("public_slug");
            entity.Property(e => e.Summary)
                .HasColumnType("text")
                .HasColumnName("summary");
            entity.Property(e => e.Theme)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("theme");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("title");
            entity.Property(e => e.VersionType)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("version_type");
            entity.Property(e => e.ViewCount).HasColumnName("view_count");

            entity.HasOne(d => d.Collaborator).WithMany(p => p.Portfolios)
                .HasForeignKey(d => d.CollaboratorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Portfolios_Collaborators");
        });

        modelBuilder.Entity<PortfolioSwitch>(entity =>
        {
            entity.HasKey(e => e.SwitchId);

            entity.Property(e => e.SwitchId).HasColumnName("switch_id");
            entity.Property(e => e.ClientNeedDescription)
                .HasColumnType("text")
                .HasColumnName("client_need_description");
            entity.Property(e => e.FocusTheme)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("focus_theme");
            entity.Property(e => e.ManagerId).HasColumnName("manager_id");
            entity.Property(e => e.NewPortfolioId).HasColumnName("new_portfolio_id");
            entity.Property(e => e.OriginalPortfolioId).HasColumnName("original_portfolio_id");
            entity.Property(e => e.ScoreImprovement)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("score_improvement");
            entity.Property(e => e.SessionId).HasColumnName("session_id");
            entity.Property(e => e.SwitchedAt)
                .HasColumnType("datetime")
                .HasColumnName("switched_at");

            entity.HasOne(d => d.Manager).WithMany(p => p.PortfolioSwitches)
                .HasForeignKey(d => d.ManagerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioSwitches_Managers");

            entity.HasOne(d => d.NewPortfolio).WithMany(p => p.PortfolioSwitchNewPortfolios)
                .HasForeignKey(d => d.NewPortfolioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioSwitches_Portfolios1");

            entity.HasOne(d => d.OriginalPortfolio).WithMany(p => p.PortfolioSwitchOriginalPortfolios)
                .HasForeignKey(d => d.OriginalPortfolioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioSwitches_Portfolios");

            entity.HasOne(d => d.Session).WithMany(p => p.PortfolioSwitches)
                .HasForeignKey(d => d.SessionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PortfolioSwitches_AiChatSessions");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.IsFeatured).HasColumnName("is_featured");
            entity.Property(e => e.PortfolioId).HasColumnName("portfolio_id");
            entity.Property(e => e.ProjectUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("project_url");
            entity.Property(e => e.ScreenshotUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("screenshot_url");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Technologies)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("technologies");
            entity.Property(e => e.Title)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("title");

            entity.HasOne(d => d.Portfolio).WithMany(p => p.Projects)
                .HasForeignKey(d => d.PortfolioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Projects_Portfolios");
        });

        modelBuilder.Entity<Shortlist>(entity =>
        {
            entity.Property(e => e.ShortlistId).HasColumnName("shortlist_id");
            entity.Property(e => e.AccessToken)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("access_token");
            entity.Property(e => e.ClientId).HasColumnName("client_id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.ExpiresAt)
                .HasColumnType("datetime")
                .HasColumnName("expires_at");
            entity.Property(e => e.ManagerId).HasColumnName("manager_id");
            entity.Property(e => e.NeedId).HasColumnName("need_id");
            entity.Property(e => e.Status)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("title");
            entity.Property(e => e.ViewedAt)
                .HasColumnType("datetime")
                .HasColumnName("viewed_at");

            entity.HasOne(d => d.Client).WithMany(p => p.Shortlists)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Shortlists_Clients");

            entity.HasOne(d => d.Manager).WithMany(p => p.Shortlists)
                .HasForeignKey(d => d.ManagerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Shortlists_Managers");

            entity.HasOne(d => d.Need).WithMany(p => p.Shortlists)
                .HasForeignKey(d => d.NeedId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Shortlists_ClientNeeds");
        });

        modelBuilder.Entity<ShortlistItem>(entity =>
        {
            entity.HasKey(e => e.ShortlistId);

            entity.Property(e => e.ShortlistId).HasColumnName("shortlist_id");
            entity.Property(e => e.ClientFeedback)
                .HasColumnType("text")
                .HasColumnName("client_feedback");
            entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
            entity.Property(e => e.IsSelected).HasColumnName("is_selected");
            entity.Property(e => e.MatchingScore)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("matching_score");
            entity.Property(e => e.PortfolioId).HasColumnName("portfolio_id");
            entity.Property(e => e.Position).HasColumnName("position");

            entity.HasOne(d => d.Collaborator).WithMany(p => p.ShortlistItems)
                .HasForeignKey(d => d.CollaboratorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ShortlistItems_Collaborators");

            entity.HasOne(d => d.Portfolio).WithMany(p => p.ShortlistItems)
                .HasForeignKey(d => d.PortfolioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ShortlistItems_Portfolios");
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.Property(e => e.SkillId).HasColumnName("skill_id");
            entity.Property(e => e.Category)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("category");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.IconUrl)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("icon_url");
            entity.Property(e => e.IsVerified).HasColumnName("is_verified");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Testimonial>(entity =>
        {
            entity.Property(e => e.TestimonialId).HasColumnName("testimonial_id");
            entity.Property(e => e.ClientId).HasColumnName("client_id");
            entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
            entity.Property(e => e.Content)
                .HasColumnType("text")
                .HasColumnName("content");
            entity.Property(e => e.IsPublic).HasColumnName("is_public");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.ShowOnPortfolio).HasColumnName("show_on_portfolio");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.ValidatedAt)
                .HasColumnType("datetime")
                .HasColumnName("validated_at");
            entity.Property(e => e.ValidatedByManagerId).HasColumnName("validated_by_manager_id");

            entity.HasOne(d => d.Client).WithMany(p => p.Testimonials)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Testimonials_Clients");

            entity.HasOne(d => d.Collaborator).WithMany(p => p.Testimonials)
                .HasForeignKey(d => d.CollaboratorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Testimonials_Collaborators");

            entity.HasOne(d => d.ValidatedByManager).WithMany(p => p.Testimonials)
                .HasForeignKey(d => d.ValidatedByManagerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Testimonials_Managers");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email, "UQ_Users_Email").IsUnique();

            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("user_id");
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(255)
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
            entity.Property(e => e.IsActive).HasColumnName("is_active");
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
