using Knigarela.Core.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
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

    public async Task<(string thumbUrl, string mediumUrl, string largeUrl)> SaveImageVariantsAsync(
    Stream fileStream,
    string folder,
    string baseNameNoExt,
    int thumbW = 480,
    int mediumW = 1024,
    int largeW = 1920)
    {
        folder = folder.TrimStart('/', '\\');
        var dir = Path.Combine(_settings.RootPath, folder);
        Directory.CreateDirectory(dir);

        if (fileStream.CanSeek) fileStream.Position = 0;
        using var image = await Image.LoadAsync(fileStream);

        // важни: ориентация + махане на метаданни (по-малък файл)
        image.Mutate(x => x.AutoOrient());
        image.Metadata.ExifProfile = null;

        var thumbUrl = await SaveVariantAsync(image, $"{baseNameNoExt}_thumb", thumbW, quality: 78, folder, dir);
        var mediumUrl = await SaveVariantAsync(image, $"{baseNameNoExt}_medium", mediumW, quality: 82, folder, dir);
        var largeUrl = await SaveVariantAsync(image, $"{baseNameNoExt}_large", largeW, quality: 85, folder, dir);

        return (thumbUrl, mediumUrl, largeUrl);
    }

    private async Task<string> SaveVariantAsync(Image src, string name, int maxW, int quality, string folder, string dir)
    {
        using var clone = src.Clone(ctx =>
        {
            // не upscale-вай малки изображения
            if (src.Width > maxW)
            {
                ctx.Resize(new ResizeOptions
                {
                    Mode = ResizeMode.Max,
                    Size = new Size(maxW, 0),
                    Sampler = KnownResamplers.Lanczos3,
                    Compand = true
                })
                .GaussianSharpen(0.2f);
            }
        });

        var fileName = $"{name}.webp";
        var path = Path.Combine(dir, fileName);

        var encoder = new WebpEncoder
        {
            Quality = quality,
            FileFormat = WebpFileFormatType.Lossy
        };

        await clone.SaveAsync(path, encoder);
        return $"/uploads/{folder.Replace("\\", "/")}/{fileName}";
    }
}
