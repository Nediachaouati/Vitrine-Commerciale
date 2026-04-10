namespace BackendPortfolio.DTO.kc
{
    public class CreateUserDto
    {
        public required string Email { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        // "vitrine-collaborator" ou "vitrine-manager"
        public required string KcRole { get; set; }
    }
}