using Application.Service;
using Domain.Entities.Localisation;
using Domain.InterfacesStores.Localisation;
using Domain.InterfacesServices.Security;
using Domain.Models.Localisation;
using AutoMapper;

namespace Application.Service.Localisation
{ 
    public class CountryService : GenericService<CountryModel, Country>, ICountryService
    {
        public CountryService(ICountryStore store, IMapper mapper)
            : base(store, mapper)
        {
        }
    }
}
