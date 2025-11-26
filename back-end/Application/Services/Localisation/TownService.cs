using Application.Service;
using Domain.Entities.Localisation;
using Domain.InterfacesStores.Localisation;
using Domain.InterfacesServices.Security;
using Domain.Models.Localisation;
using AutoMapper;

namespace Application.Service.Localisation
{ 
    public class TownService : GenericService<TownModel, Town>, ITownService
    {
        public TownService(ITownStore store, IMapper mapper)
            : base(store, mapper)
        {
        }
    }
}
