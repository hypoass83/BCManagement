using Domain.InterfacesStores.CandDocs;

namespace BCDocumentManagement.Infrastructure.Stores.CandDocs
{
    public class FileStore : IFileStore
    {
        private readonly string _rootPath;

        public FileStore()
        {
            _rootPath = Path.Combine(AppContext.BaseDirectory, "ScannedDocs");
        }

        public async Task<string> SaveFileAsync(byte[] fileBytes, string fileName)
        {
            var path = Path.Combine(_rootPath, fileName);

            var directory = Path.GetDirectoryName(path);
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            await File.WriteAllBytesAsync(path, fileBytes);

            return path;
        }
    }
}
