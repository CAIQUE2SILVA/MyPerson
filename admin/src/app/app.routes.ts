import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/pages.routes').then((m) => m.routes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
