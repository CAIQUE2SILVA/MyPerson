import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

import { DashboardService } from '../../../core/api/dashboard/dashboard.service';

interface DashboardCard {
  titulo: string;
  valor: () => number;
  icone: string;
  cor: string;
  rota: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);

  readonly resumo = this.dashboardService.resumo;
  readonly carregando = this.dashboardService.carregando;
  readonly erro = this.dashboardService.erro;
  readonly ultimaAtualizacao = new Date();

  cards: DashboardCard[] = [
    {
      titulo: 'Produtos',
      valor: () => this.resumo().totalProdutos,
      icone: 'inventory',
      cor: 'primary',
      rota: '/produtos',
    },
    {
      titulo: 'Categorias',
      valor: () => this.resumo().totalCategorias,
      icone: 'category',
      cor: 'secondary',
      rota: '/categorias',
    },
    {
      titulo: 'Clientes',
      valor: () => this.resumo().totalClientes,
      icone: 'people',
      cor: 'tertiary',
      rota: '/clientes',
    },
  ];

  constructor() {
    this.dashboardService.carregar();
  }
}
