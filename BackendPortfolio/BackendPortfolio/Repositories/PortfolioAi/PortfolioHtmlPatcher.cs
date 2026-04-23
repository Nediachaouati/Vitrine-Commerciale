/*using System.Text.RegularExpressions;
using BackendPortfolio.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendPortfolio.Repositories.PortfolioAi
{
    /// <summary>
    /// Patches an existing portfolio HTML by replacing data-driven values directly,
    /// without any AI/Gemini call. Only updates what changed in the database.
    /// </summary>
    public static class PortfolioHtmlPatcher
    {
        // ── DATA ATTRIBUTES injected during generation ──────────────
        // The generated HTML must contain data-* attributes for each patchable field.
        // Example: <span data-field="yearsExperience">5</span>
        // We inject these attributes in the generation prompt (see updated system prompt).

        /// <summary>
        /// Patches all profile-level fields (name, bio, jobTitle, yearsExperience,
        /// linkedinUrl, githubUrl, avatarUrl, availabilityStatus) directly in the HTML.
        /// </summary>
        public static string PatchProfileFields(
            string html,
            string fullName,
            string? jobTitle,
            string? bio,
            int? yearsExperience,
            string? linkedinUrl,
            string? githubUrl,
            string avatarUrl,
            string? availabilityStatus)
        {
            html = ReplaceDataField(html, "fullName", fullName);
            html = ReplaceDataField(html, "jobTitle", jobTitle ?? "");
            html = ReplaceDataField(html, "bio", bio ?? "");
            html = ReplaceDataField(html, "yearsExperience", yearsExperience?.ToString() ?? "");
            html = ReplaceDataField(html, "availabilityStatus", availabilityStatus ?? "");

            // Avatar: replace src attribute of img with data-field="avatar"
            html = ReplaceDataAttrSrc(html, "avatar", avatarUrl);

            // LinkedIn href
            if (!string.IsNullOrWhiteSpace(linkedinUrl))
                html = ReplaceDataAttrHref(html, "linkedinUrl", linkedinUrl);

            // GitHub href
            if (!string.IsNullOrWhiteSpace(githubUrl))
                html = ReplaceDataAttrHref(html, "githubUrl", githubUrl);

            return html;
        }

        /// <summary>
        /// Patches a single experience card in the HTML using data-experience-id attribute.
        /// Only the fields present in updatedFields are replaced.
        /// </summary>
        public static string PatchExperience(string html, Experience exp)
        {
            var id = exp.ExperienceId.ToString();

            html = ReplaceDataFieldInScope(html, "experience", id, "jobTitle", exp.JobTitle);
            html = ReplaceDataFieldInScope(html, "experience", id, "companyName", exp.CompanyName);
            html = ReplaceDataFieldInScope(html, "experience", id, "location", exp.Location ?? "");
            html = ReplaceDataFieldInScope(html, "experience", id, "description", exp.Description ?? "");
            html = ReplaceDataFieldInScope(html, "experience", id, "technologies", exp.Technologies ?? "");

            var period = $"{exp.StartDate:MM/yyyy} → {(exp.IsCurrent ? "Présent" : exp.EndDate?.ToString("MM/yyyy") ?? "N/A")}";
            html = ReplaceDataFieldInScope(html, "experience", id, "period", period);

            return html;
        }

        /// <summary>
        /// Patches a single skill badge in the HTML using data-skill-id attribute.
        /// </summary>
        public static string PatchSkill(string html, CollaboratorSkill skill, string skillName)
        {
            var id = skill.SkillId.ToString();
            html = ReplaceDataFieldInScope(html, "skill", id, "level", skill.Level ?? "");
            html = ReplaceDataFieldInScope(html, "skill", id, "yearsUsed", skill.YearsUsed.ToString());
            html = ReplaceDataFieldInScope(html, "skill", id, "name", skillName);
            return html;
        }

        /// <summary>
        /// Patches a certification card using data-certification-id.
        /// </summary>
        public static string PatchCertification(string html, Certification cert)
        {
            var id = cert.CertificationId.ToString();
            html = ReplaceDataFieldInScope(html, "certification", id, "name", cert.Name);
            html = ReplaceDataFieldInScope(html, "certification", id, "issuer", cert.Issuer ?? "");
            html = ReplaceDataFieldInScope(html, "certification", id, "year", cert.IssueDate.Year.ToString());
            html = ReplaceDataFieldInScope(html, "certification", id, "score", cert.Score.ToString("0"));
            return html;
        }

        // ── LOW-LEVEL HELPERS ────────────────────────────────────────

        /// <summary>
        /// Replaces the text content of any element bearing data-field="fieldName".
        /// Handles both inline text and elements with child-only content.
        /// </summary>
        private static string ReplaceDataField(string html, string fieldName, string newValue)
        {
            // Match: <TAG ... data-field="fieldName" ...>ANYTHING</TAG>
            // The content between tags is replaced. Works for span, p, h1..h6, div, etc.
            var pattern = $@"(<[^>]+\bdata-field=""{Regex.Escape(fieldName)}""\b[^>]*>)(.*?)(</[a-zA-Z0-9]+>)";
            return Regex.Replace(html, pattern,
                m => m.Groups[1].Value + System.Web.HttpUtility.HtmlEncode(newValue) + m.Groups[3].Value,
                RegexOptions.Singleline | RegexOptions.IgnoreCase);
        }

        /// <summary>
        /// Replaces the src attribute of an img bearing data-field="fieldName".
        /// </summary>
        private static string ReplaceDataAttrSrc(string html, string fieldName, string newSrc)
        {
            // Replace src="..." inside img tags that have data-field="fieldName"
            var pattern = $@"(<img\b[^>]*\bdata-field=""{Regex.Escape(fieldName)}""\b[^>]*?\bsrc="")[^""]*("")";
            var result = Regex.Replace(html, pattern,
                m => m.Groups[1].Value + newSrc + m.Groups[2].Value,
                RegexOptions.Singleline | RegexOptions.IgnoreCase);

            // Also try src before data-field
            var pattern2 = $@"(<img\b[^>]*\bsrc="")[^""]*(""\b[^>]*\bdata-field=""{Regex.Escape(fieldName)}""\b[^>]*>)";
            result = Regex.Replace(result, pattern2,
                m => m.Groups[1].Value + newSrc + m.Groups[2].Value,
                RegexOptions.Singleline | RegexOptions.IgnoreCase);

            return result;
        }

        /// <summary>
        /// Replaces the href attribute of an anchor bearing data-field="fieldName".
        /// </summary>
        private static string ReplaceDataAttrHref(string html, string fieldName, string newHref)
        {
            var pattern = $@"(<a\b[^>]*\bdata-field=""{Regex.Escape(fieldName)}""\b[^>]*?\bhref="")[^""]*("")";
            var result = Regex.Replace(html, pattern,
                m => m.Groups[1].Value + newHref + m.Groups[2].Value,
                RegexOptions.Singleline | RegexOptions.IgnoreCase);

            var pattern2 = $@"(<a\b[^>]*\bhref="")[^""]*(""\b[^>]*\bdata-field=""{Regex.Escape(fieldName)}""\b[^>]*>)";
            result = Regex.Replace(result, pattern2,
                m => m.Groups[1].Value + newHref + m.Groups[2].Value,
                RegexOptions.Singleline | RegexOptions.IgnoreCase);

            return result;
        }

        /// <summary>
        /// Replaces a data-field within a scoped parent element identified by
        /// data-{entityType}-id="{entityId}".
        /// Example scope: <div data-experience-id="3">...<span data-field="jobTitle">...</span>...</div>
        /// </summary>
        private static string ReplaceDataFieldInScope(
            string html, string entityType, string entityId, string fieldName, string newValue)
        {
            // Find the scope block: element with data-{entityType}-id="{entityId}"
            // Then within it, replace data-field="{fieldName}"
            var scopePattern = $@"(data-{Regex.Escape(entityType)}-id=""{Regex.Escape(entityId)}"")";
            var scopeMatch = Regex.Match(html, scopePattern, RegexOptions.IgnoreCase);
            if (!scopeMatch.Success) return html;

            // Find the opening tag that contains this attribute, then find matching close
            // Strategy: find the tag start before this match
            int attrStart = scopeMatch.Index;
            int tagOpen = html.LastIndexOf('<', attrStart);
            if (tagOpen < 0) return html;

            // Extract tag name
            var tagNameMatch = Regex.Match(html.Substring(tagOpen), @"<([a-zA-Z][a-zA-Z0-9]*)");
            if (!tagNameMatch.Success) return html;
            var tagName = tagNameMatch.Groups[1].Value;

            // Find matching closing tag (handles nesting)
            int depth = 1;
            int pos = html.IndexOf('>', attrStart) + 1;
            int scopeEnd = -1;
            var openTag = $"<{tagName}";
            var closeTag = $"</{tagName}>";

            while (pos < html.Length && depth > 0)
            {
                int nextOpen = html.IndexOf(openTag, pos, StringComparison.OrdinalIgnoreCase);
                int nextClose = html.IndexOf(closeTag, pos, StringComparison.OrdinalIgnoreCase);

                if (nextClose < 0) break;

                if (nextOpen >= 0 && nextOpen < nextClose)
                {
                    depth++;
                    pos = nextOpen + openTag.Length;
                }
                else
                {
                    depth--;
                    if (depth == 0)
                        scopeEnd = nextClose + closeTag.Length;
                    else
                        pos = nextClose + closeTag.Length;
                }
            }

            if (scopeEnd < 0) return html;

            // Extract the scope block and patch field within it
            var scopeBlock = html.Substring(tagOpen, scopeEnd - tagOpen);
            var patchedScope = ReplaceDataField(scopeBlock, fieldName, newValue);

            return html.Substring(0, tagOpen) + patchedScope + html.Substring(scopeEnd);
        }
    }
}*/