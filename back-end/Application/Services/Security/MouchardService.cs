
using Domain.Entities.Security;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.InterfacesServices.Security;

namespace Application.Service
{
    public class MouchardService : IMouchardService
    {
        private readonly IMouchardStore _mouchardStore;

        public MouchardService(IMouchardStore mouchardStore)
        {
            _mouchardStore = mouchardStore;
        }

      

        public void LogAction(Mouchard mouchard)
        {
            _mouchardStore.LogAction(mouchard);
        }
    }
}
