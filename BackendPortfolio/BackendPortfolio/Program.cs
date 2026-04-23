global using Microsoft.AspNetCore.Authentication;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
global using Microsoft.AspNetCore.Authorization;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.EntityFrameworkCore.Storage;
global using Microsoft.IdentityModel.Tokens;
global using System;
global using System.Collections.Generic;
global using System.IdentityModel.Tokens.Jwt;
global using System.Security.Claims;
global using System.Text.Json;
global using System.Text.Json.Serialization;
global using System.Net.Http.Headers;
global using Microsoft.Extensions.Options;
global using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.HttpOverrides;
using BackendPortfolio.Models;
using BackendPortfolio.DTO.kc;
using backendPortfolio.Utlis;
using Microsoft.OpenApi.Models;
using BackendPortfolio.Repositories;
using BackendPortfolio.Repositories.Collaborator;
using backendPortfolio.Repositories;
using BackendPortfolio.Services;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// =======================================================
// DB CONTEXT
// =======================================================
builder.Services.AddDbContextFactory<VitrineDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ConnectionString")));

// =======================================================
// CONTROLLERS
// =======================================================
builder.Services.AddControllers(options =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    options.Filters.Add(new AuthorizeFilter(policy));
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.MaxDepth = 64;
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});

// =======================================================
// SIGNALR
// =======================================================
builder.Services.AddSignalR();

builder.Services.AddHttpClient("OpenRouter", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["OpenRouter:BaseUrl"]!);
    client.DefaultRequestHeaders.Add(
        "Authorization",
        $"Bearer {builder.Configuration["OpenRouter:ApiKey"]}" // ← ici on lit la clé
    );
    client.DefaultRequestHeaders.Referrer = new Uri("http://localhost:5026");
    client.Timeout = TimeSpan.FromMinutes(5);
});
builder.Services.AddHttpClient("Gemini", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Gemini:BaseUrl"]!);
    client.Timeout = TimeSpan.FromMinutes(120);
});



// =======================================================
// DEPENDENCY INJECTION
// =======================================================
builder.Services.AddScoped<IDbExceptionLogger, DbExceptionLogger>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<ICollaboratorRepository, CollaboratorRepository>();
builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
builder.Services.AddScoped<IPortfolioAiService, PortfolioAiService>();

// =======================================================
// AUTHORIZATION POLICIES
// =======================================================
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireAssertion(ctx =>
        {
            // Cherche dans les claims "roles" extraits par OnTokenValidated
            return ctx.User.Claims.Any(c =>
                c.Type == "roles" && c.Value == "vitrine-admin"
            );
        })
    );
});

// =======================================================
// SWAGGER
// =======================================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(options =>

{

    // 🔹 Add Bearer definition
    
        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme

        {

            Name = "Authorization",

            Type = SecuritySchemeType.Http,

            Scheme = "bearer",

            BearerFormat = "JWT",

            In = ParameterLocation.Header,

            Description = "Enter: Bearer {your JWT token}"

        });

        // 🔹 Apply it globally

        options.AddSecurityRequirement(new OpenApiSecurityRequirement

        {

            {

                new OpenApiSecurityScheme

                {

                    Reference = new OpenApiReference

                    {

                        Type = ReferenceType.SecurityScheme,

                        Id = "Bearer"

                    }

                },

                new string[] {}

            }

        });

    });

    // =======================================================
    // CORS
    // =======================================================
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: MyAllowSpecificOrigins,
            policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
    });

    // =======================================================
    // FORMS LIMITS
    // =======================================================
    builder.Services.Configure<FormOptions>(o =>
    {
        o.ValueLengthLimit = int.MaxValue;
        o.MultipartBodyLengthLimit = int.MaxValue;
        o.MemoryBufferThreshold = int.MaxValue;
    });

    // =======================================================
    // KEYCLOAK CONFIG
    // =======================================================
    var issuingAuthority = builder.Configuration["Keycloak:Authority"]
        ?? throw new InvalidOperationException("Keycloak:Authority is not set.");

    var validAudience = builder.Configuration["Keycloak:Audience"]
        ?? throw new InvalidOperationException("Keycloak:Audience is not set.");

    var requireHttpsMetadata = builder.Configuration.GetValue<bool>("Keycloak:RequireHttpsMetadata");

    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Authority = issuingAuthority;
            options.Audience = validAudience;
            
            options.RequireHttpsMetadata = requireHttpsMetadata;
            options.MapInboundClaims = false;

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidIssuer = issuingAuthority,
                ValidateIssuer = true,
                ValidAudiences = new[] { validAudience, "account" },
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                NameClaimType = "preferred_username",
                ClockSkew = TimeSpan.FromMinutes(5)
            };
            
             options.Events = new JwtBearerEvents
             {
                 OnTokenValidated = async ctx =>
                 {
                     var principal = ctx.Principal!;
                     var identity = (ClaimsIdentity)principal.Identity!;

                     // ── Extraire vitrine-admin depuis resource_access ──
                     var resourceAccessClaim = principal.FindFirst("resource_access")?.Value;
                     if (!string.IsNullOrEmpty(resourceAccessClaim))
                     {
                         try
                         {
                             var doc = JsonDocument.Parse(resourceAccessClaim);
                             if (doc.RootElement.TryGetProperty("tri360-vitrine-api", out var clientRoles))
                             {
                                 if (clientRoles.TryGetProperty("roles", out var roles))
                                 {
                                     foreach (var role in roles.EnumerateArray())
                                     {
                                         var roleValue = role.GetString();
                                         if (!string.IsNullOrEmpty(roleValue))
                                         {
                                             identity.AddClaim(new Claim("roles", roleValue));
                                             Console.WriteLine($"[AUTH] Rôle extrait: {roleValue}");
                                         }
                                     }
                                 }
                             }
                         }
                         catch (Exception ex)
                         {
                             Console.WriteLine($"[AUTH] Erreur extraction resource_access: {ex.Message}");
                         }
                     }

                     // ── Log tous les claims ──
                     Console.WriteLine("=== TOKEN CLAIMS ===");
                     foreach (var c in principal.Claims)
                         Console.WriteLine($"{c.Type} = {c.Value}");
                     Console.WriteLine("====================");

                     // ── Ignorer les service accounts ──
                     var email = principal.FindFirst("email")?.Value;
                     if (string.IsNullOrWhiteSpace(email))
                     {
                         Console.WriteLine("[AUTH] Service account détecté → ignoré");
                         return;
                     }

                     // ── Créer ou récupérer le user en BD ──
                     var usersRepo = ctx.HttpContext.RequestServices
                         .GetRequiredService<IUsersRepository>();
                     var userLocal = await usersRepo.GetOrCreateAsync(principal);

                     if (userLocal == null)
                     {
                         Console.WriteLine("[AUTH] Échec GetOrCreateAsync");
                         ctx.Fail("Impossible de créer ou trouver l'utilisateur local");
                         return;
                     }
                    
                     identity.AddClaim(new Claim("local_user_id", userLocal.UserId.ToString()));
                     identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, userLocal.UserId.ToString()));

                     Console.WriteLine($"[AUTH SUCCESS] User {userLocal.Email} (ID={userLocal.UserId})");
                 },

                 OnAuthenticationFailed = ctx =>
                 {
                     Console.WriteLine($"[AUTH FAILED] {ctx.Exception.GetType().Name}");
                     Console.WriteLine($"[AUTH FAILED MESSAGE] {ctx.Exception.Message}");
                     if (ctx.Exception.InnerException != null)
                         Console.WriteLine($"[AUTH FAILED INNER] {ctx.Exception.InnerException.Message}");
                     return Task.CompletedTask;
                 },

                 OnChallenge = ctx =>
                 {
                     Console.WriteLine($"[CHALLENGE] {ctx.Error} | {ctx.ErrorDescription}");
                     return Task.CompletedTask;
                 }
             };
        });

    // =======================================================
    // KEYCLOAK ADMIN SERVICE — Singleton pour cache token
    // =======================================================
     builder.Services.Configure<KeycloakAdminOptions>(
         builder.Configuration.GetSection("Admin")
     );
     builder.Services.AddHttpClient<KeycloakAdminService>();
     builder.Services.AddSingleton<IKeycloakAdminService>(sp =>
     {
         var http = sp.GetRequiredService<IHttpClientFactory>()
                      .CreateClient(nameof(KeycloakAdminService));
         var opt = sp.GetRequiredService<IOptions<KeycloakAdminOptions>>();
         return new KeycloakAdminService(http, opt);
     });


// =======================================================
// BUILD
// =======================================================
var app = builder.Build();

    app.UseMiddleware<GlobalExceptionMiddleware>();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseDefaultFiles();
    app.UseStaticFiles();

    var resourcesPath = Path.Combine(Directory.GetCurrentDirectory(), "Resources");
    if (Directory.Exists(resourcesPath))
    {
        app.UseStaticFiles(new StaticFileOptions()
        {
            FileProvider = new PhysicalFileProvider(resourcesPath),
            RequestPath = new PathString("/Resources")
        });
    }

    app.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    });

    app.UseCors(MyAllowSpecificOrigins);
    app.UseHttpsRedirection();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    try
    {
        app.Run();
    }
    catch (Exception ex)
    {
        Console.WriteLine("Erreur critique au démarrage : " + ex);
        throw;
    }

     
 