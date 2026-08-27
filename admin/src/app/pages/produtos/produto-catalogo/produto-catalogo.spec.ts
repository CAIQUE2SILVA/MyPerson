import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ProdutoCatalogo } from './produto-catalogo';
import { ProdutoService } from '../../../core/api/produtos/produto.service';
import { CategoriaService } from '../../../core/api/categorias/categoria.service';

describe('ProdutoCatalogo', () => {
  let component: ProdutoCatalogo;
  let fixture: ComponentFixture<ProdutoCatalogo>;
  let produtoMock: { listar: ReturnType<typeof vi.fn> };
  let categoriaMock: { listar: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    produtoMock = { listar: vi.fn(() => of([{ id: 1, nome: 'Produto', preco: 10, estoque: 1, ativo: true, dataCriacao: '2026-01-01T00:00:00Z' }])) };
    categoriaMock = { listar: vi.fn(() => of([{ id: 1, nome: 'Categoria', slug: 'categoria' }])) };

    await TestBed.configureTestingModule({
      imports: [ProdutoCatalogo],
      providers: [
        provideRouter([]),
        { provide: ProdutoService, useValue: produtoMock },
        { provide: CategoriaService, useValue: categoriaMock },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoCatalogo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carrega produtos e categorias ao inicializar', () => {
    expect(component.produtos()).toHaveLength(1);
    expect(component.categorias()).toHaveLength(1);
    expect(component.produtosFiltrados()).toHaveLength(1);
  });

  it('filtra produtos por termo de busca', () => {
    component.produtos.set([
      { id: 1, nome: 'Camiseta', preco: 10, estoque: 1, ativo: true, dataCriacao: '2026-01-01T00:00:00Z' },
      { id: 2, nome: 'Calça', preco: 20, estoque: 2, ativo: true, dataCriacao: '2026-01-01T00:00:00Z' },
    ]);
    component.filtros.controls.busca.setValue('calça');
    fixture.detectChanges();

    expect(component.produtosFiltrados()).toHaveLength(1);
    expect(component.produtosFiltrados()[0].nome).toBe('Calça');
  });

  it('filtra produtos por categoria', () => {
    component.produtos.set([
      { id: 1, nome: 'Camiseta', categoriaId: 1, preco: 10, estoque: 1, ativo: true, dataCriacao: '2026-01-01T00:00:00Z' },
      { id: 2, nome: 'Calça', categoriaId: 2, preco: 20, estoque: 2, ativo: true, dataCriacao: '2026-01-01T00:00:00Z' },
    ]);
    component.filtros.controls.categoriaId.setValue(2);
    fixture.detectChanges();

    expect(component.produtosFiltrados()).toHaveLength(1);
    expect(component.produtosFiltrados()[0].nome).toBe('Calça');
  });
});
