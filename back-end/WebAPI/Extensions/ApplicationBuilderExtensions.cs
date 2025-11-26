namespace WebAPI.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder ConfigureSwaggerUI(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
            });

            return app;
        }

        public static IApplicationBuilder ConfigureCors(this IApplicationBuilder app)
        {
            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true)
                .AllowCredentials());

            return app;
        }

        public static IApplicationBuilder ConfigureMiddlewarePipeline(this IApplicationBuilder app)
        {
            app.UseMiddleware<MouchardMiddleware>();
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

            return app;
        }
    }
}
