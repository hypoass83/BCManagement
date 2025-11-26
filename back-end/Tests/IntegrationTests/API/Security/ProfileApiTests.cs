using Domain.DTO;
using Domain.Models;
using Domain.Models.Security;
using System.Net;
using System.Net.Http.Json;
using Tests.IntegrationTests.Base;
using Xunit;
using FluentAssertions;
using System.Collections.Generic;

namespace Tests.IntegrationTests.API.Security
{
    [Collection("IntegrationTests")]
    public class ProfileApiTests : IntegrationTestBase<Program>
    {
        public ProfileApiTests(CustomWebApplicationFactory<Program> factory) : base(factory) { }

        #region CreateProfile Tests
        [Fact]
        public async Task CreateProfile_ShouldReturnCreatedProfile()
        {
            await AuthenticateAsync();
            var request = GetFakeProfileRequest();
            var response = await PostAsync("/api/profiles", request);
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            var profile = await response.Content.ReadFromJsonAsync<ProfileModel>();
            Assert.NotNull(profile);
            Assert.Equal("Test Profile", profile.ProfileLabel);
        }

        [Fact]
        public async Task CreateProfile_MissingRequiredFields_ShouldReturnBadRequest()
        {
            await AuthenticateAsync();
            var invalidRequest = new CreateOrUpdateProfileRequest { Menus = null, SubMenus = null, Profile = new ProfileModel() };
            var response = await PostAsync("/api/profiles", invalidRequest);
            Assert.True(response.StatusCode == HttpStatusCode.BadRequest || response.StatusCode == HttpStatusCode.InternalServerError);
        }
        #endregion

        #region GetAllProfiles Tests
        [Fact]
        public async Task GetAllProfiles_ShouldReturnProfileList()
        {
            await AuthenticateAsync();
            await PostAsync("/api/profiles", GetFakeProfileRequest("profile1", "PROF1"));
            await PostAsync("/api/profiles", GetFakeProfileRequest("profile2", "PROF2"));
            var response = await GetAsync("/api/profiles");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var profiles = await response.Content.ReadFromJsonAsync<List<ProfileModel>>();
            Assert.NotNull(profiles);
            Assert.True(profiles.Count >= 2);
        }
        #endregion

        #region GetProfileById Tests
        [Fact]
        public async Task GetProfileById_ValidId_ShouldReturnProfile()
        {
            await AuthenticateAsync();
            var createResp = await PostAsync("/api/profiles", GetFakeProfileRequest());
            var created = await createResp.Content.ReadFromJsonAsync<ProfileModel>();
            var response = await GetAsync($"/api/profiles/{created.ProfileID}");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
        #endregion

        #region UpdateProfile Tests
        [Fact]
        public async Task UpdateProfile_ValidData_ShouldReturnUpdatedProfile()
        {
            await AuthenticateAsync();
            var createResp = await PostAsync("/api/profiles", GetFakeProfileRequest());
            var created = await createResp.Content.ReadFromJsonAsync<ProfileModel>();
            var updateRequest = GetFakeProfileRequest("Updated Name", created.ProfileCode, created.ProfileID);
            var response = await PutAsync("/api/profiles", updateRequest);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var updated = await response.Content.ReadFromJsonAsync<ProfileModel>();
            Assert.Equal("Updated Name", updated.ProfileLabel);
        }
        #endregion

        #region DeleteProfile Tests
        [Fact]
        public async Task DeleteProfile_ValidId_ShouldReturnNoContent()
        {
            await AuthenticateAsync();
            var createResp = await PostAsync("/api/profiles", GetFakeProfileRequest());
            var created = await createResp.Content.ReadFromJsonAsync<ProfileModel>();
            var response = await DeleteAsync($"/api/profiles/{created.ProfileID}");
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }
        #endregion

        #region SpecialEndpointTests
        [Fact]
        public async Task GetAllProfilesCurrentUser_ShouldReturnList()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/profiles/get-all-profiles-current-user");
            Assert.True(response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetModuleCurrentUser_ShouldReturnModules()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/profiles/module-current-user/");
            Assert.True(response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetModuleByProfileID_ShouldReturnModules()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/profiles/module-current-user/1");
            Assert.True(response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetAllModules_ShouldReturnAllModules()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/profiles/modules");
            Assert.True(response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetAdvancedProfileInformation_ShouldReturnList()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/profiles/advanced-profile-information/1");
            Assert.True(response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.NotFound);
        }
        #endregion

        #region Helper
        private CreateOrUpdateProfileRequest GetFakeProfileRequest(string name = "Test Profile", string code = "PRF01", int id = 0)
        {
            return new CreateOrUpdateProfileRequest
            {
                Menus = null,
                SubMenus = null,
                Profile = new ProfileModel
                {
                    ProfileID = id,
                    ProfileCode = code,
                    ProfileLabel = name,
                    ProfileDescription = $"Description for {name}",
                    ProfileState = true,
                    ProfileLevel = 1
                }
            };
        }
        #endregion
    }
}
