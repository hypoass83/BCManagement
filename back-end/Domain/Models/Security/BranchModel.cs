using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTO;
using Domain.Models.Configurations;
using Domain.Models.Localisation;

namespace Domain.Models.Security
{
   public class BranchModel
    {
        public int BranchID { get; set; }
        public string BranchCode { get; set; }
        public string BranchAbbreviation { get; set; }
        public string BranchName { get; set; }
        public string BranchDescription { get; set; }

        public int AdressID { get; set; }
        public virtual AdressModel Adress { get; set; }
        public int CompanyID { get; set; }

        public virtual CompanyModel? Company { get; set; }
    }
}
