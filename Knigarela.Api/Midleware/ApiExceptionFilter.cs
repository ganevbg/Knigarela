namespace Knigarela.Api.Midleware
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;
    using Serilog;
    using System.Net;

    public class ApiExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            var ex = context.Exception;

            Log.Error(ex, "Unhandled exception in API at path {Path}", context.HttpContext.Request.Path);

            var result = new
            {
                error = ex.GetType().Name,
                message = ex.Message,
                path = context.HttpContext.Request.Path
            };

            context.Result = new JsonResult(result)
            {
                StatusCode = (int)HttpStatusCode.InternalServerError
            };
            context.ExceptionHandled = true;
        }
    }
}
