namespace Domain.Models.Configurations
{
    public class ArchiveModel
    {
        public int ArchiveID { get; set; }
        public string FileName { get; set; }
        public string FileBase64 { get; set; }
        public string ContentType { get; set; }
    }
}