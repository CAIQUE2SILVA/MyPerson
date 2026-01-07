using System.ComponentModel.DataAnnotations;

namespace MyPerson.Api.Models;

public class Produto
{
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Nome { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Descricao { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "O preço deve ser maior que zero")]
    public decimal Preco { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "O estoque não pode ser negativo")]
    public int Estoque { get; set; }

    [StringLength(100)]
    public string? Categoria { get; set; }

    [StringLength(500)]
    public string? ImagemUrl { get; set; }

    public bool Ativo { get; set; } = true;

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    public DateTime? DataAtualizacao { get; set; }
}

