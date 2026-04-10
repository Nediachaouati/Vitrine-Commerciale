using System.Net;
using System.Text.Json;
using backendPortfolio.Repositories;
namespace backendPortfolio.Utlis
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IDbExceptionLogger logger)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                // log global
                await logger.LogAsync(ex, "GlobalExceptionMiddleware", context.Request.Path);

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var response = new
                {
                    message = "Une erreur interne est survenue.",
                    path = context.Request.Path.Value,
                    status = 500
                };

                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
        }



    }
}
