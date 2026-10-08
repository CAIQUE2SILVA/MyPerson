using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MyPerson.Api;
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
    private readonly BloqueioTentativas _bloqueio;
    private readonly PasswordHasher<Cliente> _passwordHasher = new();
    private static readonly string HashSenhaDummy = new PasswordHasher<Cliente>().HashPassword(null!, "senha-inexistente");

    public ClientesController(
        ApplicationDbContext context,
        ILogger<ClientesController> logger,
        BloqueioTentativas bloqueio)
    {
        _context = context;
        _logger = logger;
        _bloqueio = bloqueio;
    }

    /// <summary>
    /// Lista todos os clientes
    /// </summary>
    [Authorize]
    [HttpGet]
    [ProducesResponseType(200, Type = typeof(List<ClienteResponseDto>))]
    [ProducesResponseType(400)]
    [ProducesResponseType(500)]
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
    [ProducesResponseType(200, Type = typeof(ClienteResponseDto))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
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
    /// Entra com e-mail e senha do cliente. Não emite token de admin.
    /// </summary>
    [EnableRateLimiting(AuthRateLimit.Policy)]
    [HttpPost("entrar")]
    [ProducesResponseType(200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(429)]
    public async Task<IActionResult> Entrar(EntrarClienteDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var chave = BloqueioTentativas.ChaveCliente(dto.Email);
            if (_bloqueio.Bloqueado(chave, DateTime.UtcNow, out var retryAfterSeconds))
                return Bloqueado(retryAfterSeconds);

            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Email == dto.Email);
            var senhaConfere = SenhaConfere(cliente, dto.Senha);
            if (cliente == null || !senhaConfere || !cliente.Ativo)
            {
                if (cliente != null && !senhaConfere)
                {
                    _bloqueio.RegistrarFalha(chave, DateTime.UtcNow);
                    if (_bloqueio.Bloqueado(chave, DateTime.UtcNow, out retryAfterSeconds))
                        return Bloqueado(retryAfterSeconds);
                }

                return Unauthorized(new { message = "E-mail ou senha inválidos" });
            }

            _bloqueio.RegistrarSucesso(chave);
            return Ok(new { cliente.Id, cliente.Nome });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao autenticar cliente");
            return StatusCode(500, new { message = "Erro interno ao autenticar cliente" });
        }
    }

    private bool SenhaConfere(Cliente? cliente, string senha)
    {
        var hash = cliente?.SenhaHash ?? HashSenhaDummy;
        var resultado = _passwordHasher.VerifyHashedPassword(null!, hash, senha);
        return cliente != null && resultado == PasswordVerificationResult.Success;
    }

    private ObjectResult Bloqueado(int retryAfterSeconds) =>
        StatusCode(StatusCodes.Status429TooManyRequests, new
        {
            message = BloqueioTentativas.Mensagem,
            retryAfterSeconds
        });

    /// <summary>
    /// Registra um novo cliente (público)
    /// </summary>
    [EnableRateLimiting(AuthRateLimit.Policy)]
    [HttpPost("registro")]
    [ProducesResponseType(201, Type = typeof(ClienteResponseDto))]
    [ProducesResponseType(429)]
    [ProducesResponseType(400)]
    [ProducesResponseType(500)]
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
    [ProducesResponseType(200, Type = typeof(void))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
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
    [ProducesResponseType(200, Type = typeof(void))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
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
