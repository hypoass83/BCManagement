using Domain.Models.Localisation;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Controllers.Configurations.Requests
{
    public class CompanyRequest
    {
        public int? CompanyID { get; set; }

        [Required]
        public string CompanyCode { get; set; }

        [Required]
        public string CompanyName { get; set; }

        public string CompanyAbbreviation { get; set; }

        public string CompanyDescription { get; set; }

        public int? AdressID { get; set; }

        public AdressModel Adress { get; set; }

        public IFormFile? Logo { get; set; }
    }
}

