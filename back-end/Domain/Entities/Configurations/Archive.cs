namespace Domain.Entities.Configurations
{
    public class Archive
    {
        public int ArchiveID { get; set; }
        public string FileName { get; set; }
        public string FileBase64 { get; set; }
        public string ContentType { get; set; }
    }
}