export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  categoriaId?: number;
  categoriaNome?: string;
  imagemUrl?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface CriarProdutoRequest {
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  categoriaId?: number;
  imagemUrl?: string;
  ativo: boolean;
}

export interface AtualizarProdutoRequest {
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  categoriaId?: number;
  imagemUrl?: string;
  ativo: boolean;
}
