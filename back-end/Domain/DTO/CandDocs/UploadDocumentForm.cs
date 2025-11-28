using Microsoft.AspNetCore.Http;

public class UploadDocumentForm
{
    public IFormFile File { get; set; }

    public int ExamYear { get; set; }
    public string ExamCode { get; set; }
    public string CenterNumber { get; set; }
    public string ServerSourceFilePath { get; set; }
}
