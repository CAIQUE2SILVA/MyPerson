import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { CategoriaService } from '../../../core/api/categorias/categoria.service';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { ProdutoService } from '../../../core/api/produtos/produto.service';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        { provide: ProdutoService, useValue: { listar: () => of([]) } },
        { provide: CategoriaService, useValue: { listar: () => of([]) } },
        { provide: ClienteService, useValue: { listar: () => of([]) } },
        { provide: MessageService, useValue: { add: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
