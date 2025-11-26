namespace Domain.Models.Configuration
{
    public class TaxeContributionModel
    {
        public int TaxeContributionID { get; set; }
        public string TaxeContributionName { get; set; }               // ex: CNPS, CRTV, IRPP
        public string TaxeContributionCode { get; set; }               // ex: TC01
        public string TaxeContributionDescription { get; set; }
        public TaxeTypeModel Type { get; set; }
        public decimal? Rate { get; set; }
        public decimal? FixedAmount { get; set; }      // ex: 2500 (montant fixe)
        public bool IsActive { get; set; } = true;
    }

    public enum TaxeTypeModel
    {
        Percentage = 1,
        FixedAmount = 2
    }

}
