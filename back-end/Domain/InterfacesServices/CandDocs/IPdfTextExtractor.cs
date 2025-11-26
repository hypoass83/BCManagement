using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesServices.CandDocs
{
    public interface IPdfTextExtractor
    {
        string ExtractText(byte[] pdfBytes);
    }
}
