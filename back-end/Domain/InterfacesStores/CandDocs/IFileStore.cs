using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesStores.CandDocs
{
    public interface IFileStore
    {
        Task<string> SaveFileAsync(byte[] fileBytes, string fileName);
    }
}
