import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProdutoService } from '../../../core/api/produtos/produto.service';
import { CategoriaService } from '../../../core/api/categorias/categoria.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { Produto } from '../../../shared/models/produto/produto.model';
import { Categoria } from '../../../shared/models/categoria/categoria.model';

@Component({
  selector: 'app-produto-catalogo',
  templateUrl: './produto-catalogo.html',
  styleUrl: './produto-catalogo.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
  ],
})
export class ProdutoCatalogo {
  private readonly fb = inject(FormBuilder);
  private readonly produtoService = inject(ProdutoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly notification = inject(NotificationService);

  readonly produtos = signal<Produto[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly carregando = signal(false);

  readonly filtros = this.fb.group({
    busca: [''],
    categoriaId: [null as number | null],
  });

  readonly busca = toSignal(this.filtros.controls.busca.valueChanges, { initialValue: '' });
  readonly categoriaId = toSignal(this.filtros.controls.categoriaId.valueChanges, { initialValue: null as number | null });

  readonly produtosFiltrados = computed(() => {
    const termo = (this.busca() ?? '').toLowerCase().trim();
    const categoria = this.categoriaId();
    return this.produtos().filter((p) => {
      const matchesBusca = !termo || p.nome.toLowerCase().includes(termo) || (p.descricao ?? '').toLowerCase().includes(termo);
      const matchesCategoria = !categoria || p.categoriaId === categoria;
      return matchesBusca && matchesCategoria;
    });
  });

  readonly totalProdutos = computed(() => this.produtos().length);
  readonly totalFiltrados = computed(() => this.produtosFiltrados().length);

  constructor() {
    this.carregar();
    this.carregarCategorias();
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

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: () => this.notification.error('Erro ao carregar categorias.'),
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

  imagemFallback(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%239ca3af%22%3E%3Cpath d=%22M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z%22/%3E%3C/svg%3E';
  }

  limparFiltros(): void {
    this.filtros.reset({ busca: '', categoriaId: null });
  }
}
