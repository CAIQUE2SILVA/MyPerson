import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';

import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { Cliente } from '../../../shared/models/cliente/cliente.model';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
})
export class ClienteList {
  private readonly clienteService = inject(ClienteService);
  private readonly notification = inject(NotificationService);

  readonly clientes = signal<Cliente[]>([]);
  readonly carregando = signal(false);
  readonly colunas = ['nome', 'email', 'telefone', 'ativo', 'acoes'];

  constructor() {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.clienteService
      .listar()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (clientes) => this.clientes.set(clientes),
        error: () => this.notification.error('Erro ao carregar clientes.'),
      });
  }

  excluir(cliente: Cliente): void {
    if (!confirm(`Deseja excluir o cliente "${cliente.nome}"?`)) {
      return;
    }
    this.clienteService.excluir(cliente.id).subscribe({
      next: () => {
        this.clientes.update((lista) => lista.filter((c) => c.id !== cliente.id));
        this.notification.success('Cliente excluído com sucesso.');
      },
      error: () => this.notification.error('Erro ao excluir cliente.'),
    });
  }
}
