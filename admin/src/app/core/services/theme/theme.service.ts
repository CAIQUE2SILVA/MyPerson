import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Injectable, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';

const THEME_KEY = 'myperson_admin_theme';
const DARK_CLASS = 'p-dark';

type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isDark = signal(false);

  constructor() {
    afterNextRender(() => {
      const saved = this.loadSavedTheme();
      this.setTheme(saved);
    });
  }

  toggle(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  private setTheme(mode: ThemeMode): void {
    this.isDark.set(mode === 'dark');
    this.applyToDom();
    this.saveTheme(mode);
  }

  private applyToDom(): void {
    const html = this.document.documentElement;
    if (!html) {
      return;
    }

    if (this.isDark()) {
      html.classList.add(DARK_CLASS);
      html.style.colorScheme = 'dark';
    } else {
      html.classList.remove(DARK_CLASS);
      html.style.colorScheme = 'light';
    }
  }

  private loadSavedTheme(): ThemeMode {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }
    const saved = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    if (saved) {
      return saved;
    }
    return typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private saveTheme(mode: ThemeMode): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem(THEME_KEY, mode);
  }
}
