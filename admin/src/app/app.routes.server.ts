import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'produtos/:id/editar', renderMode: RenderMode.Server },
  { path: 'categorias/:id/editar', renderMode: RenderMode.Server },
  { path: 'clientes/:id/editar', renderMode: RenderMode.Server },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
