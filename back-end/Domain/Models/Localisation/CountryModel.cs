using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Localisation
{
    public class CountryModel
    {
        public int CountryID { get; set; }
        [StringLength(100)]

        public string CountryCode { get; set; }
        public string CountryLabel { get; set; }

    }

}
