import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { RestService } from '../../services/rest/rest.service';
import { ClienteService } from './cliente.service';

const clienteMock = {
  id: 1,
  nome: 'Cliente A',
  email: 'a@example.com',
  ativo: true,
  dataCriacao: '2026-01-01T00:00:00Z',
};

describe('ClienteService', () => {
  let service: ClienteService;
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
      providers: [ClienteService, { provide: RestService, useValue: restMock }],
    });

    service = TestBed.inject(ClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('listar retorna clientes', () => {
    restMock.get.mockReturnValue(of([clienteMock]));

    service.listar().subscribe((clientes) => {
      expect(clientes).toHaveLength(1);
      expect(clientes[0].email).toBe('a@example.com');
    });
  });

  it('criar usa endpoint /api/clientes/registro sem autenticação', () => {
    restMock.post.mockReturnValue(of(clienteMock));

    service.criar({ nome: 'Novo', email: 'novo@example.com', senha: '123456' }).subscribe();

    expect(restMock.post).toHaveBeenCalledWith(
      '/api/clientes/registro',
      { nome: 'Novo', email: 'novo@example.com', senha: '123456' },
      undefined,
      false,
      false,
    );
  });
});
