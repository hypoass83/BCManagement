using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.CandDocs.Commands
{
    public class ExtractOcrFromPage1
    {
        public byte[] PdfFile { get; set; }
        public int PageNumber { get; set; } = 1;
    }
}
