using System.Net;
using System.Net.Mail;

namespace BackendPortfolio.Services
{
    public interface IShortlistEmailService
    {
        Task SendShortlistEmailAsync(ShortlistEmailRequest request);
    }

    public class ShortlistEmailRequest
    {
        public string ToEmail { get; set; } = "";
        public string ToName { get; set; } = "";
        public string ShortlistTitle { get; set; } = "";
        public string ShareUrl { get; set; } = "";
        public string MessageBody { get; set; } = "";
        public string Subject { get; set; } = "";
        public string ManagerName { get; set; } = "";
    }

    public class ShortlistEmailService : IShortlistEmailService
    {
        private readonly IConfiguration _config;

        public ShortlistEmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendShortlistEmailAsync(ShortlistEmailRequest request)
        {
            var host = _config["Email:Host"] ?? "smtp.gmail.com";
            var port = int.Parse(_config["Email:Port"] ?? "587");
            var username = _config["Email:Username"] ?? "";
            var password = _config["Email:Password"] ?? "";
            var from = _config["Email:From"] ?? username;

            using var client = new SmtpClient(host, port)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(username, password)
            };

            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body {{ font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }}
    .container {{ max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
    .header {{ background: #e11d48; padding: 32px 40px; color: white; }}
    .header h1 {{ margin: 0; font-size: 22px; }}
    .header p {{ margin: 6px 0 0; opacity: 0.85; font-size: 14px; }}
    .body {{ padding: 32px 40px; }}
    .body p {{ color: #444; line-height: 1.7; font-size: 15px; }}
    .cta {{ display: block; margin: 28px 0; padding: 14px 28px; background: #e11d48; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; text-align: center; }}
    .info-box {{ background: #f9f9f9; border-left: 4px solid #e11d48; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }}
    .info-box p {{ margin: 0; color: #555; font-size: 13px; }}
    .footer {{ background: #f9f9f9; padding: 20px 40px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }}
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h1>Shortlist de profils recommandés</h1>
      <p>{request.ShortlistTitle}</p>
    </div>
    <div class='body'>
      <p>{request.MessageBody.Replace("\n", "<br>")}</p>
      <a href='{request.ShareUrl}' class='cta'>→ Accéder à ma shortlist sécurisée</a>
      <div class='info-box'>
        <p><strong>Lien d'accès :</strong><br>{request.ShareUrl}</p>
      </div>
      <p style='color:#888; font-size:13px;'>Ce lien est sécurisé et personnalisé. Vous devrez vous connecter pour consulter les profils des candidats.</p>
    </div>
    <div class='footer'>
      <p>Envoyé par {request.ManagerName} via la plateforme Vitrine</p>
      <p>© {DateTime.Now.Year} Vitrine — Tous droits réservés</p>
    </div>
  </div>
</body>
</html>";

            var mail = new MailMessage
            {
                From = new MailAddress(from, $"{request.ManagerName} via Vitrine"),
                Subject = request.Subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            mail.To.Add(new MailAddress(request.ToEmail, request.ToName));

            await client.SendMailAsync(mail);
        }
    }
}