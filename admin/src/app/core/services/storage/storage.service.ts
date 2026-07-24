import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

export const ACCESS_TOKEN_KEY = 'myperson_admin_token';
export const TOKEN_EXPIRATION_KEY = 'myperson_admin_token_exp';

/**
 * Wrapper SSR-safe sobre o localStorage do navegador.
 * Retorna valores nulos / vira no-op quando executado no servidor (SSR),
 * evitando erros de "localStorage is not defined" durante o prerender.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);

  get(key: string): string | null {
    return this.storage?.getItem(key) ?? null;
  }

  set(key: string, value: string): void {
    this.storage?.setItem(key, value);
  }

  remove(key: string): void {
    this.storage?.removeItem(key);
  }

  clear(): void {
    this.storage?.clear();
  }

  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }
}
