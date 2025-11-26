
using Domain.Models.Security;
using Domain.Entities.Security;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.InterfacesServices.Security;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;

namespace Application.Service
{
    public class BranchService : IBranchService
    {
        private readonly IBranchStore _BranchStore;
        private readonly IMapper _mapper;

        public BranchService(IBranchStore BranchService, IMapper mapper)
        {
            _BranchStore = BranchService;
            _mapper = mapper;
        }


        private BranchModel? MapToModel(Branch? branch)
        {
            return branch == null ? null : _mapper.Map<BranchModel>(branch);
        }

        private Branch? MapToEntity(BranchModel? model)
        {
            return model == null ? null : _mapper.Map<Branch>(model);
        }

        public BranchModel? CreateBranch(BranchModel branchModel)
        {
            var branch = MapToEntity(branchModel);
            var created = _BranchStore.CreateBranch(branch);
            return MapToModel(created);
        }

        public BranchModel? GetBranchById(int branchId)
        {
            var branch = _BranchStore.GetBranchById(branchId);
            return MapToModel(branch);
        }

        public IEnumerable<BranchModel>? GetAllBranchs()
        {
            var branches = _BranchStore.GetAllBranchs();
            return branches?.Select(b => MapToModel(b)).Where(x => x != null).Select(x => x!);
        }

        public BranchModel? UpdateBranch(BranchModel branchModel)
        {
            var branch = MapToEntity(branchModel);
            var updated = _BranchStore.UpdateBranch(branch);
            return MapToModel(updated);
        }

        public bool DeleteBranch(int idBranch)
        {
            return _BranchStore.DeleteBranch(idBranch);
        }

    }
}
