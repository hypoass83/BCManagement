using Domain.Models;
using Domain.Models.Security;
using Domain.Entities.Security;
using Domain.Entities.Localisation;
using Domain.Models.Localisation;
using Domain.DTO;
using Domain.Entities.Configurations;
using Domain.Models.Configurations;
using Domain.Models.Configuration;
using Domain.Entities.CandDocs;
using Domain.Models.CandDocs;
using Domain.DTO.CandDocs;

namespace Insfrastructure.Mapper
{
    public class AutoMapping : AutoMapper.Profile
    {
        public AutoMapping()
        {
            // Exemple de mappage simple
            CreateMap<ProfileModel, Domain.Entities.Security.Profile>().ReverseMap();

            // Exemple de mappage avec des conversions spécifiques
            CreateMap<UserModel, User>().ReverseMap();
            CreateMap<User, UserCreateDTO>().ReverseMap();
            CreateMap<SexModel, Sex>().ReverseMap();

            CreateMap<GlobalPerson, GlobalPersonModel>().ReverseMap();
            CreateMap<PeopleModel, People>().ReverseMap();
            CreateMap<AdressModel, Adress>().ReverseMap();
            CreateMap<AdressCreateDTO, Adress>().ReverseMap();
            CreateMap<QuarterModel, Quarter>().ReverseMap();
            CreateMap<CountryModel, Country>().ReverseMap();
            CreateMap<TownModel, Town>().ReverseMap();
            CreateMap<RegionModel, Region>().ReverseMap();

            CreateMap<Job, JobModel>().ReverseMap();
            
            CreateMap<Company, CompanyModel>().ReverseMap();
            CreateMap<Branch, BranchModel>().ReverseMap();


            CreateMap<Archive, ArchiveModel>().ReverseMap();
           


            CreateMap<ActionMenuProfileModel, ActionMenuProfile>().ReverseMap();
            CreateMap<ActionSubMenuProfileModel, ActionSubMenuProfile>().ReverseMap();
            CreateMap<ActionMenuProfileModel, ActionMenuProfile>()
                 .ForMember(dest => dest.Delete, opt => opt.MapFrom(src => src.Remove))
                .ReverseMap();
            CreateMap<ActionSubMenuProfileModel, ActionSubMenuProfile>()
                .ForMember(dest => dest.Delete, opt => opt.MapFrom(src => src.Remove))
                .ReverseMap();

            CreateMap<Menu, MenuModel>().ReverseMap();
            CreateMap<SubMenu, SubMenuModel>().ReverseMap();
            CreateMap<Menu, MenuModel>().ReverseMap();
            CreateMap<ActionSubMenuProfile, ActionMenuProfile>().ForMember(dest => dest.MenuID, opt => opt.MapFrom(src => src.SubMenuID));


            CreateMap<Module, ModuleModel>().ReverseMap();


            //// Entity <-> Model
            //CreateMap<CandidateDocument, CandidateDocumentModel>();

            //// DTO -> Entity
            //CreateMap<CandidateDocumentCreateDTO, CandidateDocument>()
            //    .ForMember(dest => dest.Id, opt => opt.Ignore())
            //    .ForMember(dest => dest.CreationDate, opt => opt.Ignore())
            //    .ForMember(dest => dest.ModificationDate, opt => opt.Ignore())
            //    .ForMember(dest => dest.Employee, opt => opt.Ignore())
            //    .ForMember(dest => dest.NumberOfDays, opt => opt.MapFrom(src =>
            //        src.NumberOfDays.HasValue && src.NumberOfDays.Value > 0
            //            ? src.NumberOfDays.Value
            //            : 0));



        }

    }
}
