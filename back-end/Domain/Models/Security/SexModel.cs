using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Security
{
    public class SexModel
    {
        public int SexID { get; set; }
        public string SexLabel { get; set; }

         public string SexCode { get; set; }
    }
}
