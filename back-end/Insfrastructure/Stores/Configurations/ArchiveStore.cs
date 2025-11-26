using Domain.Entities.Configurations;
using Domain.InterfacesStores.Configurations;
using Infrastructure.Context;

namespace Infrastructure.Stores.Configurations
{
    public class ArchiveStore : Store<Archive>, IArchiveStore
    {
        public ArchiveStore(FsContext dbContext) : base(dbContext)
        {
        }
    }
}

