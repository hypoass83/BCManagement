using Domain.InterfacesStores.Configurations;
using Domain.InterfacesStores.CandDocs;
using Domain.InterfacesStores.Localisation;
using Domain.InterfacesStores.Security;
using Infrastructure.Stores.Configurations;
using Infrastructure.Stores.Localisation;
using Infrastructure.Stores.Security;
using Insfrastructure.Stores;
using Microsoft.Extensions.DependencyInjection;
using Domain.InterfacesServices.CandDocs;
using Insfrastructure.Stores.CandDocs;
using Infrastructure.Services.CandDocs;
using Infrastructure.Repositories.CandDocs;
using Infrastructure.Stores.CandDocs;


namespace Insfrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureStores(this IServiceCollection services)
        {

            //services.AddSingleton<ITesseractService>(sp =>
            //{
            //    var config = sp.GetRequiredService<IConfiguration>();
            //    var tessPath = config["Tesseract:TessDataPath"] ?? "tessdata";
            //    return new TesseractService(tessPath,"eng");
            //});

            services.AddSingleton<ITesseractService>(provider =>
            {
                string tessdataPath = Path.Combine(Directory.GetCurrentDirectory(), "tessdata");
                return new TesseractService(tessdataPath);
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

            
            services.AddScoped<IOcrService, OcrService>();
            services.AddScoped<IFileStore, FileStore>(sp => new FileStore("D:\\GCEB_PROJECT\\Storage"));
            services.AddScoped<ICandidateRepository, CandidateRepository>();
            services.AddScoped<IImportErrorService, ImportErrorStore>();

            services.AddScoped<ICandidateParser, CandidateParser>();
            services.AddScoped<IAuditRepository, AuditRepository>();

            services.AddHttpContextAccessor();
            return services;
        }
    }
}

