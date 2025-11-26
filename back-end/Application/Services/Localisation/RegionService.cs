using Application.Service;
using Domain.Entities.Localisation;
using Domain.InterfacesStores.Localisation;
using Domain.InterfacesServices.Security;
using Domain.Models.Localisation;
using AutoMapper;

namespace Application.Service.Localisation
{ 
    public class RegionService : GenericService<RegionModel, Region>, IRegionService
    {
        public RegionService(IRegionStore store, IMapper mapper)
            : base(store, mapper)
        {
        }
    }
}
