using Domain.Models.Localisation;
using Domain.Entities.Localisation;
using Domain.InterfacesServices;

namespace Domain.InterfacesServices.Security
{
    public interface ICountryService : IService<CountryModel, Country>
    {
    }
}
