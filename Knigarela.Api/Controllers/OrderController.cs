using Knigarela.Api.Dtos.Orders;
using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Knigarela.Api.Controllers.Admin;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest req)
    {
        var result = await _orderService.CreateOrderWithStockCheckAsync(
             req.FullName,
             req.Email,
             req.Phone,
             req.Address,
             req.Items.Select(i => (i.BoxId, i.Quantity, i.PurchaseType)).ToList(),
             req.Notes,
             useLock: true
         );

        if (!result.Success)
            return Conflict(new { error = "NotEnoughStock", items = result.Issues });

        return CreatedAtAction(nameof(GetById), new { id = result.Order!.Id }, result.Order);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var order = await _orderService.GetByIdAsync(id);
        if (order == null)
            return NotFound();
        return Ok(order);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var list = await _orderService.GetAllAsync();
        return Ok(list);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _orderService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("from-cart")]
    public async Task<IActionResult> CreateFromCart([FromBody] CreateOrderRequest req)
    {
        var result = await _orderService.CreateOrderWithStockCheckAsync(
            req.FullName,
            req.Email,
            req.Phone,
            req.Address,
            req.Items.Select(i => (i.BoxId, i.Quantity, i.PurchaseType)).ToList(),
            req.Notes
        );

        if (!result.Success)
            return Conflict(new { error = "NotEnoughStock", items = result.Issues });

        return Ok(new { orderId = result.Order!.Id });
    }

}
