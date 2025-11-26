using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Localisation
{
    public class Town
    {
        public int TownID { get; set; }
        
        [StringLength(100)]
        
        public string TownCode { get; set; }
        public string TownLabel { get; set; }
        public int RegionID { get; set; }
        [ForeignKey("RegionID")]
        public virtual Region Region { get; set; }
        public virtual ICollection<Quarter> Quarters { get; set; }
        
    }

}
