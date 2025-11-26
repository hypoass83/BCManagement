using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.CandDocs.Commands
{
    public class UploadBatchResult
    {
        public int TotalCandidates { get; set; }
        public List<string> SavedFilePaths { get; set; } = new();
        public List<string> Errors { get; set; } = new List<string>();
    }
}
