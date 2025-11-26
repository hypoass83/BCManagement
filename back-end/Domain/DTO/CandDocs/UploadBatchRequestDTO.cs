using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTO.CandDocs
{
    public class UploadBatchRequestDTO
    {
        public byte[] PdfFile { get; set; }
        public int ExamYear { get; set; }
        public int ExamCode { get; set; }
        public string CenterNumber { get; set; } = "";
    }
}
