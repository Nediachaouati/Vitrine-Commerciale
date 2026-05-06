using static BackendPortfolio.Repositories.Email.EmailRepository;
using System.Net.Mail;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace BackendPortfolio.Repositories.Email
{
   
        public class EmailRepository : IEmailRepositorycs
    {
            private readonly IConfiguration _config;

            public EmailRepository(IConfiguration config)
            {
                _config = config;
            }

            public async Task SendWelcomeEmailAsync(
                string toEmail, string firstName, string lastName,
                string username, string password, string role)
            {
                var smtpHost = _config["Email:Host"];
                var smtpPort = int.Parse(_config["Email:Port"] ?? "587");
                var smtpUser = _config["Email:Username"];
                var smtpPass = _config["Email:Password"];
                var fromEmail = _config["Email:From"];
                var appUrl = _config["Email:AppUrl"];

            var roleLabel = role switch
            {
                "vitrine-collaborator" => "Collaborateur",
                "vitrine-manager" => "Manager",
                "vitrine-client" => "Client",
                "vitrine-admin" => "Administrateur",
                _ => role
            };

            var message = new MimeMessage();
                message.From.Add(new MailboxAddress("TRI-Vitrine ", fromEmail));
                message.To.Add(new MailboxAddress($"{firstName} {lastName}", toEmail));
                message.Subject = "Bienvenue sur TRI-Vitrine — Vos accès";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = BuildHtmlEmail(firstName, lastName, username,
                                              password, roleLabel, appUrl)
                };
                message.Body = bodyBuilder.ToMessageBody();

                using var client = new MailKit.Net.Smtp.SmtpClient();
                await client.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpUser, smtpPass);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }

            private static string BuildHtmlEmail(
                string firstName, string lastName, string username,
                string password, string role, string? appUrl)
            {
                return $"""
            <!DOCTYPE html>
            <html lang="fr">
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Arial, sans-serif; background:#f4f6f9; margin:0; padding:20px;">
              <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; 
                          padding:40px; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                
                <div style="text-align:center; margin-bottom:30px;">
                  <h1 style="color:#4361ee; margin:0;">TRI-Vitrine</h1>
                  
                </div>

                <h2 style="color:#2d3748;">Bonjour {firstName} {lastName},</h2>

                <p style="color:#4a5568; line-height:1.6;">
                  Votre compte <strong>{role}</strong> a été créé sur la plateforme TRI-Vitrine.
                  Voici vos identifiants de connexion :
                </p>

                <div style="background:#f7fafc; border-left:4px solid #4361ee; 
                            border-radius:6px; padding:20px; margin:24px 0;">
                  <table style="width:100%; border-collapse:collapse;">
                    <tr>
                      <td style="color:#718096; padding:6px 0; width:40%;">
                        <strong>Nom d'utilisateur :</strong>
                      </td>
                      <td style="color:#2d3748; font-weight:600;">{username}</td>
                    </tr>
                    <tr>
                      <td style="color:#718096; padding:6px 0;">
                        <strong>Mot de passe temporaire :</strong>
                      </td>
                      <td>
                        <code style="background:#edf2f7; padding:3px 8px; border-radius:4px; 
                                     font-size:15px; color:#e53e3e; font-weight:700;">
                          {password}
                        </code>
                      </td>
                    </tr>
                    <tr>
                      <td style="color:#718096; padding:6px 0;"><strong>Rôle :</strong></td>
                      <td style="color:#2d3748;">{role}</td>
                    </tr>
                  </table>
                </div>

                <div style="background:#fff3cd; border:1px solid #ffc107; border-radius:6px; 
                            padding:16px; margin:20px 0;">
                  <p style="margin:0; color:#856404; font-size:14px;">
                    ⚠️ <strong>Important :</strong> Pour des raisons de sécurité, vous devez 
                    changer votre mot de passe dès votre première connexion.
                  </p>
                </div>

                <div style="text-align:center; margin:30px 0;">
                  <a href="{appUrl}" 
                     style="background:#4361ee; color:#fff; padding:14px 32px; 
                            border-radius:8px; text-decoration:none; font-weight:600; 
                            font-size:15px; display:inline-block;">
                    Se connecter →
                  </a>
                </div>

                <hr style="border:none; border-top:1px solid #e2e8f0; margin:30px 0;">
                <p style="color:#a0aec0; font-size:12px; text-align:center; margin:0;">
                  Cet email a été envoyé automatiquement. Ne pas répondre.
                </p>
              </div>
            </body>
            </html>
            """;
            }
        }
    }