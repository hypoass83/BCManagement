using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTO
{
    public class AdvancedProfileDTO
    {
        public string ModuleName {  get; set; }
        public string MenuName { get; set; }
        public int MenuID { get; set; }
        public int ActionMenuProfile {  get; set; }
        public bool IsSubMenu { get; set; }=false;
        public bool Update { get; set; } = false;
        public bool Add { get; set; } = false;
        public bool Remove { get; set; } = false;
    }
}
