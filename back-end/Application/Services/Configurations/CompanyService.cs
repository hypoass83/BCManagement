using AutoMapper;
using Domain.Entities.Configurations;
using Domain.Entities.Localisation;
using Domain.InterfacesServices.Configurations;
using Domain.InterfacesStores.Configurations;
using Domain.Models.Configurations;
using System.Collections.Generic;
using System.Linq;

namespace Application.Service.Configurations
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyStore _companyStore;
        private readonly IArchiveStore _archiveStore;
        private readonly IMapper _mapper;

        public CompanyService(ICompanyStore companyStore, IArchiveStore archiveStore, IMapper mapper)
        {
            _companyStore = companyStore;
            _archiveStore = archiveStore;
            _mapper = mapper;
        }

        public CompanyModel? Create(CompanyModel model)
        {
            Archive? archive = null;
            if (model.Archive != null && !string.IsNullOrWhiteSpace(model.Archive.FileBase64))
            {
                archive = _mapper.Map<Archive>(model.Archive);
                archive = _archiveStore.Create(archive);
            }

            var company = _mapper.Map<Company>(model);

            if (archive != null)
            {
                company.ArchiveID = archive.ArchiveID;
                company.Archive = archive;
            }

            var created = _companyStore.Create(company);
            return created != null ? _mapper.Map<CompanyModel>(created) : null;
        }

        public bool Delete(int id)
        {
            var existing = _companyStore.Find(id);
            if (existing == null)
            {
                return false;
            }

            _companyStore.Delete(id);

            if (existing.ArchiveID.HasValue)
            {
                try
                {
                    _archiveStore.Delete(existing.ArchiveID.Value);
                }
                catch
                {
                    // Ignore archive deletion failures to avoid masking main delete result
                }
            }

            return true;
        }

        public IEnumerable<CompanyModel>? GetAll()
        {
            var companies = _companyStore.FindAll;
            return companies?.Select(company => _mapper.Map<CompanyModel>(company));
        }

        public CompanyModel? GetById(int id)
        {
            var company = _companyStore.Find(id);
            return company == null ? null : _mapper.Map<CompanyModel>(company);
        }

        public CompanyModel? Update(CompanyModel model)
        {
            var existing = _companyStore.Find(model.CompanyID);
            if (existing == null)
            {
                return null;
            }

            Archive? newArchive = null;
            var hasNewArchive = model.Archive != null && !string.IsNullOrWhiteSpace(model.Archive.FileBase64);
            var oldArchiveId = existing.ArchiveID;

            if (hasNewArchive)
            {
                newArchive = _mapper.Map<Archive>(model.Archive);
                newArchive = _archiveStore.Create(newArchive);
            }

            existing.CompanyCode = model.CompanyCode;
            existing.CompanyName = model.CompanyName;
            existing.CompanyAbbreviation = model.CompanyAbbreviation;
            existing.CompanyDescription = model.CompanyDescription;
            existing.Adress = _mapper.Map<Adress>( model.Adress);

            if (newArchive != null)
            {
                existing.ArchiveID = newArchive.ArchiveID;
                existing.Archive = newArchive;
            }

            var updated = _companyStore.Update(existing);
            var result = updated != null ? _mapper.Map<CompanyModel>(updated) : null;

            // After company points to the new archive, try to delete the old one
            if (hasNewArchive && oldArchiveId.HasValue)
            {
                try
                {
                    _archiveStore.Delete(oldArchiveId.Value);
                }
                catch
                {
                    // best-effort cleanup
                }
            }

            return result;
        }
    }
}

