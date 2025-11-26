namespace Domain.DTO;

public record LoginRequestDtoIn
{
    public string Login { get; set; }
    public string Password { get; set; }
}