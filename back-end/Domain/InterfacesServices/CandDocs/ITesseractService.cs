using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesServices.CandDocs
{
    public interface ITesseractService
    {
        string ExtractTextFromImage(byte[] imageBytes);
        Task<string> ExtractTextFromPdfAsync(byte[] pdfBytes, int pageNumber = 1);
        Task<string> ExtractTextFromImageAsync(byte[] imageBytes);
    }
}
