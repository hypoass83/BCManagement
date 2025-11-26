using Domain.Entities.Localisation;
using Domain.Models;
using Domain.Models.Localisation;
using Domain.Models.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesServices.Security
{
    public interface IQuarterService : IService<QuarterModel, Quarter>
    {
    }
}


