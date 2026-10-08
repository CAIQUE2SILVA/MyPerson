import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from '../../../core/api/auth/auth.service';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authMock: { login: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authMock = { login: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: AuthService, useValue: authMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('bloqueia o formulário quando a API recusa novas tentativas', () => {
    authMock.login.mockReturnValue(
      throwError(() => new Error('Muitas tentativas. Tente novamente em instantes.')),
    );
    component.form.setValue({ username: 'admin', password: 'errada' });

    component.submit();

    expect(component.bloqueado()).toBe(true);
    expect(component.form.disabled).toBe(true);
    expect(component.errorMessage()).toContain('Muitas tentativas');
  });
});
