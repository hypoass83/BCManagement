using System.Net;
using System.Net.Http.Json;
using Tests.IntegrationTests.Base;
using Xunit;
using FluentAssertions;
using Domain.Models.Localisation;
using System.Collections.Generic;

namespace Tests.IntegrationTests.API.Localisation
{
    [Collection("IntegrationTests")]
    public class LocalisationApiTests : IntegrationTestBase<Program>
    {
        public LocalisationApiTests(CustomWebApplicationFactory<Program> factory) : base(factory) { }

        #region Country Tests
        [Fact]
        public async Task CreateCountry_ShouldReturnCreated()
        {
            await AuthenticateAsync();
            var model = new CountryModel { CountryCode = "CM", CountryLabel = "Cameroon" };
            var response = await PostAsync("/create-country", model);
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var created = await response.Content.ReadFromJsonAsync<CountryModel>();
            created.Should().NotBeNull();
            created.CountryLabel.Should().Be("Cameroon");
        }

        [Fact]
        public async Task CreateCountry_WithoutAuth_ShouldReturnUnauthorized()
        {
            var model = new CountryModel { CountryCode = "FR", CountryLabel = "France" };
            var response = await PostAsync("/create-country", model);
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task GetCountryById_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/loclalisation/get-country/1");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetAllCountry_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/loclalisation/get-all-country");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateCountry_ShouldReturnUpdated()
        {
            await AuthenticateAsync();
            var create = await PostAsync("/create-country", new CountryModel { CountryCode = "NG", CountryLabel = "Nigeria" });
            var created = await create.Content.ReadFromJsonAsync<CountryModel>();
            created.CountryLabel = "Nigeria Updated";
            var response = await PutAsync("/api/loclalisation/update-country", created);
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var updated = await response.Content.ReadFromJsonAsync<CountryModel>();
            updated.CountryLabel.Should().Be("Nigeria Updated");
        }

        [Fact]
        public async Task DeleteCountry_ShouldReturnNoContent()
        {
            await AuthenticateAsync();
            var create = await PostAsync("/create-country", new CountryModel { CountryCode = "US", CountryLabel = "USA" });
            var created = await create.Content.ReadFromJsonAsync<CountryModel>();
            var response = await DeleteAsync($"/api/loclalisation/delete-country?CountryId={created.CountryID}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }

        [Fact]
        public async Task DeleteCountry_InvalidId_ShouldReturnNotFound()
        {
            await AuthenticateAsync();
            var response = await DeleteAsync("/api/loclalisation/delete-country?CountryId=999999");
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
        #endregion

        #region Region Tests
        [Fact]
        public async Task CreateRegion_ShouldReturnCreated()
        {
            await AuthenticateAsync();
            var countryResp = await PostAsync("/create-country", new CountryModel { CountryCode = "CM", CountryLabel = "Cameroon" });
            var country = await countryResp.Content.ReadFromJsonAsync<CountryModel>();
            var model = new RegionModel { RegionCode = "CEN", RegionLabel = "Centre", CountryID = country.CountryID };
            var response = await PostAsync("/create-region", model);
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var created = await response.Content.ReadFromJsonAsync<RegionModel>();
            created.RegionLabel.Should().Be("Centre");
        }

        [Fact]
        public async Task GetRegionById_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/loclalisation/get-region/1");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetAllRegions_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/loclalisation/get-all-region");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateRegion_ShouldReturnUpdated()
        {
            await AuthenticateAsync();
            var countryResp = await PostAsync("/create-country", new CountryModel { CountryCode = "GA", CountryLabel = "Gabon" });
            var country = await countryResp.Content.ReadFromJsonAsync<CountryModel>();
            var create = await PostAsync("/create-region", new RegionModel { RegionCode = "EST", RegionLabel = "Est", CountryID = country.CountryID });
            var created = await create.Content.ReadFromJsonAsync<RegionModel>();
            created.RegionLabel = "Est Updated";
            var response = await PutAsync("/api/loclalisation/update-region", created);
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var updated = await response.Content.ReadFromJsonAsync<RegionModel>();
            updated.RegionLabel.Should().Be("Est Updated");
        }

        [Fact]
        public async Task DeleteRegion_ShouldReturnNoContent()
        {
            await AuthenticateAsync();
            var countryResp = await PostAsync("/create-country", new CountryModel { CountryCode = "TD", CountryLabel = "Chad" });
            var country = await countryResp.Content.ReadFromJsonAsync<CountryModel>();
            var create = await PostAsync("/create-region", new RegionModel { RegionCode = "NOR", RegionLabel = "Nord", CountryID = country.CountryID });
            var created = await create.Content.ReadFromJsonAsync<RegionModel>();
            var response = await DeleteAsync($"/api/loclalisation/delete-region?RegionId={created.RegionID}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }
        #endregion

        #region Town Tests
        [Fact]
        public async Task CreateTown_ShouldReturnCreated()
        {
            await AuthenticateAsync();
            var countryResp = await PostAsync("/create-country", new CountryModel { CountryCode = "CM", CountryLabel = "Cameroon" });
            var country = await countryResp.Content.ReadFromJsonAsync<CountryModel>();
            var regionResp = await PostAsync("/create-region", new RegionModel { RegionCode = "LTT", RegionLabel = "Littoral", CountryID = country.CountryID });
            var region = await regionResp.Content.ReadFromJsonAsync<RegionModel>();
            var model = new TownModel { TownCode = "DLA", TownLabel = "Douala", RegionID = region.RegionID };
            var response = await PostAsync("/create-town", model);
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var created = await response.Content.ReadFromJsonAsync<TownModel>();
            created.TownLabel.Should().Be("Douala");
        }

        [Fact]
        public async Task GetTownById_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/loclalisation/get-town/1");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetAllTowns_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/loclalisation/get-all-town");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateTown_ShouldReturnUpdated()
        {
            await AuthenticateAsync();
            var countryResp = await PostAsync("/create-country", new CountryModel { CountryCode = "CM", CountryLabel = "Cameroon" });
            var country = await countryResp.Content.ReadFromJsonAsync<CountryModel>();
            var regionResp = await PostAsync("/create-region", new RegionModel { RegionCode = "CEN", RegionLabel = "Centre", CountryID = country.CountryID });
            var region = await regionResp.Content.ReadFromJsonAsync<RegionModel>();
            var create = await PostAsync("/create-town", new TownModel { TownCode = "YDE", TownLabel = "Yaounde", RegionID = region.RegionID });
            var created = await create.Content.ReadFromJsonAsync<TownModel>();
            created.TownLabel = "Yaounde Updated";
            var response = await PutAsync("/api/loclalisation/update-town", created);
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var updated = await response.Content.ReadFromJsonAsync<TownModel>();
            updated.TownLabel.Should().Be("Yaounde Updated");
        }

        [Fact]
        public async Task DeleteTown_ShouldReturnNoContent()
        {
            await AuthenticateAsync();
            var countryResp = await PostAsync("/create-country", new CountryModel { CountryCode = "CM", CountryLabel = "Cameroon" });
            var country = await countryResp.Content.ReadFromJsonAsync<CountryModel>();
            var regionResp = await PostAsync("/create-region", new RegionModel { RegionCode = "SUD", RegionLabel = "Sud", CountryID = country.CountryID });
            var region = await regionResp.Content.ReadFromJsonAsync<RegionModel>();
            var create = await PostAsync("/create-town", new TownModel { TownCode = "EBO", TownLabel = "Ebolowa", RegionID = region.RegionID });
            var created = await create.Content.ReadFromJsonAsync<TownModel>();
            var response = await DeleteAsync($"/api/loclalisation/delete-town?TownId={created.TownID}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }
        #endregion

        #region Quarter Tests
        [Fact]
        public async Task CreateQuarter_ShouldReturnCreated()
        {
            await AuthenticateAsync();
            var countryResp = await PostAsync("/create-country", new CountryModel { CountryCode = "CM", CountryLabel = "Cameroon" });
            var country = await countryResp.Content.ReadFromJsonAsync<CountryModel>();
            var regionResp = await PostAsync("/create-region", new RegionModel { RegionCode = "LTT", RegionLabel = "Littoral", CountryID = country.CountryID });
            var region = await regionResp.Content.ReadFromJsonAsync<RegionModel>();
            var townResp = await PostAsync("/create-town", new TownModel { TownCode = "DLA", TownLabel = "Douala", RegionID = region.RegionID });
            var town = await townResp.Content.ReadFromJsonAsync<TownModel>();
            var model = new QuarterModel { QuarterCode = "BNDJ", QuarterLabel = "Bonaberi", TownID = town.TownID };
            var response = await PostAsync("/create-quarter", model);
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var created = await response.Content.ReadFromJsonAsync<QuarterModel>();
            created.QuarterLabel.Should().Be("Bonaberi");
        }

        [Fact]
        public async Task GetQuarterById_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/loclalisation/get-quarter/1");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetAllQuarters_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/loclalisation/get-all-quarter");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateQuarter_ShouldReturnUpdated()
        {
            await AuthenticateAsync();
            var countryResp = await PostAsync("/create-country", new CountryModel { CountryCode = "CM", CountryLabel = "Cameroon" });
            var country = await countryResp.Content.ReadFromJsonAsync<CountryModel>();
            var regionResp = await PostAsync("/create-region", new RegionModel { RegionCode = "LTT", RegionLabel = "Littoral", CountryID = country.CountryID });
            var region = await regionResp.Content.ReadFromJsonAsync<RegionModel>();
            var townResp = await PostAsync("/create-town", new TownModel { TownCode = "DLA", TownLabel = "Douala", RegionID = region.RegionID });
            var town = await townResp.Content.ReadFromJsonAsync<TownModel>();
            var create = await PostAsync("/create-quarter", new QuarterModel { QuarterCode = "KMB", QuarterLabel = "Koumassi", TownID = town.TownID });
            var created = await create.Content.ReadFromJsonAsync<QuarterModel>();
            created.QuarterLabel = "Koumassi Updated";
            var response = await PutAsync("/api/loclalisation/update-quarter", created);
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var updated = await response.Content.ReadFromJsonAsync<QuarterModel>();
            updated.QuarterLabel.Should().Be("Koumassi Updated");
        }

        [Fact]
        public async Task DeleteQuarter_ShouldReturnNoContent()
        {
            await AuthenticateAsync();
            var countryResp = await PostAsync("/create-country", new CountryModel { CountryCode = "CM", CountryLabel = "Cameroon" });
            var country = await countryResp.Content.ReadFromJsonAsync<CountryModel>();
            var regionResp = await PostAsync("/create-region", new RegionModel { RegionCode = "LTT", RegionLabel = "Littoral", CountryID = country.CountryID });
            var region = await regionResp.Content.ReadFromJsonAsync<RegionModel>();
            var townResp = await PostAsync("/create-town", new TownModel { TownCode = "DLA", TownLabel = "Douala", RegionID = region.RegionID });
            var town = await townResp.Content.ReadFromJsonAsync<TownModel>();
            var create = await PostAsync("/create-quarter", new QuarterModel { QuarterCode = "BNDJ", QuarterLabel = "Bonaberi", TownID = town.TownID });
            var created = await create.Content.ReadFromJsonAsync<QuarterModel>();
            var response = await DeleteAsync($"/api/loclalisation/delete-quarter?QuarterId={created.QuarterID}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }
        #endregion

        #region Unauthorized List Endpoints
        [Fact]
        public async Task GetAllCountry_WithoutAuth_ShouldReturnUnauthorized()
        {
            var response = await GetAsync("/api/loclalisation/get-all-country");
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task GetAllRegions_WithoutAuth_ShouldReturnUnauthorized()
        {
            var response = await GetAsync("/api/loclalisation/get-all-region");
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task GetAllTowns_WithoutAuth_ShouldReturnUnauthorized()
        {
            var response = await GetAsync("/api/loclalisation/get-all-town");
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task GetAllQuarters_WithoutAuth_ShouldReturnUnauthorized()
        {
            var response = await GetAsync("/api/loclalisation/get-all-quarter");
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
        #endregion
    }
}
