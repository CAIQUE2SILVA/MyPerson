import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';

import { ProdutoService } from '../../../core/api/produtos/produto.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { Produto } from '../../../shared/models/produto/produto.model';

@Component({
  selector: 'app-produto-list',
  templateUrl: './produto-list.html',
  styleUrl: './produto-list.scss',
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
export class ProdutoList {
  private readonly produtoService = inject(ProdutoService);
  private readonly notification = inject(NotificationService);

  readonly produtos = signal<Produto[]>([]);
  readonly carregando = signal(false);
  readonly colunas = ['nome', 'preco', 'estoque', 'categoria', 'ativo', 'acoes'];

  constructor() {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.produtoService
      .listar()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (produtos) => this.produtos.set(produtos),
        error: () => this.notification.error('Erro ao carregar produtos.'),
      });
  }

  excluir(produto: Produto): void {
    if (!confirm(`Deseja excluir o produto "${produto.nome}"?`)) {
      return;
    }
    this.produtoService.excluir(produto.id).subscribe({
      next: () => {
        this.produtos.update((lista) => lista.filter((p) => p.id !== produto.id));
        this.notification.success('Produto excluído com sucesso.');
      },
      error: () => this.notification.error('Erro ao excluir produto.'),
    });
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }
}
