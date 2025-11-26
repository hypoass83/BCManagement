using Domain.Models;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.InterfacesServices.Security;
using Domain.InterfacesStores.Localisation;
using Domain.Models.Localisation;
using Domain.Entities.Localisation;
using AutoMapper;

namespace Application.Service.Localisation
{
    public class QuarterService : GenericService<QuarterModel, Quarter>, IQuarterService
    {
        public QuarterService(IQuarterStore store, IMapper mapper)
            : base(store, mapper)
        {
        }
    }
}