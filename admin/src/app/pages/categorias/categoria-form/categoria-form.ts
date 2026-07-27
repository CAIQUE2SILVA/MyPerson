import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CategoriaService } from '../../../core/api/categorias/categoria.service';
import { NotificationService } from '../../../core/services/notification/notification.service';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class CategoriaForm {
  private readonly fb = inject(FormBuilder);
  private readonly categoriaService = inject(CategoriaService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly carregando = signal(false);
  readonly id = signal<number | null>(null);

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    slug: ['', [Validators.required, Validators.maxLength(100)]],
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
      this.carregarCategoria();
    }
  }

  get titulo(): string {
    return this.id() ? 'Editar categoria' : 'Nova categoria';
  }

  carregarCategoria(): void {
    const id = this.id();
    if (!id) {
      return;
    }
    this.carregando.set(true);
    this.categoriaService
      .buscarPorId(id)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (categoria) => {
          this.form.patchValue({
            nome: categoria.nome,
            slug: categoria.slug,
          });
        },
        error: () => this.notification.error('Erro ao carregar categoria.'),
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
      slug: value.slug!,
    };

    this.carregando.set(true);
    const id = this.id();
    const request$: Observable<unknown> = id
      ? this.categoriaService.atualizar(id, payload)
      : this.categoriaService.criar(payload);

    request$.pipe(finalize(() => this.carregando.set(false))).subscribe({
      next: () => {
        this.notification.success(id ? 'Categoria atualizada.' : 'Categoria criada.');
        void this.router.navigate(['/categorias']);
      },
      error: () => this.notification.error('Erro ao salvar categoria.'),
    });
  }
}
