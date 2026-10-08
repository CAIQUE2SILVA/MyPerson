using System.Net;
using System.Reflection;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using MyPerson.Api;
using MyPerson.Api.Controllers;
using Xunit;

namespace MyPerson.Api.Tests;

public class AuthRateLimitTests
{
    [Fact]
    public void SextaTentativaNoMesmoIp_ERecusada()
    {
        using var limiter = new FixedWindowRateLimiter(AuthRateLimit.CreateOptions());

        for (var i = 0; i < AuthRateLimit.PermitLimit; i++)
        {
            using var lease = limiter.AttemptAcquire(1);
            Assert.True(lease.IsAcquired);
        }

        using var blocked = limiter.AttemptAcquire(1);
        Assert.False(blocked.IsAcquired);
    }

    [Fact]
    public void IpsDiferentes_NaoCompartilhamOLimite()
    {
        Assert.NotEqual(
            AuthRateLimit.ClientKey(IPAddress.Parse("203.0.113.1")),
            AuthRateLimit.ClientKey(IPAddress.Parse("203.0.113.2")));
        Assert.Equal("unknown", AuthRateLimit.ClientKey(null));
    }

    [Fact]
    public void LoginERegistro_UsamAPoliticaAuth()
    {
        Assert.Equal(AuthRateLimit.Policy, Politica(typeof(AuthController), nameof(AuthController.Login)));
        Assert.Equal(AuthRateLimit.Policy, Politica(typeof(ClientesController), nameof(ClientesController.RegistrarCliente)));
    }

    private static string? Politica(Type controller, string method) =>
        controller.GetMethod(method)!
            .GetCustomAttribute<EnableRateLimitingAttribute>()?
            .PolicyName;
}
