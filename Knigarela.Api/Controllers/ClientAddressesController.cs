using AutoMapper;
using Knigarela.Api.Dtos.Clients;
using Knigarela.Core.Entities;
using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Knigarela.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/clients/{clientId:guid}/addresses")]
[Authorize(Roles = "Admin")]
public class ClientAddressesController : ControllerBase
{
    private readonly IClientAddressService _addresses;
    private readonly IMapper mapper;

    public ClientAddressesController(IClientAddressService addresses, IMapper mapper)
    {
        _addresses = addresses;
        this.mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(Guid clientId)
        => Ok(await _addresses.GetByClientAsync(clientId));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid clientId, Guid id)
    {
        var address = await _addresses.GetByIdAsync(id);
        return address == null ? NotFound() : Ok(mapper.Map<UpsertClientAddressDto>(address));
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid clientId, [FromBody] UpsertClientAddressDto address)
    {
        var created = await _addresses.AddAsync(clientId, mapper.Map<ClientAddress>(address));
        return CreatedAtAction(nameof(GetById),
            new { clientId, id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid clientId, Guid id, [FromBody] UpsertClientAddressDto address)
    {
        var updated = await _addresses.UpdateAsync(id, mapper.Map<ClientAddress>(address));
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid clientId, Guid id)
        => (await _addresses.DeleteAsync(id)) ? NoContent() : NotFound();

    [HttpPost("{id:guid}/default")]
    public async Task<IActionResult> SetDefault(Guid clientId, Guid id)
        => (await _addresses.SetDefaultAsync(clientId, id)) ? Ok() : NotFound();
}
