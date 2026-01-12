import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Toolbar } from '../toolbar/toolbar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    Toolbar
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {
  opened = signal(true);
  mode = signal<'side' | 'over' | 'push'>('side');

  toggleSidenav() {
    this.opened.update(value => !value);
  }

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/home' },
    { label: 'Produtos', icon: 'inventory', route: '/produtos' },
    { label: 'Pedidos', icon: 'shopping_cart', route: '/pedidos' },
    { label: 'Clientes', icon: 'people', route: '/clientes' },
    { label: 'Relatórios', icon: 'bar_chart', route: '/relatorios' },
    { label: 'Configurações', icon: 'settings', route: '/configuracoes' }
  ];


}
