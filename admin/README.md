# Admin MyPerson

Painel administrativo em **Angular 21** com componentes standalone, Angular Material, PrimeNG e SSR via Express.

## Acesso

| Ambiente   | URL |
|------------|-----|
| Docker/Nginx | http://localhost/admin |
| Dev local (`ng serve`) | http://localhost:4200 |

A API é chamada em `http://localhost/api` (proxy Nginx em produção).

## Funcionalidades

- Login com JWT (`POST /api/auth/login`)
- Proteção de rotas com guards de autenticação
- Dashboard com cards de resumo consumindo dados reais da API
- CRUDs de produtos, categorias e clientes
- Catálogo visual de produtos com filtros de busca e categoria
- Menu lateral com PrimeNG (`p-menu`)
- Toggle de tema claro/escuro com persistência em `localStorage`
- Tema SCSS global em `src/styles/_theme.scss`
- Serviços centralizados em `core/` (HTTP, auth, loading, notificações, tema)

## Estrutura

```
admin/src/app/
├── app.ts / app.routes.ts     # Raiz e rotas principais
├── core/
│   ├── api/
│   │   ├── auth/               # AuthService (login, token, logout)
│   │   ├── produtos/           # ProdutoService
│   │   ├── categorias/         # CategoriaService
│   │   ├── clientes/           # ClienteService
│   │   └── dashboard/          # DashboardService (resumo)
│   ├── guards/                 # authGuard, guestGuard
│   ├── interceptors/           # JWT no header Authorization
│   └── services/               # RestService, Loading, Notification, Theme
├── ui/layout/                  # Shell autenticado (toolbar + outlet + menu PrimeNG)
├── pages/
│   ├── auth/login/             # Tela de login (rota pública)
│   ├── dashboard/dashboard/    # Dashboard (rota protegida)
│   ├── produtos/               # Listagem, catálogo e formulário de produtos
│   ├── categorias/             # Listagem e formulário de categorias
│   └── clientes/               # Listagem e formulário de clientes
├── shared/models/              # DTOs compartilhados
└── shared/constants/           # Constantes de endpoint da API
```

## Rotas

| Rota (relativa a `/admin/`) | Guard      | Descrição |
|-----------------------------|------------|-----------|
| `login`                     | guestGuard | Formulário de login |
| `` (vazio)                  | authGuard  | Dashboard |
| `produtos`                  | authGuard  | Listagem de produtos |
| `produtos/catalogo`         | authGuard  | Catálogo visual de produtos |
| `produtos/novo`             | authGuard  | Novo produto |
| `produtos/:id/editar`       | authGuard  | Editar produto |
| `categorias`                | authGuard  | Listagem de categorias |
| `categorias/nova`           | authGuard  | Nova categoria |
| `categorias/:id/editar`     | authGuard  | Editar categoria |
| `clientes`                  | authGuard  | Listagem de clientes |
| `clientes/novo`             | authGuard  | Novo cliente |
| `clientes/:id/editar`       | authGuard  | Editar cliente |
| `**`                        | —          | Redireciona para dashboard |

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
- Angular Material para UI (formulários, cards, toolbar, tabelas)
- PrimeNG para menu lateral e notificações (toast)
- Estilos globais em `src/styles.scss` e tokens em `src/styles/_theme.scss`
- Prettier configurado para templates Angular (`.html`)

## Documentação do projeto

- [docs/PROJETO.md](../docs/PROJETO.md) — arquitetura geral
- [docs/AGENTS.md](../docs/AGENTS.md) — instruções para agentes
- [docs/PLANO-AUTOMACAO.md](../docs/PLANO-AUTOMACAO.md) — plano de automação (docs, skills, testes, CI/CD)
- [api/API.md](../api/API.md) — endpoints da API

## Build e Docker

O `angular.json` define `baseHref: "/admin/"` para servir corretamente atrás do Nginx.

Rebuild do container após mudanças:

```bash
docker-compose up -d --build admin
```
