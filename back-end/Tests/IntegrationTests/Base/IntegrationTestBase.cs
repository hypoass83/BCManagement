using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace Tests.IntegrationTests.Base
{
    public abstract class IntegrationTestBase<TStartup> : IClassFixture<CustomWebApplicationFactory<TStartup>>
        where TStartup : class
    {
        protected readonly HttpClient _client;
        private string? _cachedToken;

        protected IntegrationTestBase(CustomWebApplicationFactory<TStartup> factory)
        {
            _client = factory.CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false
            });
        }

        // ================================================================
        // 🔐 AUTHENTICATION SETUP (pour tous les tests sécurisés)
        // ================================================================
        protected async Task AuthenticateAsync()
        {



            // Évite de refaire un login à chaque test
            if (!string.IsNullOrEmpty(_cachedToken))
            {
                _client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", _cachedToken);
                return;
            }

            var loginRequest = new
            {
                Login = "dental",
                Password = "dental"
            };

            var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(json);
            var token = doc.RootElement.GetProperty("token").GetString();

            _cachedToken = token;
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        // ================================================================
        // 📦 Méthodes utilitaires génériques
        // ================================================================
        protected async Task<HttpResponseMessage> PostAsync<T>(string url, T data)
        {
            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            return await _client.PostAsync(url, content);
        }

        protected async Task<HttpResponseMessage> GetAsync(string url)
        {
            return await _client.GetAsync(url);
        }

        protected async Task<HttpResponseMessage> PutAsync<T>(string url, T data)
        {
            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            return await _client.PutAsync(url, content);
        }

        protected async Task<HttpResponseMessage> DeleteAsync(string url)
        {
            return await _client.DeleteAsync(url);
        }
    }

    [CollectionDefinition("Sequential Integration Tests", DisableParallelization = true)]
    public class SequentialCollection { }
}
