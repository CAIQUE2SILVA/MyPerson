import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { NotificationService } from '../notification/notification.service';
import { ACCESS_TOKEN_KEY, StorageService } from '../storage/storage.service';
import { RestService } from './rest.service';

describe('RestService', () => {
  let service: RestService;
  let httpClientMock: ReturnType<typeof vi.fn>;
  let notificationMock: { error: ReturnType<typeof vi.fn> };
  let storageMock: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    httpClientMock = vi.fn();
    notificationMock = { error: vi.fn() };
    storageMock = { get: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        RestService,
        { provide: HttpClient, useValue: { get: httpClientMock, post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() } },
        { provide: NotificationService, useValue: notificationMock },
        { provide: StorageService, useValue: storageMock },
      ],
    });

    service = TestBed.inject(RestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getApiUrl concatena base e ação', () => {
    expect(service.getApiUrl('produtos')).toBe('/api/produtos');
    expect(service.getApiUrl('/produtos')).toBe('/api/produtos');
  });

  it('get anexa token quando autenticado', () => {
    storageMock.get.mockReturnValue('token-123');
    httpClientMock.mockReturnValue(of({}));

    service.get('http://localhost/api/produtos').subscribe();

    expect(httpClientMock).toHaveBeenCalledWith('http://localhost/api/produtos', {
      params: undefined,
      headers: { authorization: 'Bearer token-123' },
    });
  });

  it('get notifica erro quando errorAlert=true', () => {
    httpClientMock.mockReturnValue(throwError(() => new HttpErrorResponse({ error: { message: 'Falha' } })));

    service.get('http://localhost/api/produtos').subscribe({ error: () => {} });

    expect(notificationMock.error).toHaveBeenCalledWith('Falha');
  });
});
