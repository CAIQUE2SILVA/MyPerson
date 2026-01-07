using System.ComponentModel.DataAnnotations;

namespace MyPerson.Api.Models.DTOs;

public class AtualizarProdutoDto
{
    [Required(ErrorMessage = "O nome do produto é obrigatório")]
    [StringLength(200, ErrorMessage = "O nome deve ter no máximo 200 caracteres")]
    public string Nome { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "A descrição deve ter no máximo 1000 caracteres")]
    public string? Descricao { get; set; }

    [Required(ErrorMessage = "O preço é obrigatório")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O preço deve ser maior que zero")]
    public decimal Preco { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "O estoque não pode ser negativo")]
    public int Estoque { get; set; }

    [StringLength(100, ErrorMessage = "A categoria deve ter no máximo 100 caracteres")]
    public string? Categoria { get; set; }

    [StringLength(500, ErrorMessage = "A URL da imagem deve ter no máximo 500 caracteres")]
    public string? ImagemUrl { get; set; }

    public bool Ativo { get; set; }
}

