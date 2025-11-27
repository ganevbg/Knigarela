using AutoMapper;
using Knigarela.Api.Dtos.Clients;
using Knigarela.Core.Entities;
using Knigarela.Core.Pagination;
using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Knigarela.Api.Controllers.Admin;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ClientsController : ControllerBase
{
    private readonly IClientService _clientService;
    private readonly IMapper mapper;

    public ClientsController(IClientService clientService, IMapper mapper)
    {
        _clientService = clientService;
        this.mapper = mapper;
    }

    [HttpPost("admin/query")]
    public async Task<IActionResult> GetAll([FromBody] DataQuery<string> query)
    {
        var list = await _clientService.GetAllAsync(query);

        return Ok(new PagedResult<ClientAllDto>
        {
            Total = list.Total,
            Data = mapper.Map<IEnumerable<ClientAllDto>>(list.Data)
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var client = await _clientService.GetByIdAsync(id);
        if (client == null)
            return NotFound();

        return Ok(mapper.Map<UpsertClientDto>(client));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertClientDto client)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _clientService.CreateAsync(mapper.Map<Client>(client));
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpsertClientDto client)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _clientService.UpdateAsync(id, mapper.Map<Client>(client));
        if (updated == null)
            return NotFound();

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _clientService.DeleteAsync(id);
        if (!ok)
            return NotFound();

        return NoContent();
    }
}
