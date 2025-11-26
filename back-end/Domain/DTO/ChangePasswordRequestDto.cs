namespace Domain.DTO;

public record ChangePasswordRequestDto
{
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}