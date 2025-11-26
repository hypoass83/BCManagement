using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTO.CandDocs
{
    public class SearchDocumentRequestDTO
    {
        public string CandidateName { get; set; } = "";
        public string Candidatenumber { get; set; } = "";
        public string centerNumber { get; set; } = "";
    }
}
