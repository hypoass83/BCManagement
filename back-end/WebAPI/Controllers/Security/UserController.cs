// using Application.Domain;
using Domain.DTO;
using Domain.Models;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Microsoft.AspNetCore.Mvc;
using Domain.InterfacesServices.Security;
using Domain.Models.Security;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/users/")]
    [Authorize]
    public class UserController : ControllerBase
    {
        IUserService _userService;
        ICurrentUserService _currentUserService;

        public UserController(IUserService userService, ICurrentUserService currentUserService)
        {
            _userService = userService;
            _currentUserService = currentUserService;
        }

        [HttpPost]
        public async Task<UserModel?> CreateUser(UserCreateDTO userModel)
        {
            return await _userService.CreateUser(userModel);
        }


        [HttpGet("{userId}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<UserModel> GetUserById(int userId)
        {
            var user = _userService.GetUserById(userId);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("current-user")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<UserModel> GetCurrentUSer()
        {

            return Ok(_currentUserService.GetCurentUser());
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<UserModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<UserModel>> GetAllUsers()
        {
            var users = _userService.GetAllUsers();
            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }
        [HttpGet("marketers")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<UserModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<UserModel>> GetMarketers()
        {
            var users = _userService.GetMarketers();
            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        [HttpGet("users/{profileID}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<UserModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<UserModel>> GetUserByProfile(int profileID)
        {
            var users = _userService.GetUserByProfile(profileID);
            return Ok(users);
        }

        [HttpGet("users-with-lower-access-level")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<UserModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<UserModel>> GetUsersWithLowerAccessLevel()
        {
            var users = _userService.GetUsersWithLowerAccessLevel(_currentUserService.GetCurentUserId() ?? 0);
            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        [HttpPut]
        public UserModel? UpdateUser(UserCreateDTO userModel)
        {
            var result = _userService.UpdateUser(userModel);

            return result;
        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteUser(int userId)
        {
            var result = _userService.DeleteUser(userId);

            if (!result)
            {
                return NotFound(); // This will return a 404 status code.
            }

            return Ok(true); // This will return a 200 status code with a boolean value.
        }

    }
}