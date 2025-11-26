using Xunit;
using Infrastructure.Stores.Security;
using Infrastructure.Context;
using Domain.DTO;
using Domain.Models.Security;
using Domain.Entities.Security;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Tests.UnitTests.Helpers;
using System.Linq;
using Domain.Entities.Localisation;


namespace Tests.UnitTests.Stores
{
    public class UserStoreTests
    {
        private readonly UserStore _store;


        private readonly FsContext _context;
        public UserStoreTests()
        {
            _context = TestHelper.GetSqliteInMemoryContext();
            var mapper = TestHelper.GetMapper();
            var passwordHasher = new PasswordHasher<User>();
          
            _store = new UserStore(_context, passwordHasher);
        }

         private User GetFakeUser(string login = "john", string name = "John Doe")
        {
            return new User
            {
                GlobalPersonID = 0,
                UserLogin = login,
                UserAccessLevel = 1,
                UserAccountState = true,
                JobID = 1,
                Adress = new Adress
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
                IsConnected = true,
                IsMarketer = false,
                IsSeller = true,
                ProfileID = 1,
                Tiergroup = "Default",
                Code = $"USR_{login}"
            };
        }

        [Fact(DisplayName = "CreateUser_ShouldAddUserToDatabase")]
        public async Task CreateUser_ShouldAddUserToDatabase()
        {
            // Arrange
            var user = GetFakeUser();

            // Act
            var result = await _store.CreateUser(user);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(user.UserLogin, result.UserLogin);
            Assert.True(_context.Users.Any(u => u.UserLogin == user.UserLogin));
            Assert.NotNull(result.Adress);
            Assert.Equal("john@test.com", result.Adress.AdressEmail);
        }

        [Fact(DisplayName = "GetUserByLoginAndPassword_ShouldReturnUser_WhenPasswordCorrect")]
        public async Task GetUserByLoginAndPassword_ShouldReturnUser_WhenPasswordCorrect()
        {
            // Arrange
            var user = GetFakeUser("alice", "Alice Doe");
            var created = await _store.CreateUser(user);

            // Simule une connexion avec le bon mot de passe
            var found = _store.GetUserByLoginAndPAssword("alice", "12345678");

            // Assert
            Assert.NotNull(found);
            Assert.Equal("Alice Doe", found.Name);
        }

        [Fact(DisplayName = "DeleteUser_ShouldRemoveUserFromDatabase")]
        public async Task DeleteUser_ShouldRemoveUserFromDatabase()
        {
            // Arrange
            var user = GetFakeUser("bob", "Bob Marley");
            var created = await _store.CreateUser(user);

            // Act
            var deleted = _store.DeleteUser(created.GlobalPersonID);

            // Assert
            Assert.True(deleted);
            Assert.False(_context.Users.Any(u => u.GlobalPersonID == created.GlobalPersonID));
        }

        [Fact(DisplayName = "GetAllUsers_ShouldReturnAllExistingUsers")]
        public async Task GetAllUsers_ShouldReturnAllExistingUsers()
        {
            // Arrange
            var users = new List<User>
            {
                GetFakeUser("user1", "User One"),
                GetFakeUser("user2", "User Two"),
                GetFakeUser("user3", "User Three")
            };

            foreach (var user in users)
                await _store.CreateUser(user);

            // Act
            var allUsers = _store.GetAllUsers();

            // Assert
            Assert.NotNull(allUsers);
            Assert.True(allUsers.Count() >= 3); // Au moins les 3 créés
        }

        [Fact(DisplayName = "GetUserById_ShouldReturnNull_WhenUserDoesNotExist")]
        public void GetUserById_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Act
            var user = _store.GetUserById(9999);

            // Assert
            Assert.Null(user);
        }

        [Fact(DisplayName = "CreateUser_ShouldFail_WhenLoginAlreadyExists")]
        public async Task CreateUser_ShouldFail_WhenLoginAlreadyExists()
        {
            // Arrange
            var user1 = GetFakeUser("duplicate");
            var user2 = GetFakeUser("duplicate");

            await _store.CreateUser(user1);

            // Act & Assert
            await Assert.ThrowsAsync<System.InvalidOperationException>(() => _store.CreateUser(user2));
        }


    }
}
