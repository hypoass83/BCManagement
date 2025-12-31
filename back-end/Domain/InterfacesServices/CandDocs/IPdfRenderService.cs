using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesServices.CandDocs
{
    public interface IPdfRenderService
    {
        byte[] ConvertPageToImage(string pdfPath, int page, int dpi = 300);
        byte[] ConvertPageToImage(byte[] pdfBytes, int page, int dpi = 300);
        byte[] ConvertFirstPageCinZoneToImage(byte[] pdfBytes, int dpi = 300);
    }
}
