import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { RestService } from '../../services/rest/rest.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let restMock: { getApiUrl: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    restMock = {
      getApiUrl: vi.fn((action: string) => `/api/${action}`),
      post: vi.fn(),
    };
    routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: RestService, useValue: restMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login armazena token e marca autenticado', () => {
    restMock.post.mockReturnValue(of({ token: 'abc', expiration: '2099-01-01T00:00:00Z' }));

    service.login({ username: 'admin', password: 'admin123' }).subscribe();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.getToken()).toBe('abc');
  });
});
