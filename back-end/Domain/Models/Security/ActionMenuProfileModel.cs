using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Security
{
    public class ActionMenuProfileModel : Actions
    {
        public int ProfileID { get; set; }
        public int ActionMenuProfileID { get; set; }
        public int MenuID { get; set; }
        
    }
}
