using System;
using backendPortfolio.Repositories;
using BackendPortfolio.Models;

namespace BackendPortfolio.Repositories
{
    public class DbExceptionLogger : IDbExceptionLogger
    {
        private readonly IDbContextFactory<VitrineDbContext> _factory;


        public DbExceptionLogger(IDbContextFactory<VitrineDbContext> factory)
        {
            _factory = factory;
        }

        public async Task LogAsync(Exception ex, string repository, string function)
        {
            try
            {
                // si DbUpdateException => prendre inner SqlException si dispo
                var realEx = ExtractSqlException(ex);

                var exceptionDb = BuildExceptionDb(realEx, repository, function);

                await using var logContext = await _factory.CreateDbContextAsync();
                logContext.ExceptionDbs.Add(exceptionDb);
                await logContext.SaveChangesAsync();
            }
            catch
            {
                // ne JAMAIS relancer ici => sinon boucle
            }
        }

        private Exception ExtractSqlException(Exception ex)
        {
            if (ex is DbUpdateException dbEx && dbEx.InnerException != null)
                return dbEx.InnerException; // souvent SqlException

            return ex;
        }

        private ExceptionDb BuildExceptionDb(Exception ex, string repository, string function)
        {
            return new ExceptionDb
            {
                Message = ex.Message,
                Stacktrace = ex.StackTrace,
                Data = JsonSerializer.Serialize(ex.Data),
                Hresult = ex.HResult.ToString(),
                FunctionName = function,
                Repository = repository,
                InPlaintext = ex.ToString(),
                CreateDate = DateTime.UtcNow
            };
        }
    }
}

