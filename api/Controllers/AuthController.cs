using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyPerson.Api.Models.Auth;

namespace MyPerson.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var adminUser = _configuration["Auth:AdminUser"] ?? "admin";
        var adminPass = _configuration["Auth:AdminPassword"] ?? throw new InvalidOperationException("Auth:AdminPassword not configured");

        if (request.Username != adminUser || request.Password != adminPass)
            return Unauthorized(new { message = "Usuário ou senha inválidos" });

        var token = GenerateJwtToken(request.Username);

        return Ok(new LoginResponse
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddHours(8)
        });
    }

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
