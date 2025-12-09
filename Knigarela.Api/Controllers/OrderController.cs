using AutoMapper;
using Hangfire;
using Knigarela.Api.Dtos.Cart;
using Knigarela.Api.Dtos.Clients;
using Knigarela.Api.Dtos.Orders;
using Knigarela.Api.HangFire.Jobs.Shipment;
using Knigarela.Core.Entities;
using Knigarela.Core.Pagination;
using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Knigarela.Api.Controllers.Admin;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IMapper mapper;
    private const string SessionKey = "CartItems";
    private readonly IBackgroundJobClient _jobs;

    public OrderController(IOrderService orderService, IMapper mapper, IBackgroundJobClient jobs)
    {
        _orderService = orderService;
        this.mapper = mapper;
        _jobs = jobs;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
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
            return Conflict(new { error = "InsufficientStock", items = result.Issues });

        return CreatedAtAction(nameof(GetById), new { id = result.Order!.Id }, result.Order);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var order = await _orderService.GetByIdAsync(id);
        if (order == null)
            return NotFound();
        return Ok(mapper.Map<OrderByIdDto>(order));
    }

    [HttpGet("admin/{id:guid}")]
    public async Task<IActionResult> GetByOrderById(Guid id)
    {
        var order = await _orderService.GetByIdAsync(id);
        if (order == null)
            return NotFound();
        return Ok(mapper.Map<AdminOrderDto>(order));
    }

    [HttpPost("admin/query")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromBody] DataQuery<string> query)
    {
        var result = await _orderService.GetAllAsync(query);

        return Ok(new PagedResult<OrderListDto>
        {
            Total = result.Total,
            Data = mapper.Map<IEnumerable<OrderListDto>>(result.Data)
        });
    }

    [HttpDelete("admin/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _orderService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("from-cart")]
    public async Task<IActionResult> CreateFromCart([FromBody] CreateOrderFromCartRequest req)
    {
        var items = GetCart();
        if (items == null || !items.Any())
        {
            return Conflict(new { error = "CartIsEmpty" });
        }

        var result = await _orderService.CreateOrderWithStockCheckAsync(
            req.FullName,
            req.Email,
            req.Phone,
            req.Address,
            items.Select(i => (i.BoxId, i.Quantity, i.PurchaseType)).ToList(),
            req.Notes
        );

        if (!result.Success)
            return Conflict(new { error = "InsufficientStock", items = result.Issues });

        return Ok(new { orderId = result.Order!.Id });
    }

    [HttpPost("generate-requests")]
    public IActionResult GenerateRequests()
    {
        var jobId = _jobs.Enqueue<IShipmentJob>(x => x.GenerateAsync());

        return Ok(new { jobId });
    }

    [HttpGet("job-status/{id}")]
    public IActionResult JobStatus(string id)
    {
        var api = JobStorage.Current.GetMonitoringApi();
        var details = api.JobDetails(id);
        var state = details?.History?.FirstOrDefault()?.StateName ?? "unknown";

        return Ok(new { status = state });
    }

    private List<CartItemDto> GetCart()
    {
        var json = HttpContext.Session.GetString(SessionKey);
        return json != null
            ? JsonSerializer.Deserialize<List<CartItemDto>>(json) ?? new List<CartItemDto>()
            : new List<CartItemDto>();
    }
}
