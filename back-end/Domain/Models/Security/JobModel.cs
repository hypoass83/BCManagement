using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models.Configurations;

namespace Domain.Models.Security
{
    public class JobModel
    {
        public int JobID { get; set; }

        [Required]
        public string JobLabel { get; set; }
        public string JobDescription { get; set; }
        public string JobCode { get; set; }

        
        public int DepartmentID { get; set; }
        public virtual DepartmentModel? Department { get; set; }
    }
}
