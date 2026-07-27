import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';

import { CategoriaService } from '../../../core/api/categorias/categoria.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { Categoria } from '../../../shared/models/categoria/categoria.model';

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.html',
  styleUrl: './categoria-list.scss',
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
export class CategoriaList {
  private readonly categoriaService = inject(CategoriaService);
  private readonly notification = inject(NotificationService);

  readonly categorias = signal<Categoria[]>([]);
  readonly carregando = signal(false);
  readonly colunas = ['nome', 'slug', 'acoes'];

  constructor() {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.categoriaService
      .listar()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (categorias) => this.categorias.set(categorias),
        error: () => this.notification.error('Erro ao carregar categorias.'),
      });
  }

  excluir(categoria: Categoria): void {
    if (!confirm(`Deseja excluir a categoria "${categoria.nome}"?`)) {
      return;
    }
    this.categoriaService.excluir(categoria.id).subscribe({
      next: () => {
        this.categorias.update((lista) => lista.filter((c) => c.id !== categoria.id));
        this.notification.success('Categoria excluída com sucesso.');
      },
      error: () => this.notification.error('Erro ao excluir categoria.'),
    });
  }
}
