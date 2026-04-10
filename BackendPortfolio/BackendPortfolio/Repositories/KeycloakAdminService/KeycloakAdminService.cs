using BackendPortfolio.DTO.kc;
using backendPortfolio.Repositories;
using System.Text;
using System.Net.Http;

namespace BackendPortfolio.Repositories
{
    public class KeycloakAdminService : IKeycloakAdminService
    {
        private readonly HttpClient _http;
        private readonly KeycloakAdminOptions _opt;

        private string? _clientUuid;
        private (string Token, DateTimeOffset Exp)? _token;

        private static readonly JsonSerializerOptions JsonOpts = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public KeycloakAdminService(HttpClient http, IOptions<KeycloakAdminOptions> opt)
        {
            _http = http;
            _opt = opt.Value;
        }

        // ─── EXISTANT ───────────────────────────────────────

        public async Task<IReadOnlyList<KcUser>> GetUsersByClientRolesAsync(
            string[] roleNames, int first = 0, int max = 1000)
        {
            var token = await GetTokenAsync();
            var clientUuid = await GetClientUuidAsync(token);

            var tasks = roleNames.Select(r =>
                GetUsersByRoleAsync(clientUuid, r, token, first, max));

            var results = await Task.WhenAll(tasks);

            return results
                .SelectMany(x => x)
                .Where(u => !string.IsNullOrWhiteSpace(u.Id))
                .GroupBy(u => u.Id)
                .Select(g => g.First())
                .ToList();
        }

        public async Task<List<KcUser>> GetUsersAsync(int first = 0, int max = 200)
        {
            var token = await GetTokenAsync();
            var clientUuid = await GetClientUuidAsync(token);

            var req = new HttpRequestMessage(
                HttpMethod.Get,
                $"{_opt.BaseUrl}/admin/realms/{_opt.Realm}/users?first={first}&max={max}"
            );
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var res = await _http.SendAsync(req);
            res.EnsureSuccessStatusCode();

            var users = JsonSerializer.Deserialize<List<KcUser>>(
                await res.Content.ReadAsStringAsync(), JsonOpts
            ) ?? new List<KcUser>();

            var tasks = users
                .Where(u => !string.IsNullOrWhiteSpace(u.Id))
                .Select(async u =>
                {
                    u.Roles = await GetClientRolesForUserAsync(u.Id, clientUuid, token);
                    return u;
                });

            return (await Task.WhenAll(tasks)).ToList();
        }

        // ─── NOUVEAU : CreateUserAsync ───────────────────────

        public async Task<string?> CreateUserAsync(CreateUserDto dto)
        {
            var token = await GetTokenAsync();
            var clientUuid = await GetClientUuidAsync(token);

            // ── 1) Créer le user dans Keycloak ──
            var body = JsonSerializer.Serialize(new
            {
                username = dto.Username,
                email = dto.Email,
                firstName = dto.FirstName,
                lastName = dto.LastName,
                enabled = true,
                credentials = new[]
                {
                    new
                    {
                        type = "password",
                        value = dto.Password,
                        temporary = false
                    }
                }
            });

            var req = new HttpRequestMessage(HttpMethod.Post,
                $"{_opt.BaseUrl}/admin/realms/{_opt.Realm}/users")
            {
                Content = new StringContent(body, Encoding.UTF8, "application/json")
            };
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode)
            {
                var err = await res.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Keycloak CreateUser failed: {err}");
            }

            // ── 2) Récupérer l'ID depuis le header Location ──
            var location = res.Headers.Location?.ToString();
            var userId = location?.Split('/').Last();
            if (string.IsNullOrWhiteSpace(userId)) return null;

            // ── 3) Assigner le rôle ──
            await AssignClientRoleAsync(userId, dto.KcRole, clientUuid, token);

            return userId;
        }

        // ─── NOUVEAU : DeleteUserAsync ───────────────────────

        public async Task DeleteUserAsync(string keycloakId)
        {
            var token = await GetTokenAsync();

            var req = new HttpRequestMessage(HttpMethod.Delete,
                $"{_opt.BaseUrl}/admin/realms/{_opt.Realm}/users/{keycloakId}");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode)
            {
                var err = await res.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Keycloak DeleteUser failed: {err}");
            }
        }

        // ─── PRIVATE ────────────────────────────────────────

        private async Task AssignClientRoleAsync(
            string userId, string roleName, string clientUuid, string token)
        {
            // 1) Récupérer le rôle par son nom
            var req = new HttpRequestMessage(HttpMethod.Get,
                $"{_opt.BaseUrl}/admin/realms/{_opt.Realm}/clients/{clientUuid}/roles/{roleName}");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode) return;

            var role = JsonSerializer.Deserialize<JsonElement>(
                await res.Content.ReadAsStringAsync(), JsonOpts);

            // 2) Assigner au user
            var body = JsonSerializer.Serialize(new[] { role });
            var assignReq = new HttpRequestMessage(HttpMethod.Post,
                $"{_opt.BaseUrl}/admin/realms/{_opt.Realm}/users/{userId}/role-mappings/clients/{clientUuid}")
            {
                Content = new StringContent(body, Encoding.UTF8, "application/json")
            };
            assignReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            await _http.SendAsync(assignReq);
        }

        private async Task<List<string>> GetClientRolesForUserAsync(
            string userId, string clientUuid, string token)
        {
            var req = new HttpRequestMessage(HttpMethod.Get,
                $"{_opt.BaseUrl}/admin/realms/{_opt.Realm}/users/{userId}/role-mappings/clients/{clientUuid}"
            );
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode) return new List<string>();

            var roles = JsonSerializer.Deserialize<List<KcRoleRepresentation>>(
                await res.Content.ReadAsStringAsync(), JsonOpts
            ) ?? new List<KcRoleRepresentation>();

            return roles.Select(r => r.Name ?? "").Where(r => r != "").ToList();
        }

        private async Task<string> GetTokenAsync()
        {
            if (_token is { } t && t.Exp > DateTimeOffset.UtcNow.AddSeconds(30))
                return t.Token;

            var res = await _http.PostAsync(
                $"{_opt.BaseUrl}/realms/{_opt.Realm}/protocol/openid-connect/token",
                new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["grant_type"] = "client_credentials",
                    ["client_id"] = _opt.ClientId,
                    ["client_secret"] = _opt.ClientSecret
                })
            );

            res.EnsureSuccessStatusCode();

            var json = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
            var token = json.RootElement.GetProperty("access_token").GetString()!;
            var exp = json.RootElement.GetProperty("expires_in").GetInt32();

            _token = (token, DateTimeOffset.UtcNow.AddSeconds(exp));
            return token;
        }

        private async Task<string> GetClientUuidAsync(string token)
        {
            if (_clientUuid != null) return _clientUuid;

            var req = new HttpRequestMessage(HttpMethod.Get,
                $"{_opt.BaseUrl}/admin/realms/{_opt.Realm}/clients?clientId={_opt.RolesClientId}"
            );
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var res = await _http.SendAsync(req);
            res.EnsureSuccessStatusCode();

            var clients = JsonSerializer.Deserialize<List<KcClient>>(
                await res.Content.ReadAsStringAsync(), JsonOpts
            ) ?? new List<KcClient>();

            if (clients.Count == 0 || string.IsNullOrWhiteSpace(clients[0].Id))
                throw new InvalidOperationException(
                    $"Keycloak client not found for clientId={_opt.RolesClientId}");

            _clientUuid = clients[0].Id;
            return _clientUuid;
        }

        private async Task<List<KcUser>> GetUsersByRoleAsync(
            string clientUuid, string role, string token, int first, int max)
        {
            var req = new HttpRequestMessage(HttpMethod.Get,
                $"{_opt.BaseUrl}/admin/realms/{_opt.Realm}/clients/{clientUuid}/roles/{role}/users?first={first}&max={max}"
            );
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var res = await _http.SendAsync(req);
            res.EnsureSuccessStatusCode();

            return JsonSerializer.Deserialize<List<KcUser>>(
                await res.Content.ReadAsStringAsync(), JsonOpts
            ) ?? new List<KcUser>();
        }

        private sealed class KcClient { public string Id { get; set; } = ""; }
        private sealed class KcRoleRepresentation { public string? Name { get; set; } }


        public async Task<bool> UpdateUserAsync(string keycloakId, string? firstName, string? lastName, string? email)
        {
            try
            {
                // ✅ Utilise GetTokenAsync() qui existe déjà dans la classe
                var token = await GetTokenAsync();

                var body = new Dictionary<string, object>();

                if (!string.IsNullOrWhiteSpace(firstName))
                    body["firstName"] = firstName;

                if (!string.IsNullOrWhiteSpace(lastName))
                    body["lastName"] = lastName;

                if (!string.IsNullOrWhiteSpace(email))
                {
                    body["email"] = email;
                    body["emailVerified"] = true;
                }

                var json = JsonSerializer.Serialize(body);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // ✅ Utilise _http et _opt qui existent déjà dans la classe
                var req = new HttpRequestMessage(HttpMethod.Put,
                    $"{_opt.BaseUrl}/admin/realms/{_opt.Realm}/users/{keycloakId}")
                {
                    Content = content
                };
                req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var res = await _http.SendAsync(req);
                return res.IsSuccessStatusCode;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> ChangePasswordAsync(string keycloakUserId, string newPassword)
        {
            try
            {
                var token = await GetTokenAsync();

                var body = new
                {
                    type = "password",
                    value = newPassword,
                    temporary = false
                };

                var json = JsonSerializer.Serialize(body);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var req = new HttpRequestMessage(
                    HttpMethod.Put,
                    $"{_opt.BaseUrl}/admin/realms/{_opt.Realm}/users/{keycloakUserId}/reset-password")
                {
                    Content = content
                };

                req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var res = await _http.SendAsync(req);
                return res.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _ = ex;
                return false;
            }
        }
    }
}