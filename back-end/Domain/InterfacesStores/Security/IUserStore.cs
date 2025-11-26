using Domain.DTO;
using Domain.Entities.Security;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.InterfacesStores.Security
{
    public interface IUserStore
    {
        public User? GetUserByLoginAndPAssword(string email, string password);
        public Task<User?> CreateUser(User userModel);
        public User? GetUserById(int id);
        public IEnumerable<User>? GetAllUsers();
        public IEnumerable<User>? GetUsersWithLowerAccessLevel(int userId);
        public User? UpdateUser(User userModel);
        public bool DeleteUser(int id);
        public bool ChangePassword(int id, ChangePasswordRequestDto changePasswordRequestDto);
        public List<User> GetMarketers();
        public List<User> GetUserByProfile(int profileID);
    }
}
