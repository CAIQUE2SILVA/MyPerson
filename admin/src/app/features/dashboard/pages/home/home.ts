import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

export interface Pedido {
  id: string;
  cliente: string;
  valor: number;
  status: 'ENVIADO' | 'PENDENTE' | 'EMBALADO' | 'EM_SEPARACAO' | 'CANCELADO';
  data: Date;
}

export interface StatusPedido {
  status: string;
  quantidade: number;
  porcentagem: number;
  cor: string;
}

@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule
  ],
})
export class Home {
  ultimaAtualizacao = new Date();

  // KPIs
  pedidosHoje = 78;
  pedidosVariacao = '+5 acima da média';
  pedidosVariacaoPositiva = true;

  atencaoEstoque = 15;
  estoqueVariacao = '+3 novos itens esta semana';
  estoqueVariacaoPositiva = false;

  custoEnvioMedio = 18.75;
  custoEnvioVariacao = '-5% vs. semana passada';
  custoEnvioVariacaoPositiva = false;

  // Status dos pedidos para o gráfico
  statusPedidos: StatusPedido[] = [
    { status: 'Enviado', quantidade: 45, porcentagem: 58, cor: '#3f51b5' },
    { status: 'Embalado', quantidade: 18, porcentagem: 23, cor: '#4caf50' },
    { status: 'Em Separação', quantidade: 12, porcentagem: 15, cor: '#ffc107' },
    { status: 'Cancelado', quantidade: 3, porcentagem: 4, cor: '#f44336' }
  ];

  // Pedidos recentes
  pedidos: Pedido[] = [
    { id: '#100945', cliente: 'Ana Paula S.', valor: 215.90, status: 'ENVIADO', data: new Date(2024, 0, 12, 11, 30) },
    { id: '#100946', cliente: 'João P. da Silva', valor: 89.90, status: 'PENDENTE', data: new Date(2024, 0, 12, 13, 5) },
    { id: '#100947', cliente: 'Maria C. Lima', valor: 540.00, status: 'ENVIADO', data: new Date(2024, 0, 11) },
    { id: '#100948', cliente: 'Pedro Santos', valor: 125.50, status: 'EMBALADO', data: new Date(2024, 0, 12, 9, 15) },
    { id: '#100949', cliente: 'Carla Oliveira', valor: 89.90, status: 'EM_SEPARACAO', data: new Date(2024, 0, 12, 14, 20) }
  ];

  displayedColumns: string[] = ['id', 'cliente', 'valor', 'status', 'data'];

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'ENVIADO': '#4caf50',
      'PENDENTE': '#f44336',
      'EMBALADO': '#2196f3',
      'EM_SEPARACAO': '#ffc107',
      'CANCELADO': '#f44336'
    };
    return colors[status] || '#757575';
  }

  formatarData(data: Date): string {
    const hoje = new Date();
    const dia = data.getDate();
    const mes = data.toLocaleDateString('pt-BR', { month: 'short' });
    const hora = data.getHours();
    const minuto = data.getMinutes().toString().padStart(2, '0');

    if (data.toDateString() === hoje.toDateString()) {
      return `${dia}/${mes}, ${hora}:${minuto}`;
    }
    return `${dia}/${mes}`;
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  // ... código existente ...

  getOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += (this.statusPedidos[i].porcentagem * 502.4 / 100);
    }
    return -offset;
  }

  getTotalPedidos(): number {
    return this.statusPedidos.reduce((total, item) => total + item.quantidade, 0);
  }
}