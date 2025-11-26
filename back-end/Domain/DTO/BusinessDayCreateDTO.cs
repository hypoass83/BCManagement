namespace Domain.DTO;

public record BusinessDayCreateDTO
{
    public int BranchID { get; set; }
    public DateTime dateOperation { get; set; }
}