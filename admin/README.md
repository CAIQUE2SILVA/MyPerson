# Admin MyPerson

Painel administrativo em **Angular 21** com componentes standalone, Angular Material, Tailwind 4 e SSR via Express.

## Acesso

| Ambiente   | URL |
|------------|-----|
| Docker/Nginx | http://localhost/admin |
| Dev local (`ng serve`) | http://localhost:4200 |

A API é chamada em `http://localhost/api` (proxy Nginx em produção).

## Funcionalidades

- Login com JWT (`POST /api/auth/login`)
- Proteção de rotas com guards de autenticação
- Dashboard (home) com layout, toolbar e cards de resumo
- Serviços centralizados em `core/` (HTTP, auth, loading, notificações)

## Estrutura

```
admin/src/app/
├── app.ts / app.routes.ts     # Raiz e rotas principais
├── core/
│   ├── api/auth/              # AuthService (login, token, logout)
│   ├── guards/                # authGuard, guestGuard
│   ├── interceptors/          # JWT no header Authorization
│   └── services/              # RestService, Loading, Notification
├── components/
│   ├── layout/                # Shell autenticado (toolbar + outlet)
│   ├── toolbar/               # Barra superior
│   ├── login-header/          # Header da tela de login
│   └── login-footer/          # Footer da tela de login
├── pages/
│   ├── login/                 # Tela de login (rota pública)
│   └── home/                  # Dashboard (rota protegida)
└── shared/models/             # DTOs compartilhados (login, etc.)
```

## Rotas

| Rota (relativa a `/admin/`) | Guard      | Descrição |
|-----------------------------|------------|-----------|
| `login`                     | guestGuard | Formulário de login |
| `` (vazio)                  | authGuard  | Layout + dashboard home |
| `**`                        | —          | Redireciona para home |

## Comandos

```bash
npm install          # dependências
npm start            # dev server (porta 4200)
npm run build        # build de produção (baseHref: /admin/)
npm test             # testes (Vitest)
npm run serve:ssr:admin  # SSR após build
```

## Convenções

- Componentes **standalone** (`standalone: true`) — sem NgModules
- Lazy loading de páginas com `loadComponent` / `loadChildren`
- Angular Material para UI (formulários, cards, toolbar)
- Estilos globais em `src/styles.css`, reset em `src/app/app.css`
- Prettier configurado para templates Angular (`.html`)

## Build e Docker

O `angular.json` define `baseHref: "/admin/"` para servir corretamente atrás do Nginx.

Rebuild do container após mudanças:

```bash
docker-compose up -d --build admin
```
