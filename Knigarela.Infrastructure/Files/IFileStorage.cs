namespace Knigarela.Infrastructure.Files;

public interface IFileStorage
{
    Task<string> SaveFileAsync(Stream fileStream, string fileName, string folder);

    Task<bool> DeleteFileAsync(string relativePath);

    Task<bool> DeleteFolderAsync(string folder);

    Task<string> SaveThumbnailAsync(Stream fileStream, string fileName, string folder, int width = 300);
}
