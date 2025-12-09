using Knigarela.Api.Dtos.Cart;
using Knigarela.Core.Entities;
using Knigarela.Infrastructure.Data;
using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Knigarela.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly IBoxService boxService;
    private readonly ISpeedyService speedyService;
    private const string SessionKey = "CartItems";

    public CartController(KnigarelaDbContext db, IBoxService boxService, ISpeedyService speedyService)
    {
        this.boxService = boxService;
        this.speedyService = speedyService;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(GetCart());
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] AddToCartDto cartItem)
    {
        var box = await boxService.GetByIdAsync(cartItem.BoxId);
        if (box == null)
            return NotFound("Box not found");

        if(cartItem.Quantity > box.Count)
           return ValidateQuantity(box.Count);

        var items = GetCart();

        var existingByBox = items.Where(x => x.BoxId == cartItem.BoxId)?.Sum(x => x.Quantity);
        if(existingByBox + cartItem.Quantity > box.Count)
            return ValidateQuantity(box.Count);

        var existing = items.FirstOrDefault(i => i.BoxId == cartItem.BoxId && i.PurchaseType == cartItem.PurchaseType);
        if (existing != null)
        {
            var newQuantity = existing.Quantity+= cartItem.Quantity;
            if (newQuantity > box.Count)
              return ValidateQuantity(box.Count);

            existing.Quantity = newQuantity;
            if (existing.Quantity == 0)
            {
                items.Remove(existing);
            }
        }
        else
        {
            items.Add(new CartItemDto
            {
                BoxId = box.Id,
                Title = box.Title,
                Quantity = cartItem.Quantity,
                UnitPrice = box.GetPrice(cartItem.PurchaseType),
                ImageUrl = box.Images.FirstOrDefault(x => x.IsMain)?.Url ?? "",
                PurchaseType = cartItem.PurchaseType,
            });
        }

        SaveCart(items);
        return Ok(items);
    }

    [HttpPost("remove")]
    public IActionResult Remove([FromBody] CartDto cardDto)
    {
        var items = GetCart();
        var toRemove = items.FirstOrDefault(i => i.BoxId == cardDto.BoxId && i.PurchaseType == cardDto.PurchaseType);
        if (toRemove != null)
        {
            var updated = items.Except(new[] { toRemove }).ToList();
            SaveCart(updated);
            return Ok(updated);
        }

        return Ok(items);
    }

    [HttpPost("clear")]
    public IActionResult Clear()
    {
        HttpContext.Session.Remove(SessionKey);
        return Ok();
    }


    [HttpPost("calculate")]
    public async Task<IActionResult> CalculateDelivery([FromBody] CheckoutDeliveryDto dto)
    {
        var items = GetCart();
        var address = new OrderAddress
        {
            DeliveryType = dto.DeliveryType,
            OfficeId = dto.OfficeId,
            SiteId = dto.SiteId,
            AddressText = dto.AddressText
        };

        var calc = await speedyService.CalculateAsync(items.Count, items.Sum(x => x.Quantity * 1), items.Sum(x => x.Quantity * x.UnitPrice), address);

        return Ok(new
        {
            deliveryPrice = calc.Calculations?.FirstOrDefault()?.Price?.Total ?? 0m,
        });
    }

    private List<CartItemDto> GetCart()
    {
        var json = HttpContext.Session.GetString(SessionKey);
        return json != null
            ? JsonSerializer.Deserialize<List<CartItemDto>>(json) ?? new List<CartItemDto>()
            : new List<CartItemDto>();
    }

    private void SaveCart(List<CartItemDto> items)
    {
        HttpContext.Session.SetString(SessionKey, JsonSerializer.Serialize(items));
    }

    private IActionResult ValidateQuantity(int availableQuantity)
    {
        return Conflict(new
        {
            message = "Not Enought quantity!",
            error = "InsufficientStock",
            availableQuantity = availableQuantity
        });
    }
}