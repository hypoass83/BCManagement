using Domain.DTO.CandDocs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.CandDocs.Commands
{
    public class UploadBatchCommand
    {
        // Using DTO as transfer
        public UploadBatchRequestDTO Request { get; set; }

        public string UploadedBy { get; set; } = string.Empty;
    }
}
