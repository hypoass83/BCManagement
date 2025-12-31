using Application.Features.CandDocs.Commands;
using Application.Features.CandDocs.Queries;
using Application.Service;
using Application.Service.Configurations;
using Application.Service.Localisation;
using Domain.InterfacesServices.Configurations;
using Domain.InterfacesServices.Security;
using Domain.InterfacesStores.Security;
using Microsoft.Extensions.DependencyInjection;

namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Security
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IJobService, JobService>();
            services.AddScoped<IBranchService, BranchService>();
            services.AddScoped<IProfileService, ProfileService>();
            services.AddScoped<IMouchardService, MouchardService>();

            // Localisation
            services.AddScoped<ICountryService, CountryService>();
            services.AddScoped<IRegionService, RegionService>();
            services.AddScoped<ITownService, TownService>();
            services.AddScoped<IQuarterService, QuarterService>();

            // Configurations
            services.AddScoped<ICompanyService, CompanyService>();

            // register handlers / services
            services.AddScoped<UploadBatchHandler>();
            //services.AddScoped<SearchDocumentHandler>();
            services.AddScoped<ExtractOcrFromPage1Handler>();
            services.AddScoped<GetImportedBatchesHandler>();

            services.AddScoped<GetImportErrorsHandler>();
            services.AddScoped<GetInvalidCentreCodesQuery>();
            services.AddScoped<GetCandidateDocumentForEditQuery>();
            services.AddScoped<SearchDocumentHandler>();

            return services;
        }
    }
}

