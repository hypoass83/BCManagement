using Domain.Models.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTO
{
    public class UpdateActionModuleRequest
    {
        public List<ActionMenuProfileModel>? Menu { get; set; }
        public List<ActionSubMenuProfileModel>? Sub { get; set; }
    }
}

