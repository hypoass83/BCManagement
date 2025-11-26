using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Security
{
    public class Module
    {
        public int ModuleID { get; set; }
        public string ModuleCode { get; set; }
        public string? ModuleLabel { get; set; }
        public string? ModuleDescription { get; set; }
        public string? ModuleImagePath { get; set; }
        public string? ModulePressedImagePath { get; set; }
        public string? ModuleDisabledImagePath { get; set; }
        public string? ModuleArea { get; set; }
        public bool ModuleState { get; set; }
        public int AppearanceOrder { get; set; }
        public bool ModuleStatus { get; set; }

        public virtual ICollection<Menu> Menus { get; set; }
    }
}
