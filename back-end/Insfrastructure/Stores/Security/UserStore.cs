using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.Entities.Security;
using Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using Domain.DTO;
using Microsoft.EntityFrameworkCore;



namespace Infrastructure.Stores.Security
{
    public class UserStore : IUserStore
    {
        private readonly FsContext _dbContext;
        private readonly IPasswordHasher<User> _passwordHasher;

        private static Random random = new Random();

        public UserStore(FsContext dbContext, IPasswordHasher<User> passwordHasher)
        {
            _dbContext = dbContext;
            _passwordHasher = passwordHasher;
        }

        public async Task<User?> CreateUser(User user)
        {
        
            var existUser = _dbContext.Users.FirstOrDefault(x => x.UserLogin == user.UserLogin);
            if (existUser != null)
            {
                throw new InvalidOperationException("User Exist deja ");
            }

            if (user.IsConnected)
            {
                user.UserPassword = "12345678";
            }

            if (user.UserPassword != null)
            {
                user.UserPassword = _passwordHasher.HashPassword(user, user.UserPassword);
            }

            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
            _dbContext.Entry(user).State = EntityState.Detached;

            return GetUserById(user.GlobalPersonID);
        }

        public User? GetUserByLoginAndPAssword(string login, string password)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.UserLogin == login);

            if (user == null || user.UserPassword == null)
            {
                return null;
            }

            // check if user is not blocked account
            if (!user.UserAccountState)
            {
                return null;
            }

            // check if his profile is active
            if (user.Profile != null && !user.Profile.ProfileState)
            {
                return null;
            }

            // Vérifier le mot de passe
            var result = _passwordHasher.VerifyHashedPassword(user, user.UserPassword, password);

            return result == PasswordVerificationResult.Success ? user : null;
        }

        public User? GetUserById(int userId)
        {
            return _dbContext.Users.FirstOrDefault(u => u.GlobalPersonID.Equals(userId));
        }

        public IEnumerable<User>? GetAllUsers()
        {
            return _dbContext.Users.ToList();
        }

        public User? UpdateUser(User user)
        {
            var existingUser = _dbContext.Users.FirstOrDefault(u => u.GlobalPersonID == user.GlobalPersonID);
            if (existingUser == null)
            {
                return null;
            }
             
            user.UserPassword = existingUser.UserPassword; // Preserve the original password
            // Update other fields
            _dbContext.Entry(existingUser).CurrentValues.SetValues(user);
            existingUser.Adress = user.Adress;

            _dbContext.SaveChanges();
            return existingUser;
        }

        public bool DeleteUser(int id)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.GlobalPersonID.Equals(id));
            if (user == null)
            {
                return false;
            }

            _dbContext.Users.Remove(user);
            _dbContext.SaveChanges();
            return true;
        }

        public bool ChangePassword(int id, ChangePasswordRequestDto changePasswordRequestDto)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.GlobalPersonID == id);

            if (user == null || user.UserPassword == null)
            {
                return false;
            }

            var result = _passwordHasher.VerifyHashedPassword(user, user.UserPassword, changePasswordRequestDto.OldPassword);

            if (result != PasswordVerificationResult.Success)
            {
                return false;
            }

            user.UserPassword = _passwordHasher.HashPassword(user, changePasswordRequestDto.NewPassword);
            _dbContext.SaveChanges();
            return true;
        }

        public IEnumerable<User>? GetUsersWithLowerAccessLevel(int userId)
        {
            var user = GetUserById(userId);
            if (user == null)
            {
                return null;
            }

            return _dbContext.Users
                .Where(u => u.UserAccessLevel < user.UserAccessLevel)
                .ToList();
        }

        public string GenererCode(int longueur = 8)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, longueur).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public List<User> GetMarketers()
        {
            _dbContext.ChangeTracker.LazyLoadingEnabled = false;
            return _dbContext.Users.ToList();
        }

        public List<User> GetUserByProfile(int profileID)
        {
            return _dbContext.Users
                .Where(us => us.ProfileID == profileID)
                .ToList();
        }

    }
}