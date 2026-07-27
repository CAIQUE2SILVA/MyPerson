import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { CategoriaService } from '../../../core/api/categorias/categoria.service';
import { CategoriaList } from './categoria-list';

describe('CategoriaList', () => {
  let component: CategoriaList;
  let fixture: ComponentFixture<CategoriaList>;
  let categoriaMock: { listar: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    categoriaMock = { listar: vi.fn(() => of([{ id: 1, nome: 'Cat', slug: 'cat' }])) };

    await TestBed.configureTestingModule({
      imports: [CategoriaList],
      providers: [
        provideRouter([]),
        { provide: CategoriaService, useValue: categoriaMock },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carrega categorias ao inicializar', () => {
    expect(component.categorias()).toHaveLength(1);
  });
});
