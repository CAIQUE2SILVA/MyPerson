using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MyPerson.Api.Controllers;
using MyPerson.Api.Models.Auth;
using Xunit;

namespace MyPerson.Api.Tests.Controllers;

public class AuthControllerTests
{
    private static IConfiguration BuildConfiguration()
    {
        return new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "chave-super-secreta-minimo-32-caracteres-!",
                ["Jwt:Issuer"] = "MyPerson",
                ["Jwt:Audience"] = "MyPersonUsers",
                ["Auth:AdminUser"] = "admin",
                ["Auth:AdminPassword"] = "admin123"
            })
            .Build();
    }

    [Fact]
    public void Login_ComCredenciaisValidas_RetornaToken()
    {
        var controller = new AuthController(BuildConfiguration());
        var request = new LoginRequest { Username = "admin", Password = "admin123" };

        var result = controller.Login(request) as OkObjectResult;

        Assert.NotNull(result);
        var response = Assert.IsType<LoginResponse>(result.Value);
        Assert.False(string.IsNullOrWhiteSpace(response.Token));
        Assert.True(response.Expiration > DateTime.UtcNow);
    }

    [Fact]
    public void Login_ComCredenciaisInvalidas_RetornaUnauthorized()
    {
        var controller = new AuthController(BuildConfiguration());
        var request = new LoginRequest { Username = "admin", Password = "senha-errada" };

        var result = controller.Login(request) as UnauthorizedObjectResult;

        Assert.NotNull(result);
    }
}
