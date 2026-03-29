using AutoMapper;
using Knigarela.Core.Entities;
using Knigarela.Core.Entities.Speedy;
using Knigarela.Core.Entities.Speedy.Shipment;
using Knigarela.Core.Enums;
using Knigarela.Core.Helpers;
using Knigarela.Infrastructure.Settings;
using Knigarela.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Speedy.Models;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

public class SpeedyService : ISpeedyService
{
    private readonly HttpClient _http;
    private readonly ILogger<SpeedyService> _logger;
    private readonly SpeedySettings _settings;
    private readonly IMapper mapper;

    public SpeedyService(HttpClient http, ILogger<SpeedyService> logger, IOptions<SpeedySettings> settings, IMapper mapper)
    {
        _http = http;
        _logger = logger;
        _settings = settings.Value;

        _http.BaseAddress = new Uri(_settings.BaseUrl);
        _http.Timeout = TimeSpan.FromSeconds(_settings.TimeoutSeconds);
        this.mapper = mapper;
    }

    public async Task<bool> ValidateSiteAsync(string siteId)
    {
        if (string.IsNullOrWhiteSpace(siteId))
            return false;

        try
        {
            var response = await SearchSiteAsync(siteId);
            return response.Any();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to validate Speedy site {SiteId}", siteId);
            return false;
        }
    }

    public async Task<bool> ValidateOfficeAsync(string officeId)
    {
        if (string.IsNullOrWhiteSpace(officeId))
            return false;

        try
        {
            var response = await SearchOfficeAsync(officeId);
            return response.Any();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to validate Speedy office {OfficeId}", officeId);
            return false;
        }
    }

    public async Task<List<SpeedyOffice>> SearchOfficeAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return new List<SpeedyOffice>();

        try
        {
            var content = new StringContent(
                       JsonSerializer.Serialize(new
                       {
                           userName = _settings.Username,
                           password = _settings.Password,
                           name = name.Trim()
                       }),
                       Encoding.UTF8,
                       "application/json"
                   );

            var response = await _http.PostAsync($"location/office", content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var officeResult = JsonSerializer.Deserialize<SpeedyOfficeResult>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (officeResult == null || officeResult.Offices.Count == 0)
                return new List<SpeedyOffice>();


            return officeResult.Offices;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to search Speedy office with query {q}", name);
            return new List<SpeedyOffice>();
        }
    }

    public async Task<List<SpeedySite>> SearchSiteAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return new List<SpeedySite>();

        try
        {
            var content = new StringContent(
                       JsonSerializer.Serialize(new
                       {
                           userName = _settings.Username,
                           password = _settings.Password,
                           countryId = _settings.CountryId,
                           name = name.Trim()
                       }),
                       Encoding.UTF8,
                       "application/json"
                   );

            var response = await _http.PostAsync($"location/site", content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var result = JsonSerializer.Deserialize<SpeedySiteResult>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (result == null || result.Sites.Count == 0)
                return new List<SpeedySite>();


            return result.Sites;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to search Speedy site with query {q}", name);
            return new List<SpeedySite>();
        }
    }

    public async Task<CreateShipmentResponse> CreateShipmentAsync(Order order, DateOnly? pickupDate = null)
    {
        var request = mapper.Map<CreateShipmentRequest>(order);

        request.UserName = _settings.Username;
        request.Password = _settings.Password;

        request.Service = new ShipmentService
        {
            ServiceId = _settings.ServiceId,
            PickupDate = pickupDate ?? DateOnly.FromDateTime(DateTime.Now),
            AutoAdjustPickupDate = true,
            SaturdayDelivery = true,
            AdditionalServices = new ShipmentAdditionalServices
            {
                Cod = new ShipmentCODAdditionalService
                {
                    Amount = order.TotalAmount,
                    CurrencyCode = _settings.Currency,
                    ProcessingType = CODProcessingType.CASH,
                    IncludeShippingPrice = false,
                    CardPaymentForbidden = false,
                    FiscalReceiptItems = order.Items?.Select(item => new ShipmentCODFiscalReceiptItem
                    {
                        Description = "Книга",
                        VatGroup = "Б",
                        Amount = Convert.ToDouble(item.UnitPrice / 1.2m),
                        AmountWithVat = Convert.ToDouble(item.UnitPrice),
                    }).ToArray()
                },
                
            }
        };

        request.Sender = new ShipmentSender
        {
            ClientId = _settings.SenderClientId
        };

        // Validate — НЕ пращай address + pickupOfficeId
        ValidateRecipient(request.Recipient);

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNameCaseInsensitive = true,
        };

        jsonOptions.Converters.Add(new SpeedyDateTimeConverter());

        var json = JsonSerializer.Serialize(request, jsonOptions);
        var resp = await _http.PostAsync("shipment", new StringContent(json, Encoding.UTF8, "application/json"));

        resp.EnsureSuccessStatusCode();

        var body = await resp.Content.ReadAsStringAsync();

        var result = JsonSerializer.Deserialize<CreateShipmentResponse>(body, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNameCaseInsensitive = true,
            Converters = { new SpeedyDateTimeConverter(), new JsonStringEnumConverter(JsonNamingPolicy.CamelCase, allowIntegerValues: true) }
        })!;

        if (resp.IsSuccessStatusCode && result.Error == null)
        {
            return result;
        }

        throw new Exception($"Speedy API Error: {result.Error.Message}. Code={result.Error.Code}, Id={result.Error.Id}, Context={result.Error.Context}, Component={result.Error.Component}");

    }

    public async Task<ShipmentCalculationResponse> CalculateAsync(int parcelsCount, double totalWeightKg, decimal totalAmout, OrderAddress address)
    {
        var request = new CalculationRequest
        {
            UserName = _settings.Username,
            Password = _settings.Password,
            Service = new CalculationService
            {
                PickupDate = DateTime.Now,
                AutoAdjustPickupDate = true,
                SaturdayDelivery = true,
                ServiceIds = new List<int> { _settings.ServiceId },
                AdditionalServices = new ShipmentAdditionalServices
                {
                    Cod = new ShipmentCODAdditionalService
                    {
                        Amount = totalAmout,
                        CurrencyCode = _settings.Currency,
                        ProcessingType = CODProcessingType.CASH,
                        IncludeShippingPrice = false,
                        CardPaymentForbidden = false
                    }
                }
            },
            Content = new CalculationContent
            {
                ParcelsCount = parcelsCount,
                TotalWeight = totalWeightKg
            },
            Payment = new ShipmentPayment
            {
                CourierServicePayer = ShipmentRole.RECIPIENT
            },
            Recipient = BuildCalculationRecipientFromOrderAddress(address)
        };

        var json = JsonSerializer.Serialize(request, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNameCaseInsensitive = true
        });

        var resp = await _http.PostAsync("calculate", new StringContent(json, Encoding.UTF8, "application/json"));
        var body = await resp.Content.ReadAsStringAsync();

        var result = JsonSerializer.Deserialize<ShipmentCalculationResponse>(body, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNameCaseInsensitive = true,
            Converters = { new SpeedyDateTimeConverter(), new JsonStringEnumConverter(JsonNamingPolicy.CamelCase, allowIntegerValues: true) }
        })!;


        if (resp.IsSuccessStatusCode && result.Error == null && result.Calculations != null && result.Calculations.All(x => x.Error == null))
        {
            return result;
        }

        if (result.Error == null)
        {
            var allErrors = result.Calculations?.Select(x => x.Error);
            if (allErrors != null && allErrors.Any())
            {
                var sb = new StringBuilder();

                foreach (var error in allErrors)
                {
                    sb.Append($"Speedy API Error: {error.Message}. Code={error.Code}, Id={error.Id}, Context={error.Context}, Component={error.Component}\n");
                }

                throw new Exception(sb.ToString());
            }
        }

        throw new Exception($"Speedy API Error: {result.Error.Message}. Code={result.Error.Code}, Id={result.Error.Id}, Context={result.Error.Context}, Component={result.Error.Component}");
    }

    public async Task<string> PrintLabelsAsync(PaperSize size, string[] parcelIds)
    {
        if (parcelIds == null || parcelIds.Length == 0)
        {
            throw new ArgumentNullException(nameof(parcelIds));
        }

        var request = new PrintRequest
        {
            UserName = _settings.Username,
            Password = _settings.Password,
            paperSize = size,
            Parcels = parcelIds.Select(x => new ParcelsArray { Parcel = new CreatedShipmentParcel { Id = x } }).ToArray()
        };

        var json = JsonSerializer.Serialize(request, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNameCaseInsensitive = true,
            Converters = { new SpeedyDateTimeConverter(), new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseUpper, allowIntegerValues: true) }
        });

        var resp = await _http.PostAsync("print/extended", new StringContent(json, Encoding.UTF8, "application/json"));
        var body = await resp.Content.ReadAsStringAsync();

        var result = JsonSerializer.Deserialize<ExtendedPrintResponse>(body, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNameCaseInsensitive = true
        })!;

        if (resp.IsSuccessStatusCode && result.Error == null)
        {
            return result.Data;
        }

        throw new Exception($"Speedy API Error: {result.Error.Message}. Code={result.Error.Code}, Id={result.Error.Id}, Context={result.Error.Context}, Component={result.Error.Component}");
    }

    private void ValidateRecipient(ShipmentRecipient r)
    {
        bool hasOffice = r.PickupOfficeId.HasValue;
        bool hasAddress = r.Address != null && r.Address.SiteId.HasValue;

        if (hasOffice && hasAddress)
            throw new Exception("Speedy: Cannot send both address and pickupOfficeId.");

        if (!hasOffice && !hasAddress)
            throw new Exception("Speedy: Either address or pickupOfficeId is required.");
    }

    private CalculationPerson BuildCalculationRecipientFromOrderAddress(OrderAddress address)
    {
        // DeliveryType == Courier => офис, иначе адрес – според твоя модел
        if (address.DeliveryType == DeliveryType.Courier && address.OfficeId.HasValue)
        {
            return new CalculationPerson
            {
                PickupOfficeId = address.OfficeId.Value,
                PrivatePerson = true
            };
        }

        // адресна доставка
        return new CalculationPerson
        {
            PrivatePerson = true,
            AddressLocation = new AddressLocation
            {
                CountryId = _settings.CountryId, // BG
                SiteId = address.SiteId
            }
        };
    }
}
