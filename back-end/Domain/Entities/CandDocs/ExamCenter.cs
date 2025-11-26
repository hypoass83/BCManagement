using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.CandDocs
{
    public class ExamCenter
    {
        public int Id { get; set; }
        public int CenterNumber { get; set; }
        public string CenterName { get; set; } = "";
        public string Region { get; set; } = "";
        public string Division { get; set; } = "";
        public string SubDivision { get; set; } = "";

        public virtual ICollection<CandidateDocument> CandidateDocuments { get; set; } 
    }
}
