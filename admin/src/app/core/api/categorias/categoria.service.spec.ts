import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { RestService } from '../../services/rest/rest.service';
import { CategoriaService } from './categoria.service';

const categoriaMock = { id: 1, nome: 'Categoria A', slug: 'categoria-a' };

describe('CategoriaService', () => {
  let service: CategoriaService;
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
      providers: [CategoriaService, { provide: RestService, useValue: restMock }],
    });

    service = TestBed.inject(CategoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('listar retorna categorias', () => {
    restMock.get.mockReturnValue(of([categoriaMock]));

    service.listar().subscribe((categorias) => {
      expect(categorias).toHaveLength(1);
      expect(categorias[0].slug).toBe('categoria-a');
    });
  });
});
