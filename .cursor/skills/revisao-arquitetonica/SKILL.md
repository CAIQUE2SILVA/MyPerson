---
name: revisao-arquitetonica
description: Revisa se o diff segue os padrões arquitetônicos do monorepo (API, frontend, admin, nginx, docker). Use quando o usuário pedir "revisão arquitetural", "segue o padrão?", ou em PRs que mudam estrutura.
---

# Revisão Arquitetônica — MyPerson

Valida se o diff segue os padrões de arquitetura documentados em `docs/ARCHITECTURE.md` e nas rules de `.cursor/rules/`.

## Quando usar

- "revisão arquitetural"
- "segue o padrão?"
- "está na pasta certa?"
- PR que muda estrutura de pastas, cria novos controllers, pages, services ou altera nginx/docker

## Workflow

### 1. Ler contratos

Antes de analisar o diff, ler:

- `docs/ARCHITECTURE.md`
- `.cursor/rules/monorepo.mdc`
- `.cursor/rules/api-dotnet.mdc` (se diff tocar `api/`)
- `.cursor/rules/frontend-next.mdc` (se diff tocar `frontend/`)
- `.cursor/rules/admin-angular.mdc` e `admin-architecture.mdc` (se diff tocar `admin/`)
- `.cursor/rules/docker-infra.mdc` (se diff tocar `nginx/` ou `docker-compose*.yml`)

### 2. Analisar o diff por serviço

```bash
git status
git diff
git diff --cached
```

### 3. Checklist por área

#### API (`api/**`)

| Padrão | Evidência esperada no diff | Status |
|--------|----------------------------|--------|
| Controllers com `[ApiController]` e `[Route("api/[controller]")]` | `[ApiController]` + `[Route(...)]` | ok/quebra |
| DTOs para entrada e saída | Arquivos em `Models/DTOs/` | ok/quebra |
| Não expõe entidades EF | Retorno `ActionResult<T>` com DTOs | ok/quebra |
| `[Authorize]` em writes protegidas | Atributo nas actions POST/PUT/DELETE | ok/quebra |
| Migrations quando schema mudou | Arquivo em `Data/Migrations/` | ok/quebra |
| Tratamento de exceção com `ILogger` | `try/catch` + `_logger.LogError` | ok/quebra |

#### Frontend (`frontend/**`)

| Padrão | Evidência esperada no diff | Status |
|--------|----------------------------|--------|
| App Router | Arquivos em `src/app/` (não `pages/`) | ok/quebra |
| Server Component por padrão | Sem `"use client"` desnecessário | ok/quebra |
| Client Component só quando necessário | `"use client"` + estado/eventos | ok/quebra |
| Fetch via `/api` | `fetch('http://localhost/api/...')` | ok/quebra |
| Tailwind 4, sem CSS modules misturado | Classes utilitárias; sem `.module.css` | ok/quebra |

#### Admin (`admin/**`)

| Padrão | Evidência esperada no diff | Status |
|--------|----------------------------|--------|
| Standalone components | `standalone: true` | ok/quebra |
| Sem NgModules | Não cria `.module.ts` | ok/quebra |
| Camadas respeitadas (`core/shared/ui/pages`) | Arquivos nas pastas corretas | ok/quebra |
| `RestService` em vez de `HttpClient` direto | `inject(RestService)` | ok/quebra |
| Endpoints em constants | `shared/constants/api.constants.ts` | ok/quebra |
| Lazy loading de pages | `loadComponent` em `app.routes.ts` | ok/quebra |
| RxJS com cleanup | `takeUntilDestroyed` / `async` pipe | ok/quebra |

#### Infra (`nginx/`, `docker-compose*.yml`)

| Padrão | Evidência esperada no diff | Status |
|--------|----------------------------|--------|
| Rotas `/`, `/api`, `/admin` intactas | `location` blocks corretos | ok/quebra |
| Não expõe banco externamente | Postgres sem `ports: 5432:5432` em prod | ok/quebra |
| Multi-stage builds em prod | `AS build` / `AS runtime` | ok/quebra |

### 4. Verificar mistura de serviços

- Um PR pode tocar múltiplos serviços se houver contrato coordenado (ex.: novo endpoint + tela que o consome).
- Se não houver motivo claro, sinalizar como **RESSALVA**.

## Saída padronizada

```markdown
## Revisão Arquitetônica

**Veredito:** APROVADO | APROVADO COM RESSALVAS | BLOQUEADO

### Padrão → Evidência → Status

| Área | Padrão | Evidência | Status |
|------|--------|-----------|--------|
| api | ... | ... | ok/quebra |
| frontend | ... | ... | ok/quebra |
| admin | ... | ... | ok/quebra |
| infra | ... | ... | ok/quebra |

### Achados
1. [BLOQUEANTE|RESSALVA|INFO] ...

### Próximos passos
- (se houver) Mover ... para `core/shared/ui/pages`
- (se houver) Adicionar DTO para ...
- (se houver) Verificar `[Authorize]` em ...
```

## Integração com outras skills

- Roda depois de `revisao-tecnica` e antes/paralelo a `revisao-testes-unitarios`.
- É chamada por `pr-review`.

## Anti-padrões

- Reclamar de estilo quando a regra é funcional.
- Sugerir abstração nova não pedida.
- Ignorar violação de camada no admin.
