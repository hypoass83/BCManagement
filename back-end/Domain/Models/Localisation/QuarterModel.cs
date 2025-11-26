using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Localisation
{
    public class QuarterModel
    {
        public int QuarterID { get; set; }
        [StringLength(100)]

        public string QuarterCode { get; set; }
        public string QuarterLabel { get; set; }
        public int TownID { get; set; }

        public virtual TownModel? Town { get; set; }
    }

}
