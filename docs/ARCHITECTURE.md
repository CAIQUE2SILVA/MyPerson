# Arquitetura e Padrões — MyPerson

Este documento consolida os padrões de cada serviço para revisões arquitetônicas e reviews de PR. Não duplica os exemplos longos das rules; use `.cursor/rules/` para detalhes de implementação.

## Princípios gerais

- Cada pasta (`api/`, `frontend/`, `admin/`) é um serviço independente.
- Comunicação entre serviços apenas via HTTP, nunca compartilhando código.
- Frontend e admin chamam a API em `http://localhost/api` (via Nginx em produção).
- Diff mínimo: reutilize padrões existentes antes de criar abstrações novas.

## API (`api/`)

### Estrutura

```
api/
├── Controllers/          # Controllers da API
├── Data/
│   ├── Migrations/       # EF Core Migrations
│   └── ApplicationDbContext.cs
├── Models/
│   ├── DTOs/             # Data Transfer Objects (entrada e saída)
│   └── Auth/             # Modelos de autenticação
└── appsettings*.json
```

### Padrões obrigatórios

- `[ApiController]` com `[Route("api/[controller]")]`
- DTOs em `Models/DTOs/` para entrada e saída; nunca exponha entidades EF diretamente
- `[Authorize]` em operações de escrita e listagens protegidas
- `try/catch` com `ILogger<T>`
- Retornar `ActionResult<T>` com `Ok()`, `CreatedAtAction()`, `NotFound()`, `BadRequest()`
- Migrations quando o schema mudar

### Autenticação

- JWT Bearer configurado em `Program.cs`
- Login: `POST /api/auth/login`
- Token em `Authorization: Bearer {token}` nas requisições protegidas

## Frontend (`frontend/`)

### Estrutura

```
frontend/src/
├── app/                  # App Router (Next.js 13+)
│   ├── page.tsx         # Página inicial /
│   ├── layout.tsx       # Layout raiz
│   ├── globals.css      # Estilos globais
│   └── (rotas).../
└── components/
    ├── layout/          # Header, Footer
    └── sections/        # HeroSection, FeaturedProducts, etc.
```

### Padrões obrigatórios

- Server Components por padrão; Client Components só quando precisam de estado, eventos ou browser APIs
- Tailwind 4 para estilização; não misturar CSS modules
- Fetch de dados em Server Components quando possível
- Chamar a API em `http://localhost/api/{endpoint}`
- Não criar pasta `pages/` (projeto usa App Router)

## Admin (`admin/`)

### Estrutura em camadas

```
admin/src/app/
├── core/          # Singletons: HTTP, auth, guards, interceptors
├── shared/        # Models, enums, constants, utils
├── ui/            # Componentes reutilizáveis sem lógica de negócio
├── pages/         # Telas lazy-loaded por domínio
├── app.ts         # Componente raiz (standalone)
└── app.routes.ts  # Rotas principais
```

### Padrões obrigatórios

- Componentes standalone (`standalone: true`); sem NgModules
- Lazy loading de páginas com `loadComponent` / `loadChildren`
- Não usar `HttpClient` direto em pages; usar `RestService` (`core/services/rest/`)
- Endpoints da API em `shared/constants/api.constants.ts` — nunca URLs hardcoded
- Lógica de negócio em pages, nunca em componentes `ui/`
- RxJS com cleanup (`takeUntilDestroyed`, `async` pipe, `switchMap`)
- SSR: não acessar `window`/`localStorage` sem `isPlatformBrowser`

### Responsabilidades por camada

| Camada | Responsabilidade | Regra |
|--------|-------------------|-------|
| `core` | RestService, AuthService, guards, interceptors | Importado via `app.config.ts`; nunca importa `pages` |
| `shared` | Models, enums, constants (`API_ENDPOINTS`), utils | Sem dependência de `pages` ou `ui` |
| `ui` | Botões, layout, formulários genéricos | Stateless; sem chamadas HTTP |
| `pages` | Telas standalone por domínio | Lógica de negócio; usa `core` + `shared` + `ui` |

## Infraestrutura

### Nginx

Roteamento configurado em `nginx/nginx.conf`:

- `/api/*` → API (`:5000`)
- `/admin/*` → Admin (`:4200`)
- `/` → Frontend (`:3000`)

### Docker Compose

- `docker-compose.yml` — desenvolvimento
- `docker-compose.prod.yml` — produção

### Limites do monorepo

- Não compartilhar código entre `api/`, `frontend/` e `admin/`.
- Não mover lógica de negócio para componentes reutilizáveis genéricos.
- Não hardcodar URLs da API.
- Não expor entidades EF diretamente nos endpoints.

## Checklist de revisão arquitetônica

Use este checklist ao revisar um PR:

- [ ] Mudança em `api/**` usa DTOs e `[Authorize]` onde deve?
- [ ] Mudança em `api/**` que altera schema tem migration?
- [ ] Mudança em `frontend/**` usa App Router e Server Components por padrão?
- [ ] Mudança em `frontend/**` chama `/api` corretamente?
- [ ] Mudança em `admin/**` respeita as camadas `core/shared/ui/pages`?
- [ ] Mudança em `admin/**` usa `RestService` e `API_ENDPOINTS`?
- [ ] Mudança em `nginx/**` ou `docker-compose*.yml` preserva rotas `/`, `/api`, `/admin`?
- [ ] Não há compartilhamento de código entre serviços?

## Documentação relacionada

- [docs/PROJETO.md](./PROJETO.md) — visão geral e como rodar
- [docs/AGENTS.md](./AGENTS.md) — instruções para agentes
- [docs/TESTING.md](./TESTING.md) — política de testes (futuro)
- [api/API.md](../api/API.md) — endpoints da API
- `.cursor/rules/` — regras detalhadas por tecnologia
