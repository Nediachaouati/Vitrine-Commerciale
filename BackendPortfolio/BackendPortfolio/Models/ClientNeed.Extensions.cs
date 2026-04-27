using System.Text.Json;

namespace BackendPortfolio.Models
{
    public partial class ClientNeed
    {
        // ── Remplace les string JSON par des vraies List<string> ──
        public List<string> RequiredSkillsList =>
            JsonSerializer.Deserialize<List<string>>(RequiredSkills ?? "[]") ?? new();

        public List<string>? PreferredSkillsList =>
            PreferredSkills == null
                ? null
                : JsonSerializer.Deserialize<List<string>>(PreferredSkills);
    }
}