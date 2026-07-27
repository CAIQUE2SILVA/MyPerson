import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ProdutoService } from '../../../core/api/produtos/produto.service';
import { ProdutoList } from './produto-list';

describe('ProdutoList', () => {
  let component: ProdutoList;
  let fixture: ComponentFixture<ProdutoList>;
  let produtoMock: { listar: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    produtoMock = { listar: vi.fn(() => of([{ id: 1, nome: 'Produto', preco: 10, estoque: 1, ativo: true }])) };

    await TestBed.configureTestingModule({
      imports: [ProdutoList],
      providers: [
        provideRouter([]),
        { provide: ProdutoService, useValue: produtoMock },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carrega produtos ao inicializar', () => {
    expect(component.produtos()).toHaveLength(1);
  });
});
