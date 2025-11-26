using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities.Configurations;

namespace Domain.Entities.Security
{
    public class User : People
    {   
        public string? Code { get; set; }
        public string? UserLogin { get; set; }
        public string? UserPassword { get; set; }
        public int UserAccessLevel { get; set; }
        public bool UserAccountState { get; set; }

        public int JobID { get; set; }
        public virtual Job Job { get; set; }

        public int? ProfileID { get; set; }
        public virtual Profile? Profile { get; set; }

        public int? BranchID { get; set; }
        public virtual Branch? Branch { get; set; }

    }
}
