using Domain.Models;
using Domain.Models.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTO
{
    public class CreateOrUpdateProfileRequest
    {
        public List<AssignMenu>? Menus { get; set; }
        public List<AssignSubMenu>? SubMenus { get; set; }
        public ProfileModel Profile { get; set; }
    }
}
