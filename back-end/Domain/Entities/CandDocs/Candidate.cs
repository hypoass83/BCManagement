using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.CandDocs
{
    public class Candidate
    {
        public int Id { get; set; }
        public int Session { get; set; }
        public int CentreCode { get; set; }
        public int CandNumber { get; set; }
        public string CandName { get; set; } = "";
    }
}
