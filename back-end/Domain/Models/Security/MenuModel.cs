using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Security
{
    public class MenuModel
    {
        public int MenuID { get; set; }
        public string MenuCode { get; set; }
        public string MenuLabel { get; set; }
        public string MenuDescription { get; set; }
        public string MenuController { get; set; }
        public bool MenuState { get; set; }
        public string MenuPath { get; set; }
        public string MenuIcon { get; set; }

        public bool MenuFlat { get; set; }
        public int IsShortcut { get; set; }
        public int ModuleID { get; set; }
       // public Module Module { get; set; }
        public int AppearanceOrder { get; set; }
        public bool MenuStatus { get; set; }
        public virtual ICollection<SubMenuModel> SubMenus { get; set; }
        public virtual ICollection<ActionMenuProfileModel> ActionMenuProfiles { get; set; }
    }
}
