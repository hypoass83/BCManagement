using System.Net;
using System.Net.Http.Json;
using Tests.IntegrationTests.Base;
using Xunit;
using FluentAssertions;
using Domain.Models.Security;
using System.Collections.Generic;

namespace Tests.IntegrationTests.API.Security
{
    [Collection("IntegrationTests")]
    public class JobApiTests : IntegrationTestBase<Program>
    {
        public JobApiTests(CustomWebApplicationFactory<Program> factory) : base(factory) { }

        private object BuildJob(string code = "JB01", string label = "Cashier")
        {
            return new
            {
                JobCode = code,
                JobLabel = label,
                JobDescription = $"{label} role",
                DepartmentID = 1
            };
        }

        #region Auth
        [Fact]
        public async Task CreateJob_WithoutAuth_ShouldReturnUnauthorized()
        {
            var response = await PostAsync("/api/jobs", BuildJob());
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
        #endregion

        #region Create
        [Fact]
        public async Task CreateJob_ShouldReturnCreated()
        {
            await AuthenticateAsync();
            var response = await PostAsync("/api/jobs", BuildJob());
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var created = await response.Content.ReadFromJsonAsync<JobModel>();
            created.Should().NotBeNull();
            created.JobLabel.Should().Be("Cashier");
        }
        #endregion

        #region Get
        [Fact]
        public async Task GetJobById_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/jobs/1");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetAllJobs_ShouldReturnOkOrNotFound()
        {
            await AuthenticateAsync();
            var response = await GetAsync("/api/jobs");
            response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
        }
        #endregion

        #region Update
        [Fact]
        public async Task UpdateJob_ShouldReturnUpdated()
        {
            await AuthenticateAsync();
            var create = await PostAsync("/api/jobs", BuildJob("JB02", "Seller"));
            var created = await create.Content.ReadFromJsonAsync<JobModel>();
            var updatePayload = new
            {
                JobID = created.JobID,
                JobCode = created.JobCode,
                JobLabel = "Seller Updated",
                JobDescription = created.JobDescription,
                DepartmentID = 1
            };
            var response = await PutAsync("/api/jobs", updatePayload);
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var updated = await response.Content.ReadFromJsonAsync<JobModel>();
            updated.JobLabel.Should().Be("Seller Updated");
        }
        #endregion

        #region Delete
        [Fact]
        public async Task DeleteJob_ShouldReturnNoContent()
        {
            await AuthenticateAsync();
            var create = await PostAsync("/api/jobs", BuildJob("JB03", "ToDelete"));
            var created = await create.Content.ReadFromJsonAsync<JobModel>();
            var response = await DeleteAsync($"/api/jobs?JobId={created.JobID}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }

        [Fact]
        public async Task DeleteJob_InvalidId_ShouldReturnNotFound()
        {
            await AuthenticateAsync();
            var response = await DeleteAsync("/api/jobs?JobId=999999");
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
        #endregion
    }
}
