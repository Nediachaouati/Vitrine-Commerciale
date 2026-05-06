namespace BackendPortfolio.Services
{
    public interface IShortlistPdfService
    {
        byte[] GenerateShortlistPdf(ShortlistPdfRequest request);
    }

    public class ShortlistPdfRequest
    {
        public string Title { get; set; } = "";
        public string? Description { get; set; }
        public string ManagerName { get; set; } = "";
        public string? ClientName { get; set; }
        public string ShareUrl { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public List<ShortlistPdfItem> Items { get; set; } = new();
    }

    public class ShortlistPdfItem
    {
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string JobTitle { get; set; } = "";
        public string AvailabilityStatus { get; set; } = "";
        public int YearsExperience { get; set; }
        public List<string> PrimarySkills { get; set; } = new();
        public double? RelevanceScore { get; set; }
        public string? ManagerNote { get; set; }
    }

    public class ShortlistPdfService : IShortlistPdfService
    {
        // Génère un PDF HTML simple (rendu via HTML → bytes)
        // Pour un vrai PDF, intégrer QuestPDF ou PuppeteerSharp
        // Ici on retourne du HTML encodé que le frontend peut ouvrir/imprimer
        public byte[] GenerateShortlistPdf(ShortlistPdfRequest request)
        {
            var availLabel = new Dictionary<string, string>
            {
                ["available"] = "Disponible",
                ["soon_available"] = "Bientôt disponible",
                ["not_available"] = "Non disponible"
            };

            var availColor = new Dictionary<string, string>
            {
                ["available"] = "#10b981",
                ["soon_available"] = "#f59e0b",
                ["not_available"] = "#ef4444"
            };

            var itemsHtml = string.Join("", request.Items.Select((item, idx) =>
            {
                var skills = string.Join(", ", item.PrimarySkills.Take(5));
                var avail = availLabel.GetValueOrDefault(item.AvailabilityStatus, item.AvailabilityStatus);
                var color = availColor.GetValueOrDefault(item.AvailabilityStatus, "#888");
                var score = item.RelevanceScore.HasValue ? $"{Math.Round(item.RelevanceScore.Value)}%" : "—";
                var note = !string.IsNullOrEmpty(item.ManagerNote) ? $"<p style='color:#666;font-size:12px;margin:6px 0 0;font-style:italic;'>Note : {item.ManagerNote}</p>" : "";

                return $@"
<div style='border:1px solid #e5e7eb;border-radius:10px;padding:16px 20px;margin-bottom:12px;display:flex;align-items:flex-start;gap:16px;'>
  <div style='width:44px;height:44px;border-radius:50%;background:#fce7e7;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#e11d48;font-size:15px;flex-shrink:0;'>
    {item.FirstName.Substring(0, 1)}{item.LastName.Substring(0, 1)}
  </div>
  <div style='flex:1;'>
    <div style='display:flex;align-items:center;justify-content:space-between;'>
      <div>
        <p style='margin:0;font-weight:700;font-size:15px;color:#111;'>{item.FirstName} {item.LastName}</p>
        <p style='margin:2px 0 0;font-size:13px;color:#666;'>{item.JobTitle} · {item.YearsExperience} ans d'exp.</p>
      </div>
      <div style='text-align:right;'>
        <p style='margin:0;font-size:18px;font-weight:800;color:#e11d48;'>{score}</p>
        <p style='margin:0;font-size:10px;color:#999;'>SCORE</p>
      </div>
    </div>
    <div style='margin-top:8px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;'>
      <span style='display:inline-block;width:8px;height:8px;border-radius:50%;background:{color};'></span>
      <span style='font-size:12px;color:{color};font-weight:600;'>{avail}</span>
      {(skills.Length > 0 ? $"<span style='font-size:12px;color:#888;'>· {skills}</span>" : "")}
    </div>
    {note}
  </div>
</div>";
            }));

            var html = $@"<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'>
<title>Shortlist — {request.Title}</title>
<style>
  * {{ box-sizing: border-box; }}
  body {{ font-family: Arial, sans-serif; margin: 0; padding: 0; background: #fff; color: #111; }}
  @media print {{
    body {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  }}
</style>
</head>
<body>
  <div style='max-width:800px;margin:0 auto;padding:40px 32px;'>

    <!-- Header -->
    <div style='background:#e11d48;border-radius:12px;padding:28px 32px;color:white;margin-bottom:28px;'>
      <p style='margin:0 0 4px;font-size:12px;opacity:0.75;text-transform:uppercase;letter-spacing:1px;'>Shortlist confidentielle</p>
      <h1 style='margin:0;font-size:24px;'>{request.Title}</h1>
      {(request.Description != null ? $"<p style='margin:8px 0 0;opacity:0.85;font-size:14px;'>{request.Description}</p>" : "")}
    </div>

    <!-- Meta -->
    <div style='display:flex;gap:24px;margin-bottom:24px;padding:16px 20px;background:#f9f9f9;border-radius:10px;flex-wrap:wrap;'>
      <div>
        <p style='margin:0;font-size:10px;text-transform:uppercase;color:#999;letter-spacing:0.5px;'>Manager</p>
        <p style='margin:4px 0 0;font-weight:700;font-size:14px;'>{request.ManagerName}</p>
      </div>
      {(request.ClientName != null ? $@"<div>
        <p style='margin:0;font-size:10px;text-transform:uppercase;color:#999;letter-spacing:0.5px;'>Client</p>
        <p style='margin:4px 0 0;font-weight:700;font-size:14px;'>{request.ClientName}</p>
      </div>" : "")}
      <div>
        <p style='margin:0;font-size:10px;text-transform:uppercase;color:#999;letter-spacing:0.5px;'>Date</p>
        <p style='margin:4px 0 0;font-weight:700;font-size:14px;'>{request.CreatedAt:dd MMM yyyy}</p>
      </div>
      <div>
        <p style='margin:0;font-size:10px;text-transform:uppercase;color:#999;letter-spacing:0.5px;'>Profils</p>
        <p style='margin:4px 0 0;font-weight:700;font-size:14px;'>{request.Items.Count} candidat{(request.Items.Count > 1 ? "s" : "")}</p>
      </div>
    </div>

    <!-- Profiles -->
    <h2 style='font-size:16px;margin:0 0 14px;color:#333;'>Profils sélectionnés</h2>
    {itemsHtml}

    <!-- Footer -->
    <div style='margin-top:32px;padding-top:20px;border-top:1px solid #eee;text-align:center;'>
      <p style='margin:0;color:#aaa;font-size:12px;'>Accès sécurisé : {request.ShareUrl}</p>
      <p style='margin:6px 0 0;color:#ccc;font-size:11px;'>Document généré le {DateTime.Now:dd/MM/yyyy à HH:mm} · Confidentiel</p>
    </div>
  </div>
</body>
</html>";

            return System.Text.Encoding.UTF8.GetBytes(html);
        }
    }
}