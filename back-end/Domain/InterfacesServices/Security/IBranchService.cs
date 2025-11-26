using Domain.Models;
using Domain.Models.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesServices.Security
{
    public interface IBranchService
    {
        public BranchModel? CreateBranch(BranchModel BranchModel);
        public BranchModel? GetBranchById(int id);
        public IEnumerable<BranchModel>? GetAllBranchs();
        public BranchModel? UpdateBranch(BranchModel BranchModel);
        public bool DeleteBranch(int id);
    }
}
