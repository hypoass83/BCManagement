namespace Domain.Entities.Security
{
    public class Menu
    {
        public int MenuID { get; set; }
        public string MenuCode { get; set; }
        public string MenuLabel { get; set; }
        public string MenuDescription { get; set; }
        public string MenuController { get; set; }
        public bool MenuState { get; set; }

        public bool MenuFlat { get; set; }
        public string MenuPath { get; set; }
        public string MenuIconName { get; set; }
        public int IsShortcut { get; set; }
        public int ModuleID { get; set; }
        public virtual Module Module { get; set; }
        public int AppearanceOrder { get; set; }
        public bool MenuStatus { get; set; }

        public virtual ICollection<SubMenu> SubMenus { get; set; }
        public virtual ICollection<ActionMenuProfile> ActionMenuProfiles { get; set; }
    }
}
