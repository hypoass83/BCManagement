using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Exceptions
{
    public class GlobalExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            int statusCode = 500;

            string message = context.Exception.Message;
            if (message.Contains("not found")){
                statusCode = 404;
            }
           
            if (context.Exception is CustomException customException)
            {
                statusCode = customException.StatusCode;
                message = customException.Message;
            }
            else if (context.Exception is DbUpdateException)
            {
                statusCode = 403;

                var baseException = GetInnermostException(context.Exception);
                if (baseException != null && baseException.Message != null)
                {
                    string innerMessage = baseException.Message;

                    if (innerMessage.Contains("DELETE statement conflicted"))
                    {
                        message = ParseDeleteErrorMessage(innerMessage);
                    }
                    else if (innerMessage.Contains("Cannot insert duplicate key row"))
                    {
                        message = ParseUniqueKeyErrorMessage(innerMessage);
                    }
                    else
                    {
                        message = innerMessage;
                    }
                }
            }

            else if (message.Contains("Cannot insert duplicate key row"))
            {
                message = ParseUniqueKeyErrorMessage(message);
            }
            context.Result = new JsonResult(new
            {
                error = message
            })
            {
                StatusCode = statusCode
            };

            context.ExceptionHandled = true;
        }

        private static Exception GetInnermostException(Exception ex)
        {
            while (ex.InnerException != null)
            {
                ex = ex.InnerException;
            }
            return ex;
        }

        public static string ParseDeleteErrorMessage(string errorMessage)
        {
            string pattern = @"The DELETE statement conflicted with the REFERENCE constraint "".*"". The conflict occurred in database "".*"", table ""dbo\.(.*)"", column '(.*)'\.";
            var match = Regex.Match(errorMessage, pattern);

            if (match.Success)
            {
                string table = match.Groups[1].Value;
                string column = match.Groups[2].Value;

                string entityName = Regex.Replace(column, "ID$", "", RegexOptions.IgnoreCase);
                string collectionName = Regex.Replace(table, "s$", "", RegexOptions.IgnoreCase);

                return $"Cannot delete this {entityName} because it is used by a {collectionName}. Please remove the related {collectionName}s first.";
            }

            return errorMessage;
        }

        public static string ParseUniqueKeyErrorMessage(string errorMessage)
        {
            string pattern = @"unique index 'IX_(\w+?)_(\w+)'";
            var match = Regex.Match(errorMessage, pattern);

            if (match.Success)
            {
                string table = match.Groups[1].Value;
                string column = match.Groups[2].Value;

                return $"The value of '{column}' is already used in '{table}'. Please choose a different value.";
            }

            return "This value is already used. Please choose a different one.";
        }
    }
}
