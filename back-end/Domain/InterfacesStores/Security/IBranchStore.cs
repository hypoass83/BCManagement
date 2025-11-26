
using Domain.Entities.Configurations;
using Domain.Entities.Security;
using System.Collections.Generic;

namespace Domain.InterfacesStores.Security
{
    public interface IBranchStore 
    {
        public Branch? CreateBranch(Branch branch);
        public Branch? GetBranchById(int id);
        public IEnumerable<Branch>? GetAllBranchs();
        public Branch? UpdateBranch(Branch branch);
        public bool DeleteBranch(int id);
    }
}
