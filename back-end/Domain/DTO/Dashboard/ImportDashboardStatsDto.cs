using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTO.Dashboard
{
    public class ImportDashboardStatsDto
    {
        public int Session { get; set; }
        public List<ExamDashboardCardDto> Exams { get; set; } = new();
    }
}
