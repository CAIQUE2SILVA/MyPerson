using System.ComponentModel.DataAnnotations;

namespace MyPerson.Api.Models.DTOs;

public class AtualizarCategoriaDto
{
    [Required(ErrorMessage = "O nome da categoria é obrigatório")]
    [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O slug da categoria é obrigatório")]
    [StringLength(100, ErrorMessage = "O slug deve ter no máximo 100 caracteres")]
    public string Slug { get; set; } = string.Empty;
}
