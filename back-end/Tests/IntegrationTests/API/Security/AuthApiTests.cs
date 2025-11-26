using System.Net;
using System.Net.Http.Json;
using Tests.IntegrationTests.Base;
using Xunit;
using FluentAssertions;
using Domain.DTO;

namespace Tests.IntegrationTests.API.Security
{
    [Collection("IntegrationTests")]
    public class AuthApiTests : IntegrationTestBase<Program>
    {
        public AuthApiTests(CustomWebApplicationFactory<Program> factory) : base(factory) { }

        [Fact]
        public async Task Login_WithValidCredentials_ShouldReturnToken()
        {
            var response = await PostAsync("/api/auth/login", new { Login = "dental", Password = "dental" });
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var body = await response.Content.ReadFromJsonAsync<LoginResponse>();
            body.Should().NotBeNull();
            body.Token.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task Login_WithInvalidCredentials_ShouldReturnUnauthorized()
        {
            var response = await PostAsync("/api/auth/login", new { Login = "wrong", Password = "wrong" });
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task ChangePassword_WithoutAuth_ShouldReturnUnauthorized()
        {
            var payload = new ChangePasswordRequestDto { OldPassword = "dental", NewPassword = "newpass!23" };
            var response = await PostAsync("/api/auth/change-password", payload);
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task ChangePassword_WithAuth_ShouldReturnOkBool_AndRevert()
        {
            const string original = "dental";
            const string temp = "Temp#1234!";

            await AuthenticateAsync();

            // change to temp
            var changeToTemp = new ChangePasswordRequestDto { OldPassword = original, NewPassword = temp };
            var changeResp = await PostAsync("/api/auth/change-password", changeToTemp);
            changeResp.StatusCode.Should().Be(HttpStatusCode.OK);

            // revert to original
            var revertPayload = new ChangePasswordRequestDto { OldPassword = temp, NewPassword = original };
            var revertResp = await PostAsync("/api/auth/change-password", revertPayload);
            revertResp.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task ChangePassword2_WithAuth_ShouldReturnOkBool_AndRevert()
        {
            const string original = "dental";
            const string temp = "Temp#5678!";

            await AuthenticateAsync();

            // change to temp
            var changeToTemp = new ChangePasswordRequestDto { OldPassword = original, NewPassword = temp };
            var changeResp = await PostAsync("/api/auth/change-password-2", changeToTemp);
            changeResp.StatusCode.Should().Be(HttpStatusCode.OK);

            // revert to original
            var revertPayload = new ChangePasswordRequestDto { OldPassword = temp, NewPassword = original };
            var revertResp = await PostAsync("/api/auth/change-password-2", revertPayload);
            revertResp.StatusCode.Should().Be(HttpStatusCode.OK);
        }
    }
}
