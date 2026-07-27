import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CategoriaService } from '../../../core/api/categorias/categoria.service';
import { ProdutoService } from '../../../core/api/produtos/produto.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { Categoria } from '../../../shared/models/categoria/categoria.model';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class ProdutoForm {
  private readonly fb = inject(FormBuilder);
  private readonly produtoService = inject(ProdutoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly categorias = signal<Categoria[]>([]);
  readonly carregando = signal(false);
  readonly id = signal<number | null>(null);

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(200)]],
    descricao: ['', Validators.maxLength(1000)],
    preco: [0, [Validators.required, Validators.min(0.01)]],
    estoque: [0, [Validators.required, Validators.min(0)]],
    categoriaId: [null as number | null],
    imagemUrl: ['', Validators.maxLength(500)],
    ativo: [true],
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
      this.carregarProduto();
    }
    this.carregarCategorias();
  }

  get titulo(): string {
    return this.id() ? 'Editar produto' : 'Novo produto';
  }

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: () => this.notification.error('Erro ao carregar categorias.'),
    });
  }

  carregarProduto(): void {
    const id = this.id();
    if (!id) {
      return;
    }
    this.carregando.set(true);
    this.produtoService
      .buscarPorId(id)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (produto) => {
          this.form.patchValue({
            nome: produto.nome,
            descricao: produto.descricao ?? '',
            preco: produto.preco,
            estoque: produto.estoque,
            categoriaId: produto.categoriaId ?? null,
            imagemUrl: produto.imagemUrl ?? '',
            ativo: produto.ativo,
          });
        },
        error: () => this.notification.error('Erro ao carregar produto.'),
      });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      nome: value.nome!,
      descricao: value.descricao || undefined,
      preco: value.preco!,
      estoque: value.estoque!,
      categoriaId: value.categoriaId ?? undefined,
      imagemUrl: value.imagemUrl || undefined,
      ativo: value.ativo!,
    };

    this.carregando.set(true);
    const id = this.id();
    const request$: Observable<unknown> = id
      ? this.produtoService.atualizar(id, payload)
      : this.produtoService.criar(payload);

    request$.pipe(finalize(() => this.carregando.set(false))).subscribe({
      next: () => {
        this.notification.success(id ? 'Produto atualizado.' : 'Produto criado.');
        void this.router.navigate(['/produtos']);
      },
      error: () => this.notification.error('Erro ao salvar produto.'),
    });
  }
}
