using Domain.Entities.Localisation;

namespace Domain.Entities.Configurations
{
    public class Company
    {
        public int CompanyID { get; set; }
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }
        public string CompanyAbbreviation { get; set; }
        public string CompanyDescription { get; set; }
   
        public int? AdressID { get; set; }
        public virtual Adress Adress { get; set; }

        public int? ArchiveID { get; set; }
        public virtual Archive Archive { get; set; }

 
    }
}