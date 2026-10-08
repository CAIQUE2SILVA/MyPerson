using MyPerson.Api;
using Xunit;

namespace MyPerson.Api.Tests;

public class BloqueioTentativasTests
{
    [Fact]
    public void CincoFalhas_BloqueiamPorQuinzeMinutos_EAdminNaoTravaCliente()
    {
        var bloqueio = new BloqueioTentativas();
        var agora = new DateTime(2026, 10, 8, 12, 0, 0, DateTimeKind.Utc);
        var admin = BloqueioTentativas.ChaveAdmin("Admin");
        var cliente = BloqueioTentativas.ChaveCliente("a@exemplo.com");

        for (var i = 0; i < BloqueioTentativas.MaxFalhas; i++)
            bloqueio.RegistrarFalha(admin, agora);

        Assert.True(bloqueio.Bloqueado(admin, agora, out var segundos));
        Assert.Equal((int)BloqueioTentativas.Duracao.TotalSeconds, segundos);
        Assert.False(bloqueio.Bloqueado(cliente, agora, out _));
        Assert.False(bloqueio.Bloqueado(admin, agora.Add(BloqueioTentativas.Duracao).AddSeconds(1), out _));
    }

    [Fact]
    public void Sucesso_ZeraOBloqueio()
    {
        var bloqueio = new BloqueioTentativas();
        var agora = DateTime.UtcNow;
        var chave = BloqueioTentativas.ChaveCliente("a@exemplo.com");

        for (var i = 0; i < BloqueioTentativas.MaxFalhas; i++)
            bloqueio.RegistrarFalha(chave, agora);

        bloqueio.RegistrarSucesso(chave);

        Assert.False(bloqueio.Bloqueado(chave, agora, out _));
    }
}
