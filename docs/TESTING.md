# Política de Testes Unitários — MyPerson

Este documento define o que e como testar no monorepo. Use em conjunto com a skill `.cursor/skills/revisao-testes-unitarios/`.

## Quando testar é obrigatório

Mudanças que tocam lógica de negócio precisam de teste unitário:

- Bugfix
- Regra de negócio nova ou alterada
- Autenticação / autorização
- Validação de dados
- Serviços, guards, utils, controllers

## Quando teste não é obrigatório

- Alterações puramente visuais (CSS, copy, layout)
- Migrations isoladas de schema (sem lógica)
- Documentação
- Configuração de Docker/Nginx sem lógica condicional

## Stack por serviço

### API (`api/`)

- **Runner**: xUnit
- **Projeto**: `api/*.Tests` (ex.: `api/MyPerson.Api.Tests/MyPerson.Api.Tests.csproj`)
- **Mock**: `DbContext` com InMemory, dependências via interface ou `Mock`
- **Regra**: não subir servidor Kestrel; testar controllers/services isolados
- **Comando**: `dotnet test` na solution ou projeto de testes

### Frontend (`frontend/`)

- **Runner**: Vitest (ou Jest, quando configurado)
- **Arquivos**: `*.test.ts(x)` / `*.spec.ts(x)` ao lado do código ou em `__tests__`
- **Foco**: funções puras, utils, hooks, lógica de componentes
- **Regra**: priorizar Server Components via testes de dados; testar Client Components só quando há comportamento
- **Comando**: `npm test` / `npm run test` em `frontend/`

### Admin (`admin/`)

- **Runner**: Angular + Vitest (`ng test`)
- **Arquivos**: `*.spec.ts` ao lado do componente/serviço
- **Mock**: `RestService`, `HttpClient`, `Router`, `NotificationService`
- **Regra**: usar `TestBed` com componentes standalone; não acoplar pages de domínios diferentes
- **Comando**: `npm test` em `admin/` (ou `npx ng test --watch=false --browsers=ChromeHeadless`)

## Padrões de qualidade

- **AAA** (Arrange / Act / Assert) legível
- **Sem I/O real**: sem HTTP, banco ou disco de verdade
- **Sem asserts frágeis** de snapshot/HTML genérico para lógica de negócio
- **Um motivo por teste**: nomes descrevem o comportamento
- **Mocks justos**: mockar só a fronteira (DbContext, HttpClient, RestService)

## Comandos locais (iguais ao CI)

```bash
# API
cd api && dotnet test

# Frontend
cd frontend && npm test -- --run

# Admin
cd admin && npm test -- --run
```

Se algum serviço ainda não tiver suite configurada, veja o item 15 do [docs/PLANO-AUTOMACAO.md](./PLANO-AUTOMACAO.md).

## Severidade na revisão

| Tipo de mudança | Sem teste adequado |
|-----------------|--------------------|
| Bug fix / regra de negócio / auth / validação | **BLOQUEADO** |
| Nova feature com branch condicional | **BLOQUEADO** ou **RESSALVA** forte |
| UI puramente visual / copy / CSS | **OK** |
| Refactor sem mudança de comportamento | **RESSALVA** se não houver teste de regressão |
| Docs / CI / docker / rules | **OK** |

## Integração com o fluxo de desenvolvimento

1. `revisao-tecnica` → build/lint
2. `revisao-arquitetonica` → padrões de camada
3. `revisao-testes-unitarios` → cobertura e qualidade de testes
4. `smart-commit` → commit com mensagem padronizada
5. PR → CI roda `dotnet test` / `npm test` nos serviços tocados

## Documentação relacionada

- [docs/PLANO-AUTOMACAO.md](./PLANO-AUTOMACAO.md) — item 15 (infra de testes por serviço)
- [docs/ARCHITECTURE.md](./ARCHITECTURE.md) — padrões arquitetônicos
- [docs/AGENTS.md](./AGENTS.md) — comandos por serviço
- [api/API.md](../api/API.md) — endpoints da API
