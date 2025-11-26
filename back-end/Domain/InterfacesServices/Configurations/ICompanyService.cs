using Domain.Entities.Configurations;
using Domain.InterfacesServices;
using Domain.Models.Configurations;

namespace Domain.InterfacesServices.Configurations
{
    public interface ICompanyService : IService<CompanyModel, Company>
    {
    }
}

