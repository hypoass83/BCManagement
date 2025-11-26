namespace Domain.Models.Security
{
    public class PeopleModel : GlobalPersonModel
    {
        public int SexID { get; set; }
        public SexModel? Sex { get; set; }
        public bool IsConnected { get; set; }
        public bool IsMarketer { get; set; }
        public bool IsSeller { get; set; }
    }
}
