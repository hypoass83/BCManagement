using Domain.Models.Localisation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Domain.Models.Security
{
    public class GlobalPersonModel
    {
        public int GlobalPersonID { get; set; }
        public string Name { get; set; }
        public string? Tiergroup { get; set; }
        public string? Description { get; set; }
        public string? CNI { get; set; }

        public int AdressID { get; set; }
        public virtual AdressModel? Adress { get; set; }
    }
}


