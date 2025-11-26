using Domain.Models.Security;

namespace Domain.Models.Configurations
{
    public class DepartmentModel
    {
        public int DepartmentID { get; set; }
        public string DepartmentCode { get; set; } 
        public string DepartmentName { get; set; }
        public string DepartmentDescription { get; set; }

        // Relation avec Company
        public int CompanyID { get; set; }
        public virtual CompanyModel? Company { get; set; }


    }
}