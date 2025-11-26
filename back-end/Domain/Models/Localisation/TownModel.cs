using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Localisation
{
    public class TownModel
    {
        public int TownID { get; set; }

        [StringLength(100)]

        public string TownCode { get; set; }
        public string TownLabel { get; set; }
        public int RegionID { get; set; }

        public virtual RegionModel? Region { get; set; }

    }

}
