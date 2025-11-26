using Domain.Entities;using Infrastructure.Context;
using Domain.Entities.Localisation;
using Domain.Models.Localisation;
using Domain.InterfacesStores.Localisation;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Stores.Localisation
{
    public class QuarterStore : Store<Quarter>, IQuarterStore
    { 


        public QuarterStore(FsContext dbContext) : base(dbContext)
        {
        }

    }
}