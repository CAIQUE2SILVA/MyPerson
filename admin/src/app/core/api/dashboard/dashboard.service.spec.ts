import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { CategoriaService } from '../categorias/categoria.service';
import { ClienteService } from '../clientes/cliente.service';
import { ProdutoService } from '../produtos/produto.service';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let produtoMock: { listar: ReturnType<typeof vi.fn> };
  let categoriaMock: { listar: ReturnType<typeof vi.fn> };
  let clienteMock: { listar: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    produtoMock = { listar: vi.fn(() => of([{ id: 1 }, { id: 2 }])) };
    categoriaMock = { listar: vi.fn(() => of([{ id: 1 }])) };
    clienteMock = { listar: vi.fn(() => of([{ id: 1 }, { id: 2 }, { id: 3 }])) };

    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        { provide: ProdutoService, useValue: produtoMock },
        { provide: CategoriaService, useValue: categoriaMock },
        { provide: ClienteService, useValue: clienteMock },
      ],
    });

    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('carregar popula contagem de resumo', () => {
    service.carregar();

    expect(service.resumo().totalProdutos).toBe(2);
    expect(service.resumo().totalCategorias).toBe(1);
    expect(service.resumo().totalClientes).toBe(3);
    expect(service.carregando()).toBe(false);
  });
});
