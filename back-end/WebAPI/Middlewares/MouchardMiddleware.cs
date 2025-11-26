using Domain.Entities.Security;
using Domain.InterfacesServices.Security;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.Models.Security;

public class MouchardMiddleware
{
    private readonly RequestDelegate _next;


    public MouchardMiddleware(RequestDelegate next)
    {
        _next = next;

    }

    public async Task Invoke(
        HttpContext context,
        IMouchardService _moucharService,
        ICurrentUserService currentUserService)
    {
        var start = DateTime.UtcNow;

        await _next(context);

        if (context.Request.Method != "GET")
        {
            var remoteIp = context.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            var localIp = context.Connection.LocalIpAddress?.ToString() ?? "127.0.0.1";

            var mouchard = new Mouchard
            {
                MoucharDate = start,
                SneackHour = start.ToString("HH:mm"),
                UserID = context.User.Identity.IsAuthenticated ? currentUserService.GetCurentUserId() : null,
                MoucharAction = context.Response.StatusCode == 200 ? "SUCCESS" : "FAILURE",
                MoucharDescription = $"Request to {context.Request.Path}",
                MoucharOperationType = context.Request.Method,
                MoucharProcedureName = context.Request.Path,
                MoucharHost = remoteIp,
                MoucharHostAdress = localIp,
                BranchID = context.User.Identity.IsAuthenticated ? currentUserService.GetCurentUser().BranchID : 1,
                MoucharBusinessDate = DateTime.UtcNow
            };

            _moucharService.LogAction(mouchard);
        }
    }

}



