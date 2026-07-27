import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { Toolbar } from '../toolbar/toolbar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MenuModule,
    Toolbar,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class LayoutComponent {
  opened = signal(true);
  mode = signal<'side' | 'over' | 'push'>('side');

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-chart-line', routerLink: '/' },
    { label: 'Produtos', icon: 'pi pi-box', routerLink: '/produtos' },
    { label: 'Categorias', icon: 'pi pi-tags', routerLink: '/categorias' },
    { label: 'Clientes', icon: 'pi pi-users', routerLink: '/clientes' },
  ];

  toggleSidenav() {
    this.opened.update((value) => !value);
  }
}
