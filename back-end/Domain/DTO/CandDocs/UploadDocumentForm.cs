using Microsoft.AspNetCore.Http;

public class UploadDocumentForm
{
    public IFormFile File { get; set; }

    public int ExamYear { get; set; }
    public int ExamCode { get; set; }
    public string CenterNumber { get; set; }
}
