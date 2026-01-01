using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Constants
{
    public static class ExamConstants
    {
        public static readonly IReadOnlyDictionary<string, string> Exams =
            new Dictionary<string, string>
            {
                { "5100", "GCE Ordinary Level" },
                { "7100", "GCE Advanced Level" },
                { "5101", "TVEE Intermediate Level" },
                { "7101", "TVEE Advanced Level" }
            };
    }
}
