using Knigarela.Core.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace Knigarela.Infrastructure.Files;

public class LocalFileStorage : IFileStorage
{
    private readonly IFileStorageSettings _settings;

    public LocalFileStorage(IFileStorageSettings settings)
    {
        _settings = settings;
    }

    public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string folder)
    {
        var dir = Path.Combine(_settings.RootPath, folder);
        Directory.CreateDirectory(dir);

        var path = Path.Combine(dir, fileName);
        using (var fs = File.Create(path))
            await fileStream.CopyToAsync(fs);

        var relative = $"/uploads/{folder.Replace("\\", "/")}/{fileName}";
        return relative;
    }

    public Task<bool> DeleteFileAsync(string relativePath)
    {
        var physical = Path.Combine(_settings.RootPath, relativePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        if (File.Exists(physical))
        {
            File.Delete(physical);
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public Task<bool> DeleteFolderAsync(string folder)
    {
        folder = folder.TrimStart('/', '\\');
        var physicalPath = Path.Combine(_settings.RootPath, folder);

        if (Directory.Exists(physicalPath))
        {
            Directory.Delete(physicalPath, recursive: true);
            return Task.FromResult(true);
        }

        return Task.FromResult(false);
    }

    public async Task<string> SaveThumbnailAsync(Stream fileStream, string fileName, string folder, int width = 300)
    {
        folder = folder.TrimStart('/', '\\');
        var thumbFolder = Path.Combine(_settings.RootPath, folder, "thumbs");
        Directory.CreateDirectory(thumbFolder);

        var ext = Path.GetExtension(fileName);
        var baseName = Path.GetFileNameWithoutExtension(fileName);
        var thumbName = $"{baseName}_thumb{ext}";
        var path = Path.Combine(thumbFolder, thumbName);

        // reset stream position if reusing the same stream
        if (fileStream.CanSeek)
            fileStream.Position = 0;

        using var image = await Image.LoadAsync(fileStream);
        var ratio = (double)width / image.Width;
        var height = (int)(image.Height * ratio);
        image.Mutate(x => x.Resize(width, height));
        await image.SaveAsync(path);

        var relative = $"/uploads/{folder.Replace("\\", "/")}/thumbs/{thumbName}";
        return relative;
    }
}
