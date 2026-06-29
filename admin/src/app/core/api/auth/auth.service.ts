import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { LoginRequest } from '../../../shared/models/auth/login-request.model';
import { LoginResponse } from '../../../shared/models/auth/login-response.model';
import { RestService } from '../../services/rest/rest.service';

const TOKEN_KEY = 'myperson_admin_token';
const EXPIRATION_KEY = 'myperson_admin_token_exp';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly rest = inject(RestService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly authenticated = signal(false);

  constructor() {
    afterNextRender(() => {
      this.authenticated.set(this.hasValidToken());
    });
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.rest.post<LoginResponse>('auth/login', credentials, { showError: false }).pipe(
      tap((response) => {
        this.storeSession(response);
        this.authenticated.set(true);
      }),
    );
  }

  logout(): void {
    this.clearSession();
    this.authenticated.set(false);
    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.getStorage()?.getItem(TOKEN_KEY) ?? null;
  }

  isAuthenticated(): boolean {
    return this.authenticated() || this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const storage = this.getStorage();
    if (!storage) {
      return false;
    }

    const token = storage.getItem(TOKEN_KEY);
    const expiration = storage.getItem(EXPIRATION_KEY);

    if (!token || !expiration) {
      return false;
    }

    return new Date(expiration).getTime() > Date.now();
  }

  private storeSession(response: LoginResponse): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    storage.setItem(TOKEN_KEY, response.token);
    storage.setItem(EXPIRATION_KEY, response.expiration);
  }

  private clearSession(): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    storage.removeItem(TOKEN_KEY);
    storage.removeItem(EXPIRATION_KEY);
  }

  private getStorage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }
}
