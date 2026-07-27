export interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

export interface CriarCategoriaRequest {
  nome: string;
  slug: string;
}

export interface AtualizarCategoriaRequest {
  nome: string;
  slug: string;
}
