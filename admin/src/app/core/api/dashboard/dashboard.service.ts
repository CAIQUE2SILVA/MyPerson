import { Injectable, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { CategoriaService } from '../categorias/categoria.service';
import { ClienteService } from '../clientes/cliente.service';
import { ProdutoService } from '../produtos/produto.service';

export interface DashboardResumo {
  totalProdutos: number;
  totalCategorias: number;
  totalClientes: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly produtoService = inject(ProdutoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly clienteService = inject(ClienteService);

  readonly resumo = signal<DashboardResumo>({
    totalProdutos: 0,
    totalCategorias: 0,
    totalClientes: 0,
  });
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    // ponytail: a API não expõe endpoint de resumo; contagens vêm de GET completos.
    // Upgrade: adicionar endpoint específico quando o volume de dados crescer.
    forkJoin({
      produtos: this.produtoService.listar().pipe(catchError(() => of([]))),
      categorias: this.categoriaService.listar().pipe(catchError(() => of([]))),
      clientes: this.clienteService.listar().pipe(catchError(() => of([]))),
    })
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: ({ produtos, categorias, clientes }) => {
          this.resumo.set({
            totalProdutos: produtos.length,
            totalCategorias: categorias.length,
            totalClientes: clientes.length,
          });
        },
        error: () => {
          this.erro.set('Erro ao carregar resumo do dashboard.');
        },
      });
  }
}
