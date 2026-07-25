# MyPerson — Contrato para Agentes

## O que é este projeto

Monorepo full-stack com três serviços independentes:

- **API** (`api/`) — ASP.NET Core 8, EF Core, PostgreSQL, JWT Auth
- **Frontend** (`frontend/`) — Next.js 16, React 19, Tailwind 4
- **Admin** (`admin/`) — Angular 21, Material/CDK, Tailwind 4, SSR

A comunicação entre serviços é via HTTP, roteada pelo Nginx em `:80`.

## Documentação de referência

- [docs/PROJETO.md](./docs/PROJETO.md) — arquitetura, stack, estrutura de pastas e como rodar
- [docs/AGENTS.md](./docs/AGENTS.md) — instruções específicas para agentes (Cursor / Cloud Agent)
- [api/API.md](./api/API.md) — endpoints da API
- [docs/PLANO-AUTOMACAO.md](./docs/PLANO-AUTOMACAO.md) — plano de automação (docs, skills, testes, CI/CD)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — padrões arquitetônicos
- [docs/TESTING.md](./docs/TESTING.md) — política de testes
- [docs/CONVENTIONS.md](./docs/CONVENTIONS.md) — convenções de commits e branches
- [docs/CI.md](./docs/CI.md) — documentação do CI/CD

## Regras duras

1. **Não misture serviços** — cada pasta (`api/`, `frontend/`, `admin/`) é um serviço independente. Não compartilhe código entre eles.
2. **Comunicação via `/api`** — frontend e admin chamam a API em `http://localhost/api` (ou via Nginx em produção).
3. **Diff mínimo** — siga o princípio *ponytail*: entenda o problema, reutilize o que existe, escreva o mínimo de código que funcione.
4. **Não commit `.env`** — use `env.example` como referência; segredos vivem em variáveis de ambiente.
5. **Testes para lógica** — mudanças de regra de negócio, bugfix, auth ou validação precisam de teste unitário. Veja `docs/TESTING.md` e a skill `.cursor/skills/revisao-testes-unitarios/`.

## Regras do projeto

As regras específicas estão em `.cursor/rules/`:

- `monorepo.mdc` — visão geral (sempre aplica)
- `api-dotnet.mdc` — quando edita `api/**/*.cs`
- `frontend-next.mdc` — quando edita `frontend/**/*.{ts,tsx}`
- `admin-angular.mdc` — quando edita `admin/**/*.{ts,html}`
- `admin-architecture.mdc` — arquitetura em camadas do admin
- `docker-infra.mdc` — quando edita Docker/Nginx
- `ponytail.mdc` — princípios de desenvolvimento eficiente (sempre aplica)

## Skills disponíveis

- `.cursor/skills/revisao-testes-unitarios/` — revisa cobertura e qualidade de testes
- `.cursor/skills/smart-commit/` — gera mensagens de commit seguindo as convenções do projeto

## Convenções de mensagem

Use **Conventional Commits** em português, com escopo quando aplicável:

```
feat(api): adiciona endpoint de produtos
fix(admin): corrige redirecionamento do authGuard
docs: atualiza PROJETO.md
```

Escopos comuns: `api`, `frontend`, `admin`, `docker`, `docs`, `ci`, `test`.
