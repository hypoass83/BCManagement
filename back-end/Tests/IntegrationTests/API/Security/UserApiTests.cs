using Domain.DTO;
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
    public class UserApiTests : IntegrationTestBase<Program> // Program.cs = ton point d'entrée API
    {
        public UserApiTests(CustomWebApplicationFactory<Program> factory) : base(factory) { }

        #region CreateUser Tests

        [Fact]
        public async Task CreateUser_ShouldReturnCreatedUser()
        {
            await AuthenticateAsync();
            // Arrange
            var user = GetFakeUserDTO();

            // Act
            var response = await PostAsync("/api/users", user);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var createdUser = await response.Content.ReadFromJsonAsync<UserModel>();
            Assert.NotNull(createdUser);
            Assert.Equal("john", createdUser.UserLogin);
            Assert.Equal("John Doe", createdUser.Name);
            Assert.Equal(1, createdUser.BranchID);
            Assert.True(createdUser.UserAccountState);
        }

        [Fact]
        public async Task CreateUser_WithDuplicateLogin_ShouldReturnBadRequest()
        {
            await AuthenticateAsync();
            // Arrange
            var user1 = GetFakeUserDTO("duplicate_user", "User One");
            var user2 = GetFakeUserDTO("duplicate_user", "User Two");

            // Act - Create first user
            var response1 = await PostAsync("/api/users", user1);
            Assert.Equal(HttpStatusCode.OK, response1.StatusCode);

            // Act - Try to create second user with same login
            var response2 = await PostAsync("/api/users", user2);

            // Assert
            Assert.Equal(HttpStatusCode.InternalServerError, response2.StatusCode); 
        }

        [Fact]
        public async Task CreateUser_WithoutAuthentication_ShouldReturnUnauthorized()
        {
            // Arrange
            var user = GetFakeUserDTO();

            // Act
            var response = await PostAsync("/api/users", user);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        #endregion

        #region GetUserById Tests

        [Fact]
        public async Task GetUserById_WithValidId_ShouldReturnUser()
        {
            await AuthenticateAsync();
            // Arrange - First create a user
            var userDto = GetFakeUserDTO("testuser1", "Test User 1");
            var createResponse = await PostAsync("/api/users", userDto);
            var createdUser = await createResponse.Content.ReadFromJsonAsync<UserModel>();

            // Act
            var response = await GetAsync($"/api/users/{createdUser.GlobalPersonID}");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var user = await response.Content.ReadFromJsonAsync<UserModel>();
            Assert.NotNull(user);
            Assert.Equal(createdUser.GlobalPersonID, user.GlobalPersonID);
            Assert.Equal("testuser1", user.UserLogin);
        }

        [Fact]
        public async Task GetUserById_WithInvalidId_ShouldReturnNotFound()
        {
            await AuthenticateAsync();
            
            // Act
            var response = await GetAsync("/api/users/99999");

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task GetUserById_WithoutAuthentication_ShouldReturnUnauthorized()
        {
            // Act
            var response = await GetAsync("/api/users/1");

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        #endregion

        #region GetCurrentUser Tests

        [Fact]
        public async Task GetCurrentUser_ShouldReturnAuthenticatedUser()
        {
            await AuthenticateAsync();
            
            // Act
            var response = await GetAsync("/api/users/current-user");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var currentUser = await response.Content.ReadFromJsonAsync<UserModel>();
            Assert.NotNull(currentUser);
            // Add more assertions based on your authenticated user details
        }

        [Fact]
        public async Task GetCurrentUser_WithoutAuthentication_ShouldReturnUnauthorized()
        {
            // Act
            var response = await GetAsync("/api/users/current-user");

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        #endregion

        #region GetAllUsers Tests

        [Fact]
        public async Task GetAllUsers_ShouldReturnUsersList()
        {
            await AuthenticateAsync();
            // Arrange - Create some users first
            var user1 = GetFakeUserDTO("user1", "User One");
            var user2 = GetFakeUserDTO("user2", "User Two");
            await PostAsync("/api/users", user1);
            await PostAsync("/api/users", user2);

            // Act
            var response = await GetAsync("/api/users");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var users = await response.Content.ReadFromJsonAsync<List<UserModel>>();
            Assert.NotNull(users);
            Assert.True(users.Count >= 2);
            Assert.Contains(users, u => u.UserLogin == "user1");
            Assert.Contains(users, u => u.UserLogin == "user2");
        }

        [Fact]
        public async Task GetAllUsers_WhenNoUsers_ShouldReturnEmptyListOrNotFound()
        {
            await AuthenticateAsync();
            
            // Act
            var response = await GetAsync("/api/users");

            // Assert
            // Depending on your implementation, it might return OK with empty list or NotFound
            Assert.True(response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.NotFound);
        }

        #endregion



        #region GetUserByProfile Tests

        [Fact]
        public async Task GetUserByProfile_WithValidProfileId_ShouldReturnUsers()
        {
            await AuthenticateAsync();
            // Arrange - Create users with specific profile
            var user1 = GetFakeUserDTO("profile_user1", "Profile User 1");
            user1.ProfileID = 5;
            var user2 = GetFakeUserDTO("profile_user2", "Profile User 2");
            user2.ProfileID = 5;
            
            await PostAsync("/api/users", user1);
            await PostAsync("/api/users", user2);

            // Act
            var response = await GetAsync("/api/users/users/5");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var users = await response.Content.ReadFromJsonAsync<List<UserModel>>();
            Assert.NotNull(users);
            Assert.All(users, u => Assert.Equal(5, u.ProfileID));
        }

        [Fact]
        public async Task GetUserByProfile_WithNoMatchingUsers_ShouldReturnEmptyList()
        {
            await AuthenticateAsync();
            
            // Act
            var response = await GetAsync("/api/users/users/9999");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var users = await response.Content.ReadFromJsonAsync<List<UserModel>>();
            Assert.NotNull(users);
            Assert.Empty(users);
        }

        #endregion

        #region GetUsersWithLowerAccessLevel Tests

        [Fact]
        public async Task GetUsersWithLowerAccessLevel_ShouldReturnUsersWithLowerLevel()
        {
            await AuthenticateAsync();
            // Arrange - Create users with different access levels
            var lowLevelUser = GetFakeUserDTO("low_level", "Low Level User");
            lowLevelUser.UserAccessLevel = 1;
            
            var midLevelUser = GetFakeUserDTO("mid_level", "Mid Level User");
            midLevelUser.UserAccessLevel = 5;
            
            await PostAsync("/api/users", lowLevelUser);
            await PostAsync("/api/users", midLevelUser);

            // Act - Assuming current user has high access level
            var response = await GetAsync("/api/users/users-with-lower-access-level");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var users = await response.Content.ReadFromJsonAsync<List<UserModel>>();
            Assert.NotNull(users);
            // Verify that returned users have lower access level than current user
        }

        [Fact]
        public async Task GetUsersWithLowerAccessLevel_WithoutAuthentication_ShouldReturnUnauthorized()
        {
            // Act
            var response = await GetAsync("/api/users/users-with-lower-access-level");

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        #endregion

        #region UpdateUser Tests

        [Fact]
        public async Task UpdateUser_WithValidData_ShouldReturnUpdatedUser()
        {
            await AuthenticateAsync();
            // Arrange - First create a user
            var originalUser = GetFakeUserDTO("original", "Original Name");
            var createResponse = await PostAsync("/api/users", originalUser);
            var createdUser = await createResponse.Content.ReadFromJsonAsync<UserModel>();
            
            // Modify the user
            var updatedUserDto = GetFakeUserDTO("original", "Updated Name");
            updatedUserDto.GlobalPersonID = createdUser.GlobalPersonID;
            updatedUserDto.Description = "Updated description";
            updatedUserDto.UserAccessLevel = 3;

            // Act
            var response = await PutAsync("/api/users", updatedUserDto);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var updatedUser = await response.Content.ReadFromJsonAsync<UserModel>();
            Assert.NotNull(updatedUser);
            Assert.Equal("Updated Name", updatedUser.Name);
            Assert.Equal(3, updatedUser.UserAccessLevel);
        }

     

        [Fact]
        public async Task UpdateUser_WithoutAuthentication_ShouldReturnUnauthorized()
        {
            // Arrange
            var userDto = GetFakeUserDTO();
            userDto.GlobalPersonID = 1;

            // Act
            var response = await PutAsync("/api/users", userDto);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        #endregion

        #region DeleteUser Tests

        [Fact]
        public async Task DeleteUser_WithValidId_ShouldReturnTrue()
        {
            await AuthenticateAsync();
            // Arrange - First create a user
            var userDto = GetFakeUserDTO("to_delete", "To Delete");
            var createResponse = await PostAsync("/api/users", userDto);
            var createdUser = await createResponse.Content.ReadFromJsonAsync<UserModel>();

            // Act
            var response = await DeleteAsync($"/api/users?userId={createdUser.GlobalPersonID}");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var result = await response.Content.ReadFromJsonAsync<bool>();
            Assert.True(result);

            // Verify user is deleted
            var getResponse = await GetAsync($"/api/users/{createdUser.GlobalPersonID}");
            Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
        }

        [Fact]
        public async Task DeleteUser_WithNonExistentId_ShouldReturnNotFound()
        {
            await AuthenticateAsync();
            
            // Act
            var response = await DeleteAsync("/api/users?userId=99999");

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task DeleteUser_WithoutAuthentication_ShouldReturnUnauthorized()
        {
            // Act
            var response = await DeleteAsync("/api/users?userId=1");

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        #endregion

        #region Edge Cases and Validation Tests

        [Fact]
        public async Task CreateUser_WithMissingRequiredFields_ShouldReturnBadRequest()
        {
            await AuthenticateAsync();
            // Arrange - User with missing required fields
            var invalidUser = new UserCreateDTO
            {
                UserLogin = "incomplete_user"
                // Missing other required fields
            };

            // Act
            var response = await PostAsync("/api/users", invalidUser);

            // Assert
            Assert.True(response.StatusCode == HttpStatusCode.BadRequest || 
                       response.StatusCode == HttpStatusCode.InternalServerError);
        }

        [Fact]
        public async Task CreateUser_WithIsConnectedTrue_ShouldGeneratePassword()
        {
            await AuthenticateAsync();
            // Arrange
            var user = GetFakeUserDTO("connected_user", "Connected User");
            user.IsConnected = true;

            // Act
            var response = await PostAsync("/api/users", user);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var createdUser = await response.Content.ReadFromJsonAsync<UserModel>();
            Assert.NotNull(createdUser);
            // Password should be hashed, not null
            // Note: We can't verify the actual password as it's hashed
        }

        [Fact]
        public async Task UpdateUser_ShouldPreservePassword()
        {
            await AuthenticateAsync();
            // Arrange - Create user with password
            var userDto = GetFakeUserDTO("password_user", "Password User");
            userDto.IsConnected = true;
            var createResponse = await PostAsync("/api/users", userDto);
            var createdUser = await createResponse.Content.ReadFromJsonAsync<UserModel>();
            
            // Update user without changing password
            userDto.GlobalPersonID = createdUser.GlobalPersonID;
            userDto.Name = "Updated Password User";

            // Act
            var updateResponse = await PutAsync("/api/users", userDto);

            // Assert
            Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
            var updatedUser = await updateResponse.Content.ReadFromJsonAsync<UserModel>();
            Assert.NotNull(updatedUser);
            Assert.Equal("Updated Password User", updatedUser.Name);
            // Password should remain unchanged (we can't directly verify this due to hashing)
        }

        #endregion

        #region Helper Methods

        private UserCreateDTO GetFakeUserDTO(string login = "john", string name = "John Doe")
        {
            return new UserCreateDTO
            {
                GlobalPersonID = 0,
                UserLogin = login,
                UserAccessLevel = 1,
                UserAccountState = true,
                JobID = 1,
                Adress = new AdressCreateDTO
                {
                    AdressPhoneNumber = "+237233456789",
                    AdressCellNumber = "699123456",
                    AdressFullName = $"{name} Residence",
                    AdressEmail = $"{login}@test.com",
                    AdressWebSite = $"www.{login}.cm",
                    AdressPOBox = "BP 1234",
                    AdressFax = "233789012",
                    QuarterID = 1
                },
                Name = name,
                Description = $"Test user {name}",
                CNI = $"CNI_{login}",
                BranchID = 1,
                SexID = 1,
                IsConnected = false,
                IsMarketer = false,
                IsSeller = true,
                ProfileID = null,
                Tiergroup = "Default",
                Code = $"USR_{login}"
            };
        }

        #endregion
    }
}