namespace Domain.InterfacesServices.CandDocs
{
    public interface IPdfSplitService
    {
        Task<List<byte[]>> SplitPdfByPageAsync(byte[] pdfBytes);
    }
}