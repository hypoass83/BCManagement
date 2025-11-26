using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Localisation
{
    public class RegionModel
    {
        public int RegionID { get; set; }
        [StringLength(50)]

        public string RegionCode { get; set; }
        public string RegionLabel { get; set; }

        public int CountryID { get; set; }
        public virtual CountryModel? Country { get; set; }

    }

}
