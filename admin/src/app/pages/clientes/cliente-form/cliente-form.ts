import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';

import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { NotificationService } from '../../../core/services/notification/notification.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class ClienteForm {
  private readonly fb = inject(FormBuilder);
  private readonly clienteService = inject(ClienteService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly carregando = signal(false);
  readonly id = signal<number | null>(null);

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(200)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    senha: ['', [Validators.minLength(6), Validators.maxLength(100)]],
    telefone: ['', Validators.maxLength(20)],
    ativo: [true],
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
      this.carregarCliente();
    }
  }

  get titulo(): string {
    return this.id() ? 'Editar cliente' : 'Novo cliente';
  }

  get modoCriacao(): boolean {
    return this.id() === null;
  }

  carregarCliente(): void {
    const id = this.id();
    if (!id) {
      return;
    }
    this.carregando.set(true);
    this.clienteService
      .buscarPorId(id)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (cliente) => {
          this.form.patchValue({
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone ?? '',
            ativo: cliente.ativo,
          });
          this.form.get('senha')?.disable();
        },
        error: () => this.notification.error('Erro ao carregar cliente.'),
      });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const id = this.id();

    this.carregando.set(true);

    if (id) {
      const payload = {
        nome: value.nome!,
        email: value.email!,
        telefone: value.telefone || undefined,
        ativo: value.ativo!,
      };
      this.clienteService
        .atualizar(id, payload)
        .pipe(finalize(() => this.carregando.set(false)))
        .subscribe({
          next: () => {
            this.notification.success('Cliente atualizado.');
            void this.router.navigate(['/clientes']);
          },
          error: () => this.notification.error('Erro ao atualizar cliente.'),
        });
    } else {
      if (!value.senha) {
        this.notification.error('Senha é obrigatória para criar um cliente.');
        this.carregando.set(false);
        return;
      }
      const payload = {
        nome: value.nome!,
        email: value.email!,
        senha: value.senha,
        telefone: value.telefone || undefined,
      };
      this.clienteService
        .criar(payload)
        .pipe(finalize(() => this.carregando.set(false)))
        .subscribe({
          next: () => {
            this.notification.success('Cliente criado.');
            void this.router.navigate(['/clientes']);
          },
          error: () => this.notification.error('Erro ao criar cliente.'),
        });
    }
  }
}
