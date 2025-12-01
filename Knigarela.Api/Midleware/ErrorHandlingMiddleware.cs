namespace Knigarela.Api.Midleware
{
    using System.Net;
    using Serilog;

    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Unhandled exception while processing {Path}", context.Request.Path);

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var result = new
                {
                    error = "Internal server error",
                    message = ex.Message,
                    path = context.Request.Path
                };

                await context.Response.WriteAsJsonAsync(result);
            }
        }
    }

}
