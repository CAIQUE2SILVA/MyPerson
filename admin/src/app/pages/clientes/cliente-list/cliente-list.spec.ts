import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { ClienteList } from './cliente-list';

describe('ClienteList', () => {
  let component: ClienteList;
  let fixture: ComponentFixture<ClienteList>;
  let clienteMock: { listar: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    clienteMock = { listar: vi.fn(() => of([{ id: 1, nome: 'Cliente', email: 'c@example.com', ativo: true }])) };

    await TestBed.configureTestingModule({
      imports: [ClienteList],
      providers: [
        provideRouter([]),
        { provide: ClienteService, useValue: clienteMock },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carrega clientes ao inicializar', () => {
    expect(component.clientes()).toHaveLength(1);
  });
});
