// using Application.Domain;
using Domain.DTO;
using Domain.Models;

using Microsoft.AspNetCore.Mvc;
using Domain.InterfacesServices.Security;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/auth/")]
    public class AuthentificationController : ControllerBase
    {
        IUserService _userService;
        ICurrentUserService _currentUserService;

        public AuthentificationController(IUserService userService, ICurrentUserService currentUserService)
        {
            _userService = userService;
        }


        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequestDtoIn model)
        {
            var user = _userService.LoginUser(model.Login, model.Password);


            if (user == null)
            {
                return Unauthorized(new
                {
                    Status = 400,
                    Success = false,
                    Message = "Invalid username or password",
                });
            }
            var token = _userService.GenerateAuthToken(model.Login, user.GlobalPersonID);

            return Ok(new LoginResponse { Token = token.Token, ExpierationDate = token.ExpierationDate, Message = "Login succesfull", });
        }

        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [HttpPost("change-password")]
        public IActionResult ChangePassword(ChangePasswordRequestDto model)
        {
            if (int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                var user = _userService.GetUserById(userId);
                if (user == null)
                {
                    return NotFound();
                }

                return Ok(_userService.ChangePassword(userId, model));
            }

            return Ok(false);

        }



        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [HttpPost("change-password-2")]
        public IActionResult ChangePassword2(ChangePasswordRequestDto model)
        {
            if (int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                var user = _userService.GetUserById(userId);
                if (user == null)
                {
                    return NotFound();
                }

                return Ok(_userService.ChangePassword(userId, model));
            }

            return Ok(false);

        }
    }
}