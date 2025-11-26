using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public record ProfileModel
    {
        public int ProfileID { get; set; }
        public string ProfileCode { get; set; }
        public string ProfileLabel { get; set; }
        public string ProfileDescription { get; set; }
        public bool ProfileState { get; set; }
        public int ProfileLevel { get; set; }
    }
}
