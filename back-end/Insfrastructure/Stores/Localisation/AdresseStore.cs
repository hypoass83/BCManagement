using Domain.Entities;using Infrastructure.Context;
using Domain.Entities.Localisation;
using Domain.Models.Localisation;
using Domain.InterfacesStores.Localisation;

namespace Infrastructure.Stores.Localisation
{
    public class AdressStore :   Store<Adress>, IAdressStore
    {
 
 
        public AdressStore(FsContext dbContext) : base(dbContext)
        {
        }
  
   

      
    }
}