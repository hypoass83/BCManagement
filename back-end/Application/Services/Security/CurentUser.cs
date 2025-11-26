using Domain.Models;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.InterfacesServices.Security;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Domain.Models.Security;
using Domain.Entities.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Domain.DTO;
using Microsoft.AspNetCore.Http;
using AutoMapper;



namespace Application.Service
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IUserStore _userStore;
        private readonly IConfiguration _configuration;

        private readonly IMapper _mapper;

        private readonly IHttpContextAccessor _httpContextAccessor;



        public CurrentUserService(IUserStore userService, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _userStore = userService;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;

        }

        public UserModel? GetCurentUser()
        {
            var context = _httpContextAccessor.HttpContext;
            var claims = context.User;
            var id = claims.FindFirst(ClaimTypes.NameIdentifier);
            if (id == null)
            {
                return null;
            }
            return _mapper.Map<UserModel>(_userStore.GetUserById(int.Parse(id.Value)));
        }

        public int? GetCurentUserId()
        {
            var context = _httpContextAccessor.HttpContext;
            var claims = context.User;
            var id = claims.FindFirst(ClaimTypes.NameIdentifier);

            if (id == null)
            {
                return null;
            }
            return int.Parse(id.Value);
        }


    }
}
