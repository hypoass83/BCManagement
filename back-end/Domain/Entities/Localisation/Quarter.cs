using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Localisation
{
    public class Quarter
    {
        public int QuarterID { get; set; }
        [StringLength(100)]

        public string QuarterCode { get; set; }
        public string QuarterLabel { get; set; }
        public int TownID { get; set; }
        [ForeignKey("TownID")]
        public virtual Town Town { get; set; }
        public virtual ICollection<Adress> Adress { get; set; }
        
    }

}
