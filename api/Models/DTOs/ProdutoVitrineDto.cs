namespace MyPerson.Api.Models.DTOs;

public class ProdutoVitrineDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public decimal Preco { get; set; }
    public int? CategoriaId { get; set; }
    public string? CategoriaNome { get; set; }
    public string? CategoriaSlug { get; set; }
    public string? ImagemUrl { get; set; }
}
