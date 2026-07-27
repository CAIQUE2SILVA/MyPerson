import { Routes } from '@angular/router';
import { LayoutComponent } from './ui/layout/main-layout/main-layout';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'produtos',
        loadComponent: () => import('./pages/produtos/produto-list/produto-list').then((m) => m.ProdutoList),
      },
      {
        path: 'produtos/novo',
        loadComponent: () => import('./pages/produtos/produto-form/produto-form').then((m) => m.ProdutoForm),
      },
      {
        path: 'produtos/:id/editar',
        loadComponent: () => import('./pages/produtos/produto-form/produto-form').then((m) => m.ProdutoForm),
      },
      {
        path: 'categorias',
        loadComponent: () => import('./pages/categorias/categoria-list/categoria-list').then((m) => m.CategoriaList),
      },
      {
        path: 'categorias/nova',
        loadComponent: () => import('./pages/categorias/categoria-form/categoria-form').then((m) => m.CategoriaForm),
      },
      {
        path: 'categorias/:id/editar',
        loadComponent: () => import('./pages/categorias/categoria-form/categoria-form').then((m) => m.CategoriaForm),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./pages/clientes/cliente-list/cliente-list').then((m) => m.ClienteList),
      },
      {
        path: 'clientes/novo',
        loadComponent: () => import('./pages/clientes/cliente-form/cliente-form').then((m) => m.ClienteForm),
      },
      {
        path: 'clientes/:id/editar',
        loadComponent: () => import('./pages/clientes/cliente-form/cliente-form').then((m) => m.ClienteForm),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
