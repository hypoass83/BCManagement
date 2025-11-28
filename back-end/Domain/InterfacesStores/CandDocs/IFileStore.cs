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

        Task<string> SaveSuccessFileAsync(byte[] bytes, string session, string exam, string centre, string fileName);
        Task<string> SaveErrorFileAsync(byte[] bytes, string session, string exam, string centre, string fileName);
        Task<string> MoveOriginalImportedPdfAsync(byte[] bytes, string session, string exam, string centre, string fileName);

        Task<string> MoveToErrorFolderAsync(string currentPath);
        Task<string> MoveToSuccessFolderAsync(string currentPath);

        string GetImportedFolder(string session, string exam, string centre);

    }
}
