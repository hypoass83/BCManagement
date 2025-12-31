using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTO.CandDocs
{
    public class CandidateAutoFillDto
    {
        public string? CandidateName { get; set; }
        public string? CandidateNumber { get; set; }
        public string? CentreCode { get; set; }
        public bool IsConfidenceLow { get; set; }
    }
}
