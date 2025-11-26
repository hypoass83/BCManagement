using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Domain.Models.Configurations;
using FluentAssertions;
using Tests.IntegrationTests.Base;
using Xunit;
using WebAPI.Controllers.Configurations.Requests;

namespace Tests.IntegrationTests.API.Configurations
{
    [Collection("IntegrationTests")]
    public class CompanyApiTests : IntegrationTestBase<Program>
    {
        public CompanyApiTests(CustomWebApplicationFactory<Program> factory) : base(factory) { }

        private MultipartFormDataContent BuildCompanyContent(
            string code = "CP01",
            string name = "Valdoz Holdings",
            string abbreviation = "VH",
            string description = "Default description",
            int? companyId = null,
            int? adressId = null,
            string adressPhoneNumber = "+237699123456",
            string adressCellNumber = "+237677123456",
            string adressEmail = "info@valdoz.cm",
            string adressWebSite = "www.valdoz.cm",
            string adressPOBox = "BP 1234",
            int? adressQuarterId = 1,
            bool includeFile = true)
        {
            var content = new MultipartFormDataContent();

            // Company fields
            content.Add(new StringContent(code, Encoding.UTF8), "CompanyCode");
            content.Add(new StringContent(name, Encoding.UTF8), "CompanyName");
            content.Add(new StringContent(abbreviation, Encoding.UTF8), "CompanyAbbreviation");
            content.Add(new StringContent(description, Encoding.UTF8), "CompanyDescription");

            if (companyId.HasValue)
            {
                content.Add(new StringContent(companyId.Value.ToString(), Encoding.UTF8), "CompanyID");
            }

            // Address ID (for update)
            if (adressId.HasValue)
            {
                content.Add(new StringContent(adressId.Value.ToString(), Encoding.UTF8), "AdressID");
                content.Add(new StringContent(adressId.Value.ToString(), Encoding.UTF8), "Adress.AdressID");
            }

            // Address basic fields - Use the exact parameter names from your API
            if (!string.IsNullOrEmpty(adressPhoneNumber))
            {
                content.Add(new StringContent(adressPhoneNumber, Encoding.UTF8), "Adress.AdressPhoneNumber");
            }

            if (!string.IsNullOrEmpty(adressCellNumber))
            {
                content.Add(new StringContent(adressCellNumber, Encoding.UTF8), "Adress.AdressCellNumber");
            }

            if (!string.IsNullOrEmpty(adressEmail))
            {
                content.Add(new StringContent(adressEmail, Encoding.UTF8), "Adress.AdressEmail");
            }

            if (!string.IsNullOrEmpty(adressWebSite))
            {
                content.Add(new StringContent(adressWebSite, Encoding.UTF8), "Adress.AdressWebSite");
            }

            if (!string.IsNullOrEmpty(adressPOBox))
            {
                content.Add(new StringContent(adressPOBox, Encoding.UTF8), "Adress.AdressPOBox");
            }

            // Location - Only quarterID is needed
            if (adressQuarterId.HasValue)
            {
                content.Add(new StringContent(adressQuarterId.Value.ToString(), Encoding.UTF8), "Adress.QuarterID");
            }

            // Logo file
            if (includeFile)
            {
                var bytes = Encoding.UTF8.GetBytes(description);
                var fileContent = new ByteArrayContent(bytes);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue("image/png");
                content.Add(fileContent, "Logo", "logo.png");
            }

            return content;
        }

        [Fact]
        public async Task CreateCompany_ShouldReturnCreated()
        {
            await AuthenticateAsync();

            using var content = BuildCompanyContent();
            var response = await _client.PostAsync("/api/companies", content);

            response.StatusCode.Should().Be(HttpStatusCode.Created);

            var created = await response.Content.ReadFromJsonAsync<CompanyModel>();
            created.Should().NotBeNull();
            created!.CompanyName.Should().Be("Valdoz Holdings");
            created.CompanyCode.Should().Be("CP01");
            created.Archive.Should().NotBeNull();
            created.Archive!.FileBase64.Should().NotBeNullOrEmpty();
            created.Adress.Should().NotBeNull();
            created.Adress!.AdressPhoneNumber.Should().Be("+237699123456");
            created.Adress.AdressEmail.Should().Be("info@valdoz.cm");
        }

        [Fact]
        public async Task CreateCompany_WithoutAuth_ShouldReturnUnauthorized()
        {
            using var content = BuildCompanyContent();
            var response = await _client.PostAsync("/api/companies", content);
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task CreateCompany_WithoutAddress_ShouldReturnCreated()
        {
            await AuthenticateAsync();

            using var content = BuildCompanyContent(
                adressPhoneNumber: null,
                adressEmail: null,
                adressQuarterId: null
            );
            var response = await _client.PostAsync("/api/companies", content);
            response.StatusCode.Should().Be(HttpStatusCode.Created);
        }

        [Fact]
        public async Task CreateCompany_WithoutLogo_ShouldReturnCreated()
        {
            await AuthenticateAsync();

            using var content = BuildCompanyContent(
                code: "CP04",
                name: "Company Without Logo",
                includeFile: false
            );
            var response = await _client.PostAsync("/api/companies", content);

            response.StatusCode.Should().Be(HttpStatusCode.Created);

            var created = await response.Content.ReadFromJsonAsync<CompanyModel>();
            created.Should().NotBeNull();
            created!.CompanyName.Should().Be("Company Without Logo");
            created.Archive.Should().BeNull();
            created.Adress.Should().NotBeNull();
        }

        [Fact]
        public async Task GetCompanyById_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await _client.GetAsync("/api/companies/1");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetCompanyById_WithValidId_ShouldReturnCompanyWithAddress()
        {
            await AuthenticateAsync();

            // Create company first
            using var createContent = BuildCompanyContent("CP05", "Test Company");
            var createResponse = await _client.PostAsync("/api/companies", createContent);
            var created = await createResponse.Content.ReadFromJsonAsync<CompanyModel>();

            // Get company by ID
            var response = await _client.GetAsync($"/api/companies/{created!.CompanyID}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var company = await response.Content.ReadFromJsonAsync<CompanyModel>();
            company.Should().NotBeNull();
            company!.CompanyID.Should().Be(created.CompanyID);
            company.Adress.Should().NotBeNull();
            company.Adress!.Quarter.Should().NotBeNull();
        }

        [Fact]
        public async Task GetAllCompanies_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await _client.GetAsync("/api/companies");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateCompany_ShouldReturnUpdated()
        {
            await AuthenticateAsync();

            // Create company
            using var createContent = BuildCompanyContent(
                "CP02",
                "Initial Company",
                "IC",
                "Initial description",
                adressPhoneNumber: "+237699111111",
                adressEmail: "initial@test.cm"
            );
            var createResponse = await _client.PostAsync("/api/companies", createContent);
            var created = await createResponse.Content.ReadFromJsonAsync<CompanyModel>();

            // Update company
            using var updateContent = BuildCompanyContent(
                "CP02",
                "Updated Company",
                "UC",
                "Updated description",
                companyId: created!.CompanyID,
                adressId: created.AdressID,
                adressPhoneNumber: "+237699222222",
                adressEmail: "updated@test.cm",
                adressQuarterId: 2,
                includeFile: true
            );
            var updateResponse = await _client.PutAsync("/api/companies", updateContent);

            updateResponse.StatusCode.Should().Be(HttpStatusCode.OK);

            var updated = await updateResponse.Content.ReadFromJsonAsync<CompanyModel>();
            updated.Should().NotBeNull();
            updated!.CompanyName.Should().Be("Updated Company");
            updated.Archive.Should().NotBeNull();
            updated.Archive!.FileBase64.Should().NotBeNullOrEmpty();
            updated.Adress.Should().NotBeNull();
            updated.Adress!.AdressPhoneNumber.Should().Be("+237699222222");
            updated.Adress.AdressEmail.Should().Be("updated@test.cm");
            updated.Adress.QuarterID.Should().Be(2);
        }

        [Fact]
        public async Task UpdateCompany_WithoutChangingLogo_ShouldKeepExistingLogo()
        {
            await AuthenticateAsync();

            // Create company with logo
            using var createContent = BuildCompanyContent("CP06", "Logo Test", includeFile: true);
            var createResponse = await _client.PostAsync("/api/companies", createContent);
            var created = await createResponse.Content.ReadFromJsonAsync<CompanyModel>();
            var originalLogoBase64 = created!.Archive!.FileBase64;

            // Update without new logo
            using var updateContent = BuildCompanyContent(
                "CP06",
                "Logo Test Updated",
                "LTU",
                "Updated",
                companyId: created.CompanyID,
                adressId: created.AdressID,
                includeFile: false
            );
            var updateResponse = await _client.PutAsync("/api/companies", updateContent);

            var updated = await updateResponse.Content.ReadFromJsonAsync<CompanyModel>();
            updated!.Archive.Should().NotBeNull();
            updated.Archive!.FileBase64.Should().Be(originalLogoBase64);
        }

        [Fact]
        public async Task UpdateCompany_WithNewLogo_ShouldReplaceOldLogo()
        {
            await AuthenticateAsync();

            // Create company with logo
            using var createContent = BuildCompanyContent("CP07", "Replace Logo Test", includeFile: true);
            var createResponse = await _client.PostAsync("/api/companies", createContent);
            var created = await createResponse.Content.ReadFromJsonAsync<CompanyModel>();
            var originalLogoBase64 = created!.Archive!.FileBase64;

            // Update with new logo
            using var updateContent = BuildCompanyContent(
                "CP07",
                "Replace Logo Test",
                "RLT",
                "Updated with new logo",
                companyId: created.CompanyID,
                adressId: created.AdressID,
                includeFile: true
            );
            var updateResponse = await _client.PutAsync("/api/companies", updateContent);

            var updated = await updateResponse.Content.ReadFromJsonAsync<CompanyModel>();
            updated!.Archive.Should().NotBeNull();
            updated.Archive!.FileBase64.Should().NotBe(originalLogoBase64);
        }

        [Fact]
        public async Task DeleteCompany_ShouldReturnNoContent()
        {
            await AuthenticateAsync();

            using var createContent = BuildCompanyContent("CP03", "Delete Company", "DC", "Delete description");
            var createResponse = await _client.PostAsync("/api/companies", createContent);
            var created = await createResponse.Content.ReadFromJsonAsync<CompanyModel>();

            var deleteResponse = await _client.DeleteAsync($"/api/companies?companyId={created!.CompanyID}");
            deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Verify deletion
            var getResponse = await _client.GetAsync($"/api/companies/{created.CompanyID}");
            getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task DeleteCompany_InvalidId_ShouldReturnNotFound()
        {
            await AuthenticateAsync();
            var response = await _client.DeleteAsync("/api/companies?companyId=999999");
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
