using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities.Localisation;


namespace Domain.Entities.Configurations
{
    public class Branch
    {
        public int BranchID { get; set; }
        public string BranchCode { get; set; }
        public string BranchAbbreviation { get; set; }
        public string BranchName { get; set; }
        public string BranchDescription { get; set; }

        public int AdressID { get; set; }
        public virtual Adress Adress { get; set; }

        // Relation avec Company
        public int CompanyID { get; set; }
        public virtual Company Company { get; set; }
    }
}

