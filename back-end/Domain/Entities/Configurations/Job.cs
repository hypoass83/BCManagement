using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Configurations
{
    public class Job
    {
        public int JobID { get; set; }
        public string JobLabel { get; set; }
        public string JobDescription { get; set; }
        public string JobCode { get; set; }

        //// Relation avec Department
        //public int DepartmentID { get; set; }
        //public virtual Department Department { get; set; }
    }

}
