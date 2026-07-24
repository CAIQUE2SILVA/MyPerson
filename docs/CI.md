# CI/CD — MyPerson

Este documento descreve o pipeline de integração contínua do monorepo. O workflow `.github/workflows/ci.yml` é criado no item 17 do [docs/PLANO-AUTOMACAO.md](./PLANO-AUTOMACAO.md); este arquivo será complementado no item 18.

## Objetivo

Validar mecanicamente cada serviço afetado por um PR ou push para `main`: build, lint (onde existir) e testes unitários.

## Triggers

- `pull_request` (qualquer branch → `main`)
- `push` em `main`

## Jobs planejados

| Job | Serviço | Comandos | Path filter |
|-----|---------|----------|-------------|
| `api` | `api/` | `dotnet restore`, `dotnet build -c Release`, `dotnet test` | `api/**` |
| `frontend` | `frontend/` | `npm ci`, `npm run lint`, `npm test`, `npm run build` | `frontend/**` |
| `admin` | `admin/` | `npm ci`, `npm test`, `npm run build` | `admin/**` |

Os jobs rodam em paralelo. Se um serviço ainda não tiver suite de testes (antes do item 15 do plano), o job de test pode usar `continue-on-error: true` temporariamente.

## Como rodar localmente o mesmo comando do CI

### API

```bash
cd api
dotnet restore
dotnet build -c Release
dotnet test
```

### Frontend

```bash
cd frontend
npm ci
npm run lint
npm test -- --run
npm run build
```

### Admin

```bash
cd admin
npm ci
npm test -- --run
npm run build
```

## O que não está no CI (ainda)

- **e2e/browser**: fora de escopo até o núcleo de testes unitários estar estável
- **Deploy automático**: manual via `docker-compose.prod.yml` até o CI de PR amadurecer
- **Coverage gate**: opcional, só em pastas críticas, após estabilidade

## Documentação relacionada

- [docs/PLANO-AUTOMACAO.md](./PLANO-AUTOMACAO.md) — itens 17, 18 e 19
- [docs/TESTING.md](./TESTING.md) — política de testes
- [docs/CONVENTIONS.md](./CONVENTIONS.md) — convenções de commits e PRs
