import { Routes } from '@angular/router';
import { LayoutComponent } from './ui/layout/main-layout/main-layout';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.routes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
