using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.CandDocs.Queries
{
    public class SearchDocumentQuery
    {
        public string CandidateName { get; set; }
        public string CandidateNumber { get; set; }
        public string CenterNumber { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }
}
