using System.ComponentModel.DataAnnotations;

namespace MyPerson.Api.Models.DTOs;

public class CriarClienteDto
{
    [Required(ErrorMessage = "O nome é obrigatório")]
    [StringLength(200, ErrorMessage = "O nome deve ter no máximo 200 caracteres")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O e-mail é obrigatório")]
    [EmailAddress(ErrorMessage = "E-mail inválido")]
    [StringLength(200, ErrorMessage = "O e-mail deve ter no máximo 200 caracteres")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "A senha é obrigatória")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "A senha deve ter entre 6 e 100 caracteres")]
    public string Senha { get; set; } = string.Empty;

    [StringLength(20, ErrorMessage = "O telefone deve ter no máximo 20 caracteres")]
    public string? Telefone { get; set; }
}
