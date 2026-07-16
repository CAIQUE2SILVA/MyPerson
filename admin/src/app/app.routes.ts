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
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
