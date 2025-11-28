using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.CandDocs
{
    public class SimpleResult
    {
        public bool Success { get; set; } = false;

        public string Message { get; set; }

        public string Error { get; set; }

        public string NewFilePath { get; set; }
    }
}
