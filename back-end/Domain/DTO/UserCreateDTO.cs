using Domain.Models.Localisation;
using Domain.Models.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTO
{
    public class UserCreateDTO
    {
        public int GlobalPersonID { get; set; }
        public string? Code { get; set; }
        public string? UserLogin { get; set; }
        public int UserAccessLevel { get; set; }
        public bool UserAccountState { get; set; }
        public int JobID { get; set; }
        public AdressCreateDTO Adress { get; set; }
        public string Name { get; set; }
        public string? Tiergroup { get; set; }
        public string Description { get; set; }
        public string CNI { get; set; }

        public int? ProfileID { get; set; }

        public int BranchID { get; set; }

        public int SexID { get; set; }

        public bool IsConnected { get; set; }
        public bool IsMarketer { get; set; }
        public bool IsSeller { get; set; }
    }
}
