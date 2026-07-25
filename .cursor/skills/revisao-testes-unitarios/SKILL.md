---
name: revisao-testes-unitarios
description: Revisa cobertura e qualidade de testes unitários no monorepo (api, frontend, admin) com base no diff. Use quando o usuário pedir revisão de testes, coverage, unit tests, se a mudança tem testes, ou antes de commit/PR que altera lógica.
---

# Revisão de Testes Unitários — MyPerson

Garante que mudanças de lógica em **qualquer serviço** do monorepo tenham testes unitários adequados (ou justifiquem a ausência). Não inventa infraestrutura pesada: usa o que o serviço já tem e sinaliza gaps.

## Quando usar

- “revisa os testes”, “tem teste unitário?”, “coverage”, “unit test review”
- Antes de commit/PR que muda controllers, services, utils, componentes com lógica
- Como parte de `pr-review` / gate de qualidade
- Quando o usuário pedir revisão em todo o projeto (rodar por serviço tocado)

## Base de regras

A política completa de testes está em [docs/TESTING.md](../../../docs/TESTING.md). Use este arquivo como checklist operacional.

## Stack esperada por serviço

| Serviço | Runner (alvo) | Convenção de arquivos | Comando |
|---------|---------------|----------------------|---------|
| `api/` | xUnit (+ Moq/NSubstitute se existir) | `*Tests.cs` em projeto `*.Tests` | `dotnet test` na solution/projeto de testes |
| `frontend/` | Vitest ou Jest (quando configurado) | `*.test.ts(x)` / `*.spec.ts(x)` ao lado do código | `npm test` / `npm run test` em `frontend/` |
| `admin/` | Angular + Vitest (`ng test`) | `*.spec.ts` ao lado do componente/serviço | `npm test` em `admin/` |

Se o runner **ainda não existir** no serviço: marcar **BLOQUEADO** ou **RESSALVA** conforme severidade da mudança (ver abaixo), e apontar para `docs/TESTING.md` / item do plano de automação — **não** instalar framework sem o usuário pedir.

## Workflow

### 1. Contexto do diff

Rodar em paralelo:

```bash
git status
git diff
git diff --cached
```

Identificar serviços tocados: `api/`, `frontend/`, `admin/`. Ignorar mudanças só de docs, docker, nginx, `.cursor/` (salvo se a skill for pedida explicitamente “em todo o projeto”).

### 2. Mapear código de produção → testes

Para cada arquivo de lógica no diff (não DTO/model anêmico, não CSS puro, não migration só de schema):

| Produção | Teste esperado |
|----------|----------------|
| `api/**/Controllers/*.cs` ou services | `api/**/*Tests.cs` cobrindo ações/casos |
| `frontend/**/*.ts(x)` com lógica | `*.test.ts(x)` / `*.spec.ts(x)` |
| `admin/**/*.ts` (services, guards, utils, pages com lógica) | `*.spec.ts` irmão |

Listar: **arquivos sem teste correspondente** e **testes alterados/criados no diff**.

### 3. Critérios de qualidade (por teste novo ou alterado)

- **Comporta-se como spec da mudança**: asserta o bugfix / a regra nova, não só “cria o componente”
- **AAA** (Arrange / Act / Assert) legível
- **Sem I/O real**: sem HTTP/DB de verdade; mock de `HttpClient` / `RestService` / `DbContext` conforme o serviço
- **Admin**: usa `TestBed` + imports standalone; não acopla a `pages` de outro domínio
- **API**: não sobe servidor Kestrel; testa método/serviço isolado
- **Frontend**: prefere testar função/pure logic; componente só se houver comportamento
- **Sem asserts frágeis** só em snapshot/HTML genérico (“Hello, admin”) para lógica de negócio nova
- **Um motivo por `it`/`Fact`** — nomes descrevem o comportamento

### 4. Executar testes só nos serviços tocados

```bash
# API (se existir projeto de testes)
dotnet test <projeto-ou-solution> --no-build  # ou com build se necessário

# Frontend (se script test existir)
cd frontend && npm test -- --run   # adaptar ao runner real

# Admin
cd admin && npm test -- --run      # ou ng test --watch=false --browsers=ChromeHeadless
```

Se o comando não existir / falhar por falta de setup: reportar como **gap de infraestrutura**, não como falha de lógica do usuário — a menos que o diff tenha introduzido testes quebrados.

### 5. Severidade (quando não há teste)

| Tipo de mudança | Sem teste adequado |
|-----------------|--------------------|
| Bug fix / regra de negócio / auth / validação | **BLOQUEADO** |
| Nova feature com branch condicional | **BLOQUEADO** ou **RESSALVA** forte |
| UI puramente visual / copy / CSS | **OK** (isentar) |
| Refactor sem mudança de comportamento | **RESSALVA** se não houver teste de regressão |
| Docs / CI / docker / rules | **OK** (isentar) |

### 6. Escopo “todo o projeto”

Se o usuário pedir revisão de testes **no monorepo inteiro** (não só o diff):

1. Inventariar testes existentes em `api/`, `frontend/`, `admin/`
2. Listar áreas críticas sem cobertura (auth, CRUD protegido, `RestService`, guards)
3. Rodar suites que existirem
4. Entregar backlog priorizado (não reescrever tudo de uma vez — ponytail)

## Formato de saída (obrigatório)

```markdown
## Revisão de testes unitários

**Veredito:** APROVADO | APROVADO COM RESSALVAS | BLOQUEADO

### Serviços tocados
- api: …
- frontend: …
- admin: …

### Cobertura do diff
| Produção | Teste | Status |
|----------|-------|--------|
| path | path ou — | ok / faltando / frágil |

### Execução
- comando → pass/fail/skip (motivo)

### Achados
1. [BLOQUEANTE|RESSALVA|INFO] …

### Próximos passos
- …
```

## Integração com outras skills

- Rodar **depois** de `revisao-tecnica` (build/lint) e **em paralelo** ou logo após `revisao-arquitetonica`
- `pr-review` deve incluir este checklist
- Não commitar na revisão — só reportar; commit fica com `smart-commit`

## Anti-padrões

- Pedir e2e/Cypress/Playwright no lugar de unitário
- Exigir 100% coverage em arquivo de markup
- Adicionar framework novo sem pedido explícito
- Reescrever specs legados só por estilo se já cobrem o comportamento
