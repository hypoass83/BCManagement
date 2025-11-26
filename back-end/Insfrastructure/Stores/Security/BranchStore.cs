using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.Entities.Security;
using Infrastructure.Context;
using System.Collections.Generic;
using System.Linq;
using Domain.Entities.Configurations;

namespace Infrastructure.Stores.Security
{
    public class BranchStore : IBranchStore
    {
        private readonly FsContext _dbContext;

        public BranchStore(FsContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Branch? CreateBranch(Branch branch)
        {
            _dbContext.Branches.Add(branch);
            _dbContext.SaveChanges();
            return branch;
        }

        public Branch? GetBranchById(int branchId)
        {
            return _dbContext.Branches.FirstOrDefault(u => u.BranchID.Equals(branchId));
        }

        public IEnumerable<Branch>? GetAllBranchs()
        {
            return _dbContext.Branches.ToList();
        }

        public Branch? UpdateBranch(Branch branch)
        {

            var existingBranch = _dbContext.Branches.FirstOrDefault(u => u.BranchID == branch.BranchID);
            if (existingBranch == null)
            {
                return null;
            }
            _dbContext.Entry(existingBranch).CurrentValues.SetValues(branch);
            _dbContext.SaveChanges();
            return existingBranch;
        }

        public bool DeleteBranch(int id)
        {
            var branch = _dbContext.Branches.FirstOrDefault(u => u.BranchID.Equals(id));
            if (branch == null)
            {
                return false;
            }
            _dbContext.Branches.Remove(branch);
            _dbContext.SaveChanges();
            return true;
        }
    }
}