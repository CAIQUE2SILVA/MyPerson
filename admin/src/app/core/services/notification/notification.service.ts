import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly messageService = inject(MessageService);

  success(detail: string, summary = 'Sucesso'): void {
    this.messageService.add({ severity: 'success', summary, detail, life: 4000 });
  }

  error(detail: string, summary = 'Ops, ocorreu um erro'): void {
    this.messageService.add({ severity: 'error', summary, detail, life: 6000 });
  }

  warn(detail: string, summary = 'Atenção'): void {
    this.messageService.add({ severity: 'warn', summary, detail, life: 5000 });
  }

  info(detail: string, summary = 'Info'): void {
    this.messageService.add({ severity: 'info', summary, detail, life: 4000 });
  }
}
