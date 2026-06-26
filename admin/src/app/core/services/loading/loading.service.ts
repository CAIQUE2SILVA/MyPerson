import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly activeRequests = signal(0);

  readonly blocked = computed(() => this.activeRequests() > 0);

  show(): void {
    this.activeRequests.update((count) => count + 1);
  }

  hide(): void {
    this.activeRequests.update((count) => Math.max(0, count - 1));
  }
}
