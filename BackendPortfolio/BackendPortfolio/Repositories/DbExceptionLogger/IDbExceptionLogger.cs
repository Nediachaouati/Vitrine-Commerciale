namespace backendPortfolio.Repositories
{
    public interface IDbExceptionLogger
    {
        Task LogAsync(Exception ex, string repository, string function);
    }
}

