using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTO.Dashboard
{
    public class ExamDashboardCardDto
    {
        public string ExamCode { get; set; } = "";
        public string ExamLabel { get; set; } = "";
        public int TotalCentres { get; set; }
        public int SuccessCentres { get; set; }
        public int ErrorCentres { get; set; }
        public double SuccessRate { get; set; }

        // 🆕 Candidats
        public int TotalCandidates { get; set; }
        public int SuccessCandidates { get; set; }
        public int ErrorCandidates { get; set; }
    }

}
