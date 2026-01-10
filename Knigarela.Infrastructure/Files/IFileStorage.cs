namespace Knigarela.Infrastructure.Files;

public interface IFileStorage
{
    Task<string> SaveFileAsync(Stream fileStream, string fileName, string folder);

    Task<bool> DeleteFileAsync(string relativePath);

    Task<bool> DeleteFolderAsync(string folder);

    Task<string> SaveThumbnailAsync(Stream fileStream, string fileName, string folder, int width = 300);

    Task<(string thumbUrl, string mediumUrl, string largeUrl)> SaveImageVariantsAsync(Stream fileStream, string folder, string baseNameNoExt, int thumbW = 480, int mediumW = 1024, int largeW = 1920);
}
