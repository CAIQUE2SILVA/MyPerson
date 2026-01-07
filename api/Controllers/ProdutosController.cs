using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPerson.Api.Data;
using MyPerson.Api.Models;
using MyPerson.Api.Models.DTOs;

namespace MyPerson.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProdutosController> _logger;

    public ProdutosController(ApplicationDbContext context, ILogger<ProdutosController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Lista todos os produtos
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProdutoResponseDto>>> GetProdutos()
    {
        try
        {
            var produtos = await _context.Produtos
                .OrderByDescending(p => p.DataCriacao)
                .Select(p => new ProdutoResponseDto
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Descricao = p.Descricao,
                    Preco = p.Preco,
                    Estoque = p.Estoque,
                    Categoria = p.Categoria,
                    ImagemUrl = p.ImagemUrl,
                    Ativo = p.Ativo,
                    DataCriacao = p.DataCriacao,
                    DataAtualizacao = p.DataAtualizacao
                })
                .ToListAsync();

            return Ok(produtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar produtos");
            return StatusCode(500, new { message = "Erro interno ao buscar produtos" });
        }
    }

    /// <summary>
    /// Busca um produto por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ProdutoResponseDto>> GetProduto(int id)
    {
        try
        {
            var produto = await _context.Produtos.FindAsync(id);

            if (produto == null)
            {
                return NotFound(new { message = $"Produto com ID {id} não encontrado" });
            }

            var produtoDto = new ProdutoResponseDto
            {
                Id = produto.Id,
                Nome = produto.Nome,
                Descricao = produto.Descricao,
                Preco = produto.Preco,
                Estoque = produto.Estoque,
                Categoria = produto.Categoria,
                ImagemUrl = produto.ImagemUrl,
                Ativo = produto.Ativo,
                DataCriacao = produto.DataCriacao,
                DataAtualizacao = produto.DataAtualizacao
            };

            return Ok(produtoDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar produto {Id}", id);
            return StatusCode(500, new { message = "Erro interno ao buscar produto" });
        }
    }

    /// <summary>
    /// Cria um novo produto
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ProdutoResponseDto>> CriarProduto(CriarProdutoDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var produto = new Produto
            {
                Nome = dto.Nome,
                Descricao = dto.Descricao,
                Preco = dto.Preco,
                Estoque = dto.Estoque,
                Categoria = dto.Categoria,
                ImagemUrl = dto.ImagemUrl,
                Ativo = dto.Ativo,
                DataCriacao = DateTime.UtcNow
            };

            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();

            var produtoResponse = new ProdutoResponseDto
            {
                Id = produto.Id,
                Nome = produto.Nome,
                Descricao = produto.Descricao,
                Preco = produto.Preco,
                Estoque = produto.Estoque,
                Categoria = produto.Categoria,
                ImagemUrl = produto.ImagemUrl,
                Ativo = produto.Ativo,
                DataCriacao = produto.DataCriacao,
                DataAtualizacao = produto.DataAtualizacao
            };

            return CreatedAtAction(nameof(GetProduto), new { id = produto.Id }, produtoResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar produto");
            return StatusCode(500, new { message = "Erro interno ao criar produto" });
        }
    }

    /// <summary>
    /// Atualiza um produto existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> AtualizarProduto(int id, AtualizarProdutoDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var produto = await _context.Produtos.FindAsync(id);

            if (produto == null)
            {
                return NotFound(new { message = $"Produto com ID {id} não encontrado" });
            }

            produto.Nome = dto.Nome;
            produto.Descricao = dto.Descricao;
            produto.Preco = dto.Preco;
            produto.Estoque = dto.Estoque;
            produto.Categoria = dto.Categoria;
            produto.ImagemUrl = dto.ImagemUrl;
            produto.Ativo = dto.Ativo;
            produto.DataAtualizacao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar produto {Id}", id);
            return StatusCode(500, new { message = "Erro interno ao atualizar produto" });
        }
    }

    /// <summary>
    /// Deleta um produto
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletarProduto(int id)
    {
        try
        {
            var produto = await _context.Produtos.FindAsync(id);

            if (produto == null)
            {
                return NotFound(new { message = $"Produto com ID {id} não encontrado" });
            }

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar produto {Id}", id);
            return StatusCode(500, new { message = "Erro interno ao deletar produto" });
        }
    }
}











