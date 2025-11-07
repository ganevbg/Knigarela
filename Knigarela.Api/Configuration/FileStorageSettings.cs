using Knigarela.Core.Interfaces;

namespace Knigarela.Api.Configuration;

public class FileStorageSettings : IFileStorageSettings
{
    public string RootPath { get; }

    public FileStorageSettings(IConfiguration config)
    {
        RootPath = config["FileStorage:RootPath"] ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
    }
}
