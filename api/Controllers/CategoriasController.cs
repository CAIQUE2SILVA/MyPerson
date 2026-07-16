using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPerson.Api.Data;
using MyPerson.Api.Models;
using MyPerson.Api.Models.DTOs;

namespace MyPerson.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CategoriasController> _logger;

    public CategoriasController(ApplicationDbContext context, ILogger<CategoriasController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Lista todas as categorias
    /// </summary>
    [HttpGet]
    [ProducesResponseType(200, Type = typeof(List<CategoriaResponseDto>))]
    [ProducesResponseType(500)]
    public async Task<ActionResult<IEnumerable<CategoriaResponseDto>>> GetCategorias()
    {
        try
        {
            var categorias = await _context.Categorias
                .OrderBy(c => c.Nome)
                .Select(c => new CategoriaResponseDto
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    Slug = c.Slug
                })
                .ToListAsync();

            return Ok(categorias);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar categorias");
            return StatusCode(500, new { message = "Erro interno ao buscar categorias" });
        }
    }

    /// <summary>
    /// Busca uma categoria por ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(200, Type = typeof(CategoriaResponseDto))]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<CategoriaResponseDto>> GetCategoria(int id)
    {
        try
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound(new { message = $"Categoria com ID {id} não encontrada" });
            }

            var categoriaDto = new CategoriaResponseDto
            {
                Id = categoria.Id,
                Nome = categoria.Nome,
                Slug = categoria.Slug
            };

            return Ok(categoriaDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar categoria {Id}", id);
            return StatusCode(500, new { message = "Erro interno ao buscar categoria" });
        }
    }

    /// <summary>
    /// Cria uma nova categoria
    /// </summary>
    [Authorize]
    [HttpPost]
    [ProducesResponseType(201, Type = typeof(CategoriaResponseDto))]
    [ProducesResponseType(400)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<CategoriaResponseDto>> CriarCategoria(CriarCategoriaDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _context.Categorias.AnyAsync(c => c.Slug == dto.Slug))
            {
                return Conflict(new { message = "Já existe uma categoria com este slug" });
            }

            var categoria = new Categoria
            {
                Nome = dto.Nome,
                Slug = dto.Slug
            };

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            var categoriaResponse = new CategoriaResponseDto
            {
                Id = categoria.Id,
                Nome = categoria.Nome,
                Slug = categoria.Slug
            };

            return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, categoriaResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar categoria");
            return StatusCode(500, new { message = "Erro interno ao criar categoria" });
        }
    }

    /// <summary>
    /// Atualiza uma categoria existente
    /// </summary>
    [Authorize]
    [HttpPut("{id}")]
    [ProducesResponseType(200, Type = typeof(void))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> AtualizarCategoria(int id, AtualizarCategoriaDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound(new { message = $"Categoria com ID {id} não encontrada" });
            }

            if (await _context.Categorias.AnyAsync(c => c.Slug == dto.Slug && c.Id != id))
            {
                return Conflict(new { message = "Já existe outra categoria com este slug" });
            }

            categoria.Nome = dto.Nome;
            categoria.Slug = dto.Slug;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar categoria {Id}", id);
            return StatusCode(500, new { message = "Erro interno ao atualizar categoria" });
        }
    }

    /// <summary>
    /// Deleta uma categoria
    /// </summary>
    [Authorize]
    [HttpDelete("{id}")]
    [ProducesResponseType(200, Type = typeof(void))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> DeletarCategoria(int id)
    {
        try
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound(new { message = $"Categoria com ID {id} não encontrada" });
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar categoria {Id}", id);
            return StatusCode(500, new { message = "Erro interno ao deletar categoria" });
        }
    }
}
