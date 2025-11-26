using Domain.Entities.Configurations;
using Domain.InterfacesStores.Configurations;
using Infrastructure.Context;

namespace Infrastructure.Stores.Configurations
{
    public class CompanyStore : Store<Company>, ICompanyStore
    {
        public CompanyStore(FsContext dbContext) : base(dbContext)
        {
        }
    }
}

