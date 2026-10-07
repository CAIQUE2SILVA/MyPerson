using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using MyPerson.Api.Controllers;
using MyPerson.Api.Data;
using MyPerson.Api.Models;
using MyPerson.Api.Models.DTOs;
using Xunit;

namespace MyPerson.Api.Tests.Controllers;

public class ProdutosControllerTests
{
    private static ProdutosController CreateController(ApplicationDbContext db)
    {
        return new ProdutosController(db, NullLogger<ProdutosController>.Instance);
    }

    private static ApplicationDbContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetVitrine_ListaSomenteAtivos_SemEstoque()
    {
        await using var db = CreateDb();
        db.Categorias.Add(new Categoria { Id = 1, Nome = "Feminino", Slug = "feminino" });
        db.Produtos.AddRange(
            new Produto
            {
                Nome = "Ativo",
                Preco = 10,
                Estoque = 7,
                Ativo = true,
                CategoriaId = 1,
                DataCriacao = DateTime.UtcNow
            },
            new Produto
            {
                Nome = "Inativo",
                Preco = 20,
                Estoque = 3,
                Ativo = false,
                DataCriacao = DateTime.UtcNow
            });
        await db.SaveChangesAsync();

        var result = await CreateController(db).GetVitrine();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var lista = Assert.IsAssignableFrom<IEnumerable<ProdutoVitrineDto>>(ok.Value).ToList();
        var item = Assert.Single(lista);
        Assert.Equal("Ativo", item.Nome);
        Assert.Equal("feminino", item.CategoriaSlug);
        Assert.DoesNotContain(typeof(ProdutoVitrineDto).GetProperties(), p => p.Name == "Estoque");
    }

    [Fact]
    public async Task GetProdutoVitrine_InativoOuInexistente_RetornaNotFound()
    {
        await using var db = CreateDb();
        db.Produtos.Add(new Produto
        {
            Id = 5,
            Nome = "Inativo",
            Preco = 10,
            Ativo = false,
            DataCriacao = DateTime.UtcNow
        });
        await db.SaveChangesAsync();
        var controller = CreateController(db);

        var inativo = await controller.GetProdutoVitrine(5);
        var ausente = await controller.GetProdutoVitrine(99);

        Assert.IsType<NotFoundObjectResult>(inativo.Result);
        Assert.IsType<NotFoundObjectResult>(ausente.Result);
    }

    [Fact]
    public void GetProdutos_ExigeAutenticacao()
    {
        Assert.NotNull(typeof(ProdutosController).GetMethod(nameof(ProdutosController.GetProdutos))!
            .GetCustomAttribute<AuthorizeAttribute>());
        Assert.NotNull(typeof(ProdutosController).GetMethod(nameof(ProdutosController.GetProduto))!
            .GetCustomAttribute<AuthorizeAttribute>());
        Assert.Null(typeof(ProdutosController).GetMethod(nameof(ProdutosController.GetVitrine))!
            .GetCustomAttribute<AuthorizeAttribute>());
    }
}
