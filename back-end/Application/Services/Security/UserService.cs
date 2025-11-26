using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.InterfacesServices.Security;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Models.Security;
using Domain.Entities.Security;
using Microsoft.Extensions.Configuration;
using Domain.DTO;
using AutoMapper;


namespace Application.Service
{
    public class UserService : IUserService
    {
        private readonly IUserStore _userStore;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public UserService(IUserStore userStore, IConfiguration configuration, IMapper mapper)
        {
            _userStore = userStore;
            _configuration = configuration;
            _mapper = mapper;
        }

        public async Task<UserModel?> CreateUser(UserCreateDTO userModel)
        {
            var user = _mapper.Map<User>(userModel);
            var createdUser = await _userStore.CreateUser(user);
            return createdUser != null ? _mapper.Map<UserModel>(createdUser) : null;
        }

        public UserModel? GetUserById(int userId)
        {
            var user = _userStore.GetUserById(userId);
            return user != null ? _mapper.Map<UserModel>(user) : null;
        }

        public IEnumerable<UserModel>? GetAllUsers()
        {
            var users = _userStore.GetAllUsers();
            return users?.Select(user => _mapper.Map<UserModel>(user));
        }

        public UserModel? UpdateUser(UserCreateDTO userModel)
        {
            var user = _mapper.Map<User>(userModel);
            var updatedUser = _userStore.UpdateUser(user);
            return updatedUser != null ? _mapper.Map<UserModel>(updatedUser) : null;
        }

        public bool DeleteUser(int idUser)
        {
            return _userStore.DeleteUser(idUser);
        }

        public UserModel? LoginUser(string login, string password)
        {
            var user = _userStore.GetUserByLoginAndPAssword(login, password);
            return user != null ? _mapper.Map<UserModel>(user) : null;
        }

        public LoginResponse GenerateAuthToken(string login, int userId)
        {
            var claims = new[]
            {
                    //new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Email,login),
                    new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                // Add additional claims as needed
                };


            var jwtSettings = _configuration.GetSection("JwtSettings");

            var privatekey = jwtSettings["SecretKey"];
            var key = Encoding.ASCII.GetBytes(privatekey);


            var expiarationDate = DateTime.UtcNow.AddHours(2);
            // Create a signing key and sign the token
            var securityKey = new SymmetricSecurityKey(key);
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: "Valdoz",
                audience: "Valdoz",
                claims: claims,
                expires: expiarationDate, // Set token expiration as needed
                signingCredentials: creds);

            // Return the serialized token
            string authToken = String.Empty;
            try
            {
                authToken = new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.Message);
            }
            return new LoginResponse { Token=  authToken , ExpierationDate = expiarationDate };
        }

        public bool ChangePassword(int id, ChangePasswordRequestDto changePasswordRequestDto)
        {
            return _userStore.ChangePassword(id, changePasswordRequestDto);
        }

        public IEnumerable<UserModel>? GetUsersWithLowerAccessLevel(int userId)
        {
            var users = _userStore.GetUsersWithLowerAccessLevel(userId);
            return users?.Select(user => _mapper.Map<UserModel>(user));
        }

        public List<UserModel> GetMarketers()
        {
            var users = _userStore.GetMarketers();
            return users.Select(user => _mapper.Map<UserModel>(user)).ToList();
        }

        public List<UserModel> GetUserByProfile(int profileID)
        {
            var users = _userStore.GetUserByProfile(profileID);
            return users.Select(user => _mapper.Map<UserModel>(user)).ToList();
        }

    }
}
