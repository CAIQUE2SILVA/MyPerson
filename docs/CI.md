# CI/CD — MyPerson

## Workflow principal

Arquivo: `.github/workflows/ci.yml`

O pipeline roda em todo `push` para `main` e em `pull_request` para `main`. Cada serviço tem um job paralelo com build, lint (onde existir) e testes unitários.

## Jobs

| Job | Serviço | Comandos | Path filter |
|-----|---------|----------|-------------|
| `api` | `api/` | `dotnet restore MyPerson.sln` → `dotnet build -c Release` → `dotnet test` | `api/**` |
| `frontend` | `frontend/` | `npm ci` → `npm run lint` → `npm test -- --run` → `npm run build` | `frontend/**` |
| `admin` | `admin/` | `npm ci` → `npm test -- --watch=false` → `npm run build` | `admin/**` |

Os jobs usam `ubuntu-latest` e a versão LTS do Node.js (20) para frontend/admin e .NET 8 para a API.

## Como rodar localmente o mesmo comando do CI

### API

```bash
cd api
dotnet restore MyPerson.sln
dotnet build MyPerson.sln -c Release
dotnet test MyPerson.sln
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
npm test -- --watch=false
npm run build
```

## Deploy

O workflow `.github/workflows/deploy.yml` é acionado manualmente (`workflow_dispatch`) ou por tags `v*`. Ele:

1. Copia `.env.prod.example` para `.env`
2. Builda as imagens com `docker-compose -f docker-compose.prod.yml build`
3. (Placeholder) Push para registry e deploy remoto — requer secrets configurados

Secrets necessários (adicionar no GitHub, nunca no repo):

- `REGISTRY_URL`
- `REGISTRY_USERNAME`
- `REGISTRY_PASSWORD`
- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`

## O que não está no CI (ainda)

- **e2e/browser**: fora de escopo até o núcleo de testes unitários estar estável.
- **Coverage gate**: opcional, só em pastas críticas, após estabilidade.
- **Conventional Commits no título do PR**: opcional.

## Integração com review de agente

- CI valida build, lint e teste mecânico.
- A skill `pr-review` (`.cursor/skills/pr-review/`) valida padrão arquitetônico e lacunas de teste no diff.
- O prompt para Cursor Bugbot / Cloud Automation está em `.cursor/automation/pr-review.md`.
- Não aprovar PRs com CI vermelho.

## Documentação relacionada

- [docs/PLANO-AUTOMACAO.md](./PLANO-AUTOMACAO.md) — itens 17, 18 e 19
- [docs/TESTING.md](./TESTING.md) — política de testes
- [docs/CONVENTIONS.md](./CONVENTIONS.md) — convenções de commits e PRs
- [docs/AGENTS.md](./AGENTS.md) — instruções para agentes
- [README.md](../README.md) — visão geral
