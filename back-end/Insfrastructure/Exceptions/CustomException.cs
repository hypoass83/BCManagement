using System;

namespace Infrastructure.Exceptions
{
    public class CustomException : Exception
    {
        public int StatusCode { get; }

        public CustomException(string message="resource not found", int statusCode = 400) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
