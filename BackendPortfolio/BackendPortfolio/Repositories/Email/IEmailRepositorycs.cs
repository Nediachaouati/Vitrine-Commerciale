namespace BackendPortfolio.Repositories.Email
{
    public interface IEmailRepositorycs
    {
        Task SendWelcomeEmailAsync(string toEmail, string firstName, string lastName,
                                           string username, string password, string role);
    }
}
