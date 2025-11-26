
using Domain.Entities.Security;

namespace Domain.InterfacesStores.Security
{
    public interface IMouchardStore
    {
        public void LogAction(Mouchard mouchard);
        public bool InsertOperation(int UserID, string Action, string Description, string ProcedureName, DateTime BusinessDate, int BranchID);
    }
}
