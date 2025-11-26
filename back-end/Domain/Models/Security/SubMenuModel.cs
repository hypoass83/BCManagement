using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Security
{
    public class SubMenuModel
    {
        public int SubMenuID { get; set; }
        public string SubMenuCode { get; set; }
        public string SubMenuLabel { get; set; }
        public string SubMenuDescription { get; set; }
        public string SubMenuController { get; set; }
        public bool SubMenuState { get; set; }
        public string SubMenuPath { get; set; }
        public string? SubMenuIcon { get; set; }
        public int IsShortcut { get; set; }
        public int MenuID { get; set; }
        // public virtual MenuModel Menu { get; set; }
        public int AppearanceOrder { get; set; }
        public bool SubMenuStatus { get; set; }

        public virtual ICollection<ActionSubMenuProfileModel> ActionSubMenuProfiles { get; set; }
    }
}
