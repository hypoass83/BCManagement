using Domain.DTO;
using Domain.Models;
using Domain.Models.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesServices.Security
{
    public interface IUserService
    {
        public Task<UserModel?> CreateUser(UserCreateDTO userModel);
        public UserModel? LoginUser(string login, string password);
        public LoginResponse GenerateAuthToken(string login, int userId);
        public UserModel? GetUserById(int id);
        public IEnumerable<UserModel>? GetAllUsers();
        public UserModel? UpdateUser(UserCreateDTO userModel);
        public bool DeleteUser(int id);
        public IEnumerable<UserModel>? GetUsersWithLowerAccessLevel(int userId);
        public bool ChangePassword(int id, ChangePasswordRequestDto changePasswordRequestDto);
        public List<UserModel> GetMarketers();
        public List<UserModel> GetUserByProfile(int profileID);
    }
}
