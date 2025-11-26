using Domain.Entities;using Infrastructure.Context;
using Domain.Entities.Localisation;
using Domain.Models.Localisation;
using Domain.InterfacesStores.Localisation;

namespace Infrastructure.Stores.Localisation
{ 
    public class CountryStore :  Store<Country>, ICountryStore
    {


        public CountryStore(FsContext dbContext) : base(dbContext)
        {
        }

    }
}