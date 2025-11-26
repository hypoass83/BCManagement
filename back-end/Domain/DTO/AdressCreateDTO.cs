using Domain.Models.Localisation;
using Domain.Models.Security;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTO
{
    public class AdressCreateDTO    
    {
        public int AdressID { get; set; }
        public string? AdressPhoneNumber { get; set; }

        [MinLength(9)]
        public string? AdressCellNumber { get; set; }
        public string? AdressFullName { get; set; }
        public string? AdressEmail { get; set; }
        public string? AdressWebSite { get; set; }
        public string? AdressPOBox { get; set; }
        public string? AdressFax { get; set; }
        public int? QuarterID { get; set; }

    }
}
