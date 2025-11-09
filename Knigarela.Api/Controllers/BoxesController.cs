using AutoMapper;
using Knigarela.Api.Dtos.Boxes;
using Knigarela.Core.Entities;
using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Knigarela.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BoxesController : ControllerBase
{
    private readonly IBoxService _boxService;
    private readonly IMapper _mapper;

    public BoxesController(IBoxService boxService, IMapper mapper)
    {
        _boxService = boxService;
        _mapper = mapper;
    }

    [HttpGet("")]
    public async Task<IActionResult> GetAll()
    {
        var boxes = await _boxService.GetAllAsync();
        var result = _mapper.Map<IEnumerable<AllBoxDto>>(boxes);
        return Ok(result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveBox()
    {
        var box = await _boxService.GetActiveBox();
        var result = _mapper.Map<ActiveBoxDto>(box);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var box = await _boxService.GetByIdAsync(id);
        if (box == null) return NotFound();
        return Ok(_mapper.Map<BoxDto>(box));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] UpsertBoxDto dto)
    {
        var box = _mapper.Map<Box>(dto);
        var created = await _boxService.CreateAsync(box);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, _mapper.Map<BoxDto>(created));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpsertBoxDto dto)
    {
        var box = _mapper.Map<Box>(dto);
        var updated = await _boxService.UpdateAsync(id, box);
        return updated == null ? NotFound() : Ok(_mapper.Map<BoxDto>(updated));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _boxService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var box = await _boxService.GetBySlugAsync(slug);
        return box == null ? NotFound() : Ok(_mapper.Map<BoxDto>(box));
    }

    [HttpGet("previous")]
    public async Task<IActionResult> GetNotActiveBox()
    {
        var boxes = await _boxService.GetNotActiveBox();
        var result = _mapper.Map<List<PrevBoxDto>>(boxes);
        return Ok(result);
    }
}
