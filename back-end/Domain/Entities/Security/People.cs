using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Security
{
    public class People : GlobalPerson
    {
        public bool IsConnected { get; set; }
        public bool IsMarketer { get; set; }
        public bool IsSeller { get; set; }

        public int? SexID { get; set; }
        public virtual Sex? Sex { get; set; }
        

        [NotMapped]
        public string SexLabel
        {
            get
            {
                if (this.Sex != null)
                    return this.Sex.SexLabel;
                else
                {
                    return "";
                }
            }
        }


        [NotMapped]
        public string AdressPhoneNumber
        {
            get
            {
                if (this.Adress != null)
                    return this.Adress.AdressPhoneNumber;
                else
                    return "";
            }
        }


        [NotMapped]
        public string AdressEmail
        {
            get
            {
                if (this.Adress != null)
                    return this.Adress.AdressEmail;
                else
                    return "";
            }
        }


        [NotMapped]
        public string AdressPOBox
        {
            get
            {
                if (this.Adress != null)
                    return this.Adress.AdressPOBox;
                else
                    return "";
            }
        }
    }
}
