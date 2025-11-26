using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Security
{
     public class SubMenu
    {
        public int SubMenuID { get; set; }
        public string SubMenuCode { get; set; }
        public string SubMenuLabel { get; set; }
        public string SubMenuDescription { get; set; }
        public string SubMenuController { get; set; }
        public bool SubMenuState { get; set; }
        public string SubMenuPath { get; set; }
        public string? SubMenuIcon { get; set; }
        public bool IsChortcut { get; set; }
        public int MenuID { get; set; }
        public virtual Menu? Menu { get; set; }
        public int AppearanceOrder { get; set; }
        public virtual ICollection<ActionSubMenuProfile> ActionSubMenuProfiles { get; set; }
    }

}
