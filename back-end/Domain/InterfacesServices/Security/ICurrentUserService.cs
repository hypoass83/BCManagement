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
    public interface ICurrentUserService
    {
        public UserModel? GetCurentUser();

        public int? GetCurentUserId();

         
    }
}
