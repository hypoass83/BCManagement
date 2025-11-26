using Domain.Models;
using Domain.Models.Localisation;

namespace Domain.InterfacesServices.Security
{
    public interface IAdressService
    {
        public bool CreateAdress(AdressModel AdressModel);
        public AdressModel? GetAdressById(int id);
        public IEnumerable<AdressModel>? GetAllAdresss();
        public bool UpdateAdress(AdressModel AdressModel);
        public bool DeleteAdress(int id);
    }
}
