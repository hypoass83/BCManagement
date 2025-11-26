using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Localisation
{
    public class Country
    {
        public int CountryID { get; set; }
        [StringLength(100)]

        public string CountryCode { get; set; }
        public string CountryLabel { get; set; }
        public virtual ICollection<Region> Regions { get; set; }

    }

}
