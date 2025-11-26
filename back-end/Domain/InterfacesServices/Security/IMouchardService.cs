
using Domain.Entities.Security;

namespace Domain.InterfacesStores.Security
{
    public interface IMouchardService
    {
        public void LogAction(Mouchard mouchard);
    }
}
