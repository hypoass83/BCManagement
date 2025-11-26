using Domain.Models;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.Entities;using Infrastructure.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models.Security;
using Domain.Entities.Security;
using Domain.Entities.Localisation;
using Domain.Models.Localisation;
using Domain.InterfacesStores.Localisation;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Stores.Localisation
{ 
    public class RegionStore : Store<Region>, IRegionStore
    {


        public RegionStore(FsContext dbContext) : base(dbContext)
        {
        }

    }
}