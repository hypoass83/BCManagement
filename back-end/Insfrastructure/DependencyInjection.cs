using Domain.InterfacesStores.Configurations;
using Domain.InterfacesStores.CandDocs;
using Domain.InterfacesStores.Localisation;
using Domain.InterfacesStores.Security;
using Infrastructure.Stores.Configurations;
using Infrastructure.Stores.Localisation;
using Infrastructure.Stores.Security;
using Insfrastructure.Stores;
using Microsoft.Extensions.DependencyInjection;
using BCDocumentManagement.Infrastructure.Services.CandDocs;
using BCDocumentManagement.Infrastructure.Stores.CandDocs;
using Domain.InterfacesServices.CandDocs;
using Insfrastructure.Services.CandDocs;
using Microsoft.Extensions.Configuration;

namespace Insfrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureStores(this IServiceCollection services)
        {

            services.AddSingleton<ITesseractService>(sp =>
            {
                var config = sp.GetRequiredService<IConfiguration>();
                var tessPath = config["Tesseract:TessDataPath"] ?? "tessdata";
                return new TesseractService(tessPath);
            });

            // Security
            services.AddScoped<IUserStore, UserStore>();
            services.AddScoped<IJobStore, JobStore>();
            services.AddScoped<IBranchStore, BranchStore>();
            services.AddScoped<IProfileStore, ProfileStore>();
            services.AddScoped<IMouchardStore, MouchardStore>();

            // Localisation
            services.AddScoped<ICountryStore, CountryStore>();
            services.AddScoped<IRegionStore, RegionStore>();
            services.AddScoped<ITownStore, TownStore>();
            services.AddScoped<IQuarterStore, QuarterStore>();

            // Configurations
            services.AddScoped<ICompanyStore, CompanyStore>();
            services.AddScoped<IArchiveStore, ArchiveStore>();

            services.AddScoped<IPdfSplitService, PdfSplitService>();
            services.AddScoped<IOcrService, OcrService>();
            services.AddScoped<IFileStore, FileStore>();
            services.AddScoped<ICandidateRepository, CandidateRepository>();

            services.AddSingleton<IPdfTextExtractor, PdfPigTextExtractor>();
            services.AddSingleton<ICandidateParser, CandidateParser>();

            return services;
        }
    }
}

