using Domain.InterfacesStores.CandDocs;
using Microsoft.Extensions.Configuration;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;

namespace BCDocumentManagement.Infrastructure.Stores.CandDocs
{
    public class FileStore : IFileStore
    {
        private readonly string _rootPath;

        public FileStore(IConfiguration config)
        {
            //_rootPath = Path.Combine(AppContext.BaseDirectory, "ScannedDocs");
            _rootPath = config["StorageRoot"]
                ?? "D:\\GCEB_PROJECT\\BirthCertificateScanner\\Storage";
        }

        // ==========================================================
        // SAFETY HELPERS
        // ==========================================================

        private void SafeDelete(string filePath)
        {
            for (int i = 0; i < 15; i++)
            {
                try
                {
                    if (File.Exists(filePath))
                        File.Delete(filePath);

                    return;
                }
                catch
                {
                    Thread.Sleep(150);
                }
            }

            // Final attempt
            if (File.Exists(filePath))
                File.Delete(filePath);
        }

        private void SafeMove(string source, string destination)
        {
            for (int i = 0; i < 15; i++)
            {
                try
                {
                    File.Move(source, destination);
                    return;
                }
                catch
                {
                    Thread.Sleep(150);
                }
            }

            File.Move(source, destination);
        }

        private async Task SafeWrite(string filePath, byte[] bytes)
        {
            for (int i = 0; i < 15; i++)
            {
                try
                {
                    await File.WriteAllBytesAsync(filePath, bytes);
                    return;
                }
                catch
                {
                    await Task.Delay(150);
                }
            }

            await File.WriteAllBytesAsync(filePath, bytes);
        }

        private string EnsureDir(string path)
        {
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            return path;
        }
        private string BuildBasePath(string session, string exam, string centre)
        {
            return Path.Combine(_rootPath, session, exam, centre);
        }

        // ==========================================================
        // SAVE SUCCESS FILE
        // ==========================================================
        public async Task<string> SaveSuccessFileAsync(byte[] bytes, string session, string exam, string centre, string fileName)
        {
            string basePath = BuildBasePath(session, exam, centre);
            string folder = EnsureDir(Path.Combine(basePath, "success"));

            string path = Path.Combine(folder, fileName);
            await SafeWrite(path, bytes);

            // Give time for OS to release handle (Defender/indexer)
            await Task.Delay(100);
            return path;
        }
        // ==========================================================
        // SAVE ERROR FILE
        // ==========================================================
        public async Task<string> SaveErrorFileAsync(byte[] bytes, string session, string exam, string centre, string fileName)
        {
            string basePath = BuildBasePath(session, exam, centre);
            string folder = EnsureDir(Path.Combine(basePath, "errors"));

            string path = Path.Combine(folder, fileName);
            await SafeWrite(path, bytes);

            // Give time for OS to release handle (Defender/indexer)
            await Task.Delay(100);
            return path;
        }
        // ==========================================================
        // SAVE ORIGINAL IMPORTED FULL PDF
        // ==========================================================
        public async Task<string> MoveOriginalImportedPdfAsync(byte[] bytes, string session, string exam, string centre, string fileName)
        {
            string basePath = BuildBasePath(session, exam, centre);
            string folder = EnsureDir(Path.Combine(basePath, "imported"));

            string path = Path.Combine(folder, fileName);
            await SafeWrite(path, bytes);

            // Give time for OS to release handle (Defender/indexer)
            await Task.Delay(150);
            return path;
        }
        // ==========================================================
        // MOVE: success → errors
        // ==========================================================
        public async Task<string> MoveToErrorFolderAsync(string currentPath)
        {
            string newPath = currentPath.Replace("\\success\\", "\\errors\\");
            string folder = Path.GetDirectoryName(newPath);
            EnsureDir(folder);

            if (File.Exists(newPath))
                SafeDelete(newPath);

            SafeMove(currentPath, newPath);

            await Task.Delay(70);
            return await Task.FromResult(newPath);
        }
        // ==========================================================
        // MOVE: errors → success
        // ==========================================================
        public async Task<string> MoveToSuccessFolderAsync(string currentPath)
        {
            string newPath = currentPath.Replace("\\errors\\", "\\success\\");
            string folder = Path.GetDirectoryName(newPath);
            EnsureDir(folder);

            if (File.Exists(newPath))
                SafeDelete(newPath);

            SafeMove(currentPath, newPath);

            await Task.Delay(70);
            return await Task.FromResult(newPath);
        }

        // Legacy method (optional)
        public async Task<string> SaveFileAsync(byte[] bytes, string fileName)
        {
            string folder = EnsureDir(Path.Combine(_rootPath, "misc"));
            string path = Path.Combine(folder, fileName);
            await SafeWrite(path, bytes);

            // Give time for OS to release handle (Defender/indexer)
            await Task.Delay(100);
            return path;
        }
        public string GetImportedFolder(string session, string exam, string centre)
        {
            string folder = Path.Combine(_rootPath, session, exam, centre, "imported");

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            return folder;
        }

    }
}
