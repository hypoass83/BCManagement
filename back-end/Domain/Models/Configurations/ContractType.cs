using Domain.Entities.Localisation;

namespace Domain.Models.Configurations
{
    public class ContractTypeModel
    {
        public int ContractTypeID { get; set; }
        public string ContractTypeName { get; set; }
        public string? ContractTypeCode { get; set; }
        public string? ContractTypeDescription { get; set; }
    }
}