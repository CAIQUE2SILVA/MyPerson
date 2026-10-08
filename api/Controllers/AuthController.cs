using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MyPerson.Api;
using Microsoft.IdentityModel.Tokens;
using MyPerson.Api.Models.Auth;

namespace MyPerson.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly BloqueioTentativas _bloqueio;

    public AuthController(IConfiguration configuration, BloqueioTentativas bloqueio)
    {
        _configuration = configuration;
        _bloqueio = bloqueio;
    }

    [EnableRateLimiting(AuthRateLimit.Policy)]
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var chave = BloqueioTentativas.ChaveAdmin(request.Username);
        if (_bloqueio.Bloqueado(chave, DateTime.UtcNow, out var retryAfterSeconds))
            return Bloqueado(retryAfterSeconds);

        var adminUser = _configuration["Auth:AdminUser"] ?? "admin";
        var adminPass = _configuration["Auth:AdminPassword"] ?? throw new InvalidOperationException("Auth:AdminPassword not configured");

        if (request.Username != adminUser || request.Password != adminPass)
        {
            if (string.Equals(request.Username, adminUser, StringComparison.OrdinalIgnoreCase))
            {
                _bloqueio.RegistrarFalha(chave, DateTime.UtcNow);
                if (_bloqueio.Bloqueado(chave, DateTime.UtcNow, out retryAfterSeconds))
                    return Bloqueado(retryAfterSeconds);
            }

            return Unauthorized(new { message = "Usuário ou senha inválidos" });
        }

        _bloqueio.RegistrarSucesso(chave);
        var token = GenerateJwtToken(request.Username);

        return Ok(new LoginResponse
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddHours(8)
        });
    }

    private ObjectResult Bloqueado(int retryAfterSeconds) =>
        StatusCode(StatusCodes.Status429TooManyRequests, new
        {
            message = BloqueioTentativas.Mensagem,
            retryAfterSeconds
        });

    private string GenerateJwtToken(string username)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not configured");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, "Admin"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
