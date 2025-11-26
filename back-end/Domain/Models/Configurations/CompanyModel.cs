
using Domain.Models.Localisation;
using Domain.Models.Security;

namespace Domain.Models.Configurations
{
    public class CompanyModel
    {
        public int CompanyID { get; set; }
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }
        public string CompanyAbbreviation { get; set; }
        public string CompanyDescription { get; set; }
   
        public int? AdressID { get; set; }
        public virtual AdressModel Adress { get; set; }

        public int? ArchiveID { get; set; }
        public virtual ArchiveModel? Archive { get; set; }

        
    }
}