import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { AuthService } from '../api/auth/auth.service';
import { authGuard, guestGuard } from './auth.guard';

describe('authGuard', () => {
  it('permite acesso quando autenticado', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => true } },
        { provide: Router, useValue: { createUrlTree: vi.fn() } },
      ],
    });

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any);
      expect(result).toBe(true);
    });
  });

  it('redireciona para login quando não autenticado', () => {
    const createUrlTree = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => false } },
        { provide: Router, useValue: { createUrlTree } },
      ],
    });

    TestBed.runInInjectionContext(() => {
      authGuard({} as any, {} as any);
      expect(createUrlTree).toHaveBeenCalledWith(['/login']);
    });
  });
});

describe('guestGuard', () => {
  it('permite acesso quando não autenticado', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => false } },
        { provide: Router, useValue: { createUrlTree: vi.fn() } },
      ],
    });

    TestBed.runInInjectionContext(() => {
      const result = guestGuard({} as any, {} as any);
      expect(result).toBe(true);
    });
  });
});
