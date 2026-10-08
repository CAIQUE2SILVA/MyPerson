using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using MyPerson.Api;
using MyPerson.Api.Controllers;
using MyPerson.Api.Data;
using MyPerson.Api.Models;
using MyPerson.Api.Models.DTOs;
using Xunit;

namespace MyPerson.Api.Tests.Controllers;

public class ClientesEntrarTests
{
    private static (ClientesController Controller, BloqueioTentativas Bloqueio) Create(string? senha = "senha123")
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var db = new ApplicationDbContext(options);
        if (senha != null)
        {
            db.Clientes.Add(new Cliente
            {
                Nome = "Ana",
                Email = "ana@exemplo.com",
                SenhaHash = new PasswordHasher<Cliente>().HashPassword(null!, senha),
                Ativo = true,
                DataCriacao = DateTime.UtcNow
            });
            db.SaveChanges();
        }

        var bloqueio = new BloqueioTentativas();
        var controller = new ClientesController(db, NullLogger<ClientesController>.Instance, bloqueio);
        return (controller, bloqueio);
    }

    [Fact]
    public async Task Entrar_ComSenhaCorreta_RetornaId()
    {
        var (controller, _) = Create();

        var result = await controller.Entrar(new EntrarClienteDto { Email = "ana@exemplo.com", Senha = "senha123" });

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public async Task Entrar_AposCincoSenhasErradas_Bloqueia()
    {
        var (controller, _) = Create();
        var ruim = new EntrarClienteDto { Email = "ana@exemplo.com", Senha = "errada" };

        for (var i = 0; i < BloqueioTentativas.MaxFalhas; i++)
            await controller.Entrar(ruim);

        var bloqueio = await controller.Entrar(new EntrarClienteDto { Email = "ana@exemplo.com", Senha = "senha123" }) as ObjectResult;

        Assert.NotNull(bloqueio);
        Assert.Equal(429, bloqueio.StatusCode);
    }

    [Fact]
    public async Task Entrar_EmailInexistente_NaoBloqueiaOutroCliente()
    {
        var (controller, bloqueio) = Create();

        for (var i = 0; i < BloqueioTentativas.MaxFalhas; i++)
            await controller.Entrar(new EntrarClienteDto { Email = "ninguem@exemplo.com", Senha = "errada" });

        Assert.False(bloqueio.Bloqueado(BloqueioTentativas.ChaveCliente("ana@exemplo.com"), DateTime.UtcNow, out _));
        var result = await controller.Entrar(new EntrarClienteDto { Email = "ana@exemplo.com", Senha = "senha123" });
        Assert.IsType<OkObjectResult>(result);
    }
}
