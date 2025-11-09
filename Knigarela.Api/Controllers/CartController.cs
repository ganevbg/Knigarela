using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Knigarela.Infrastructure.Data;
using Knigarela.Services.Interfaces;
using Knigarela.Api.Dtos.Cart;

namespace Knigarela.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly IBoxService boxService;
    private const string SessionKey = "CartItems";

    public CartController(KnigarelaDbContext db, IBoxService boxService)
    {
        this.boxService = boxService;
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
            return Conflict(new
            {
                message = "Not Enought quantity!",
                error = "InsufficientStock",
                availableQuantity = box.Count
            });

        var items = GetCart();
        var existing = items.FirstOrDefault(i => i.BoxId == cartItem.BoxId && i.PurchaseType == cartItem.PurchaseType);

        if (existing != null)
        {
            existing.Quantity = cartItem.Quantity;

            if(existing.Quantity == 0)
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
}