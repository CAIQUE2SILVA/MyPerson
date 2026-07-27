export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface CriarClienteRequest {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}

export interface AtualizarClienteRequest {
  nome: string;
  email: string;
  telefone?: string;
  ativo: boolean;
}
