using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPerson.Api.Data;
using MyPerson.Api.Models;
using MyPerson.Api.Models.DTOs;

namespace MyPerson.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ClientesController> _logger;
    private readonly PasswordHasher<Cliente> _passwordHasher = new();

    public ClientesController(ApplicationDbContext context, ILogger<ClientesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Lista todos os clientes
    /// </summary>
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClienteResponseDto>>> GetClientes()
    {
        try
        {
            var clientes = await _context.Clientes
                .OrderByDescending(c => c.DataCriacao)
                .Select(c => new ClienteResponseDto
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    Email = c.Email,
                    Telefone = c.Telefone,
                    Ativo = c.Ativo,
                    DataCriacao = c.DataCriacao,
                    DataAtualizacao = c.DataAtualizacao
                })
                .ToListAsync();

            return Ok(clientes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar clientes");
            return StatusCode(500, new { message = "Erro interno ao buscar clientes" });
        }
    }

    /// <summary>
    /// Busca um cliente por ID
    /// </summary>
    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<ClienteResponseDto>> GetCliente(int id)
    {
        try
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound(new { message = $"Cliente com ID {id} não encontrado" });
            }

            var clienteDto = new ClienteResponseDto
            {
                Id = cliente.Id,
                Nome = cliente.Nome,
                Email = cliente.Email,
                Telefone = cliente.Telefone,
                Ativo = cliente.Ativo,
                DataCriacao = cliente.DataCriacao,
                DataAtualizacao = cliente.DataAtualizacao
            };

            return Ok(clienteDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar cliente {Id}", id);
            return StatusCode(500, new { message = "Erro interno ao buscar cliente" });
        }
    }

    /// <summary>
    /// Registra um novo cliente (público)
    /// </summary>
    [HttpPost("registro")]
    public async Task<ActionResult<ClienteResponseDto>> RegistrarCliente(CriarClienteDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var emailExiste = await _context.Clientes.AnyAsync(c => c.Email == dto.Email);
            if (emailExiste)
            {
                return Conflict(new { message = "E-mail já cadastrado" });
            }

            var cliente = new Cliente
            {
                Nome = dto.Nome,
                Email = dto.Email,
                SenhaHash = _passwordHasher.HashPassword(null!, dto.Senha),
                Telefone = dto.Telefone,
                Ativo = true,
                DataCriacao = DateTime.UtcNow
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            var clienteResponse = new ClienteResponseDto
            {
                Id = cliente.Id,
                Nome = cliente.Nome,
                Email = cliente.Email,
                Telefone = cliente.Telefone,
                Ativo = cliente.Ativo,
                DataCriacao = cliente.DataCriacao,
                DataAtualizacao = cliente.DataAtualizacao
            };

            return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, clienteResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao registrar cliente");
            return StatusCode(500, new { message = "Erro interno ao registrar cliente" });
        }
    }

    /// <summary>
    /// Atualiza um cliente existente
    /// </summary>
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> AtualizarCliente(int id, AtualizarClienteDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound(new { message = $"Cliente com ID {id} não encontrado" });
            }

            var emailEmUso = await _context.Clientes
                .AnyAsync(c => c.Email == dto.Email && c.Id != id);
            if (emailEmUso)
            {
                return Conflict(new { message = "E-mail já cadastrado por outro cliente" });
            }

            cliente.Nome = dto.Nome;
            cliente.Email = dto.Email;
            cliente.Telefone = dto.Telefone;
            cliente.Ativo = dto.Ativo;
            cliente.DataAtualizacao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar cliente {Id}", id);
            return StatusCode(500, new { message = "Erro interno ao atualizar cliente" });
        }
    }

    /// <summary>
    /// Deleta um cliente
    /// </summary>
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletarCliente(int id)
    {
        try
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound(new { message = $"Cliente com ID {id} não encontrado" });
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar cliente {Id}", id);
            return StatusCode(500, new { message = "Erro interno ao deletar cliente" });
        }
    }
}
