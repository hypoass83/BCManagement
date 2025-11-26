using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Security
{
    public class Sex
    {
      
        public int SexID { get; set; }
        public string SexLabel { get; set; }

        public string SexCode { get; set; }
         
    }
}
