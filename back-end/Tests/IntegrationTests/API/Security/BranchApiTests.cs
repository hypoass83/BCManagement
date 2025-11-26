using System.Net;
using System.Net.Http.Json;
using Tests.IntegrationTests.Base;
using Xunit;
using FluentAssertions;
using Domain.Models.Security;
using Domain.Models.Localisation;
using System.Collections.Generic;

namespace Tests.IntegrationTests.API.Security
{
    [Collection("IntegrationTests")]
    public class BranchApiTests : IntegrationTestBase<Program>
    {
        public BranchApiTests(CustomWebApplicationFactory<Program> factory) : base(factory) { }

        private BranchModel BuildBranch(string code = "BR01", string name = "Main Branch")
        {
            return new BranchModel
            {
                BranchCode = code,
                BranchAbbreviation = "MB",
                BranchName = name,
                BranchDescription = $"{name} description",
               
                Adress = new AdressModel
                {
                    AdressPhoneNumber = "+237233456789",
                    AdressCellNumber = "699123456",
                    AdressFullName = $"{name} HQ",
                    AdressEmail = $"{code.ToLower()}@test.com",
                    AdressWebSite = $"www.{code.ToLower()}.cm",
                    AdressPOBox = "BP 1234",
                    AdressFax = "233789012",
                    QuarterID = 1
                },
                CompanyID = 1
            };
        }

        [Fact]
        public async Task CreateBranch_ShouldReturnCreatedBranch()
        {
            await AuthenticateAsync();
            var response = await PostAsync("/api/branchs", BuildBranch());
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var model = await response.Content.ReadFromJsonAsync<BranchModel>();
            model.Should().NotBeNull();
            model.BranchName.Should().Be("Main Branch");
        }


        [Fact]
        public async Task CreateBranch_WithoutAuth_ShouldReturnUnauthorized()
        {

            var response = await PostAsync("/api/branchs", BuildBranch());
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }


        [Fact]
        public async Task GetBranchById_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/branchs/1");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetAllBranchs_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/branchs");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateBranch_ShouldReturnUpdated()
        {
            await AuthenticateAsync();
            var create = await PostAsync("/api/branchs", BuildBranch("BR02", "North Branch"));
            var created = await create.Content.ReadFromJsonAsync<BranchModel>();
            created.BranchName = "North Branch Updated";
            var response = await PutAsync("/api/branchs", created);
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var updated = await response.Content.ReadFromJsonAsync<BranchModel>();
            updated.BranchName.Should().Be("North Branch Updated");
        }

        [Fact]
        public async Task DeleteBranch_ShouldReturnNoContent()
        {
            await AuthenticateAsync();
            var create = await PostAsync("/api/branchs", BuildBranch("BR03", "Delete Branch"));
            var created = await create.Content.ReadFromJsonAsync<BranchModel>();
            var response = await DeleteAsync($"/api/branchs?BranchId={created.BranchID}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }

        [Fact]
        public async Task DeleteBranch_InvalidId_ShouldReturnNotFound()
        {
            await AuthenticateAsync();
            var response = await DeleteAsync("/api/branchs?BranchId=999999");
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
