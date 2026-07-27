import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { RestService } from '../../services/rest/rest.service';
import { ProdutoService } from './produto.service';

const produtoMock = {
  id: 1,
  nome: 'Produto A',
  descricao: 'Descrição',
  preco: 10.5,
  estoque: 5,
  ativo: true,
  dataCriacao: '2026-01-01T00:00:00Z',
};

describe('ProdutoService', () => {
  let service: ProdutoService;
  let restMock: {
    getApiUrl: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    restMock = {
      getApiUrl: vi.fn((action: string) => `/api/${action}`),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [ProdutoService, { provide: RestService, useValue: restMock }],
    });

    service = TestBed.inject(ProdutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('listar retorna produtos', () => {
    restMock.get.mockReturnValue(of([produtoMock]));

    service.listar().subscribe((produtos) => {
      expect(produtos).toHaveLength(1);
      expect(produtos[0].nome).toBe('Produto A');
    });
  });

  it('criar envia POST para /api/produtos', () => {
    restMock.post.mockReturnValue(of(produtoMock));

    service.criar({ nome: 'Novo', preco: 1, estoque: 1, ativo: true }).subscribe();

    expect(restMock.post).toHaveBeenCalledWith('/api/produtos', { nome: 'Novo', preco: 1, estoque: 1, ativo: true });
  });
});
