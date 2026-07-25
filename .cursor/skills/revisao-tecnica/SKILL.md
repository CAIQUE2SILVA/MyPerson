---
name: revisao-tecnica
description: Gate técnico antes do commit: analisa diff, roda lint/build nos serviços tocados, bloqueia secrets e misturas de serviços, e encaminha para revisão de testes quando há lógica. Use quando o usuário pedir "revisa antes de commitar", "code review", "pré-commit" ou "revisão técnica".
---

# Revisão Técnica — MyPerson

Análise técnica do diff antes do commit. Pega build quebrado, secrets, diffs bagunçados e misturas desnecessárias entre serviços.

## Quando usar

- "revisa antes de commitar"
- "code review"
- "pré-commit"
- "revisão técnica"
- Antes de executar `smart-commit` quando o diff não é trivial

## Workflow

### 1. Coletar contexto

Rodar em paralelo:

```bash
git status
git diff
git diff --cached
git log --oneline -5
```

Identificar serviços tocados: `api/`, `frontend/`, `admin/`, `nginx/`, `docker-compose*.yml`, `.cursor/`, `docs/`.

### 2. Checklist obrigatório

#### 2.1 Diff organizado

- [ ] Não há arquivos não relacionados ao propósito do commit (ex.: `package-lock.json` de outro serviço, logs, caches)
- [ ] Não há WIP (comentários de debug, `console.log`, `TODO` sem justificativa)
- [ ] Tamanho do diff é razoável para revisão (se for gigante, sugerir split)

#### 2.2 Lint e build nos serviços tocados

Para cada serviço com código alterado, rodar o comando mínimo:

| Serviço | Comando |
|---------|---------|
| `api/` | `dotnet build -c Release` |
| `frontend/` | `npm run lint` e `npm run build` |
| `admin/` | `npm run build` |

Se o comando não existir ou falhar por falta de setup, registre como **RESSALVA** e aponte para o item do plano.

#### 2.3 Bloqueio de secrets

Verificar no diff:

- `.env` sendo commitado
- Connection strings com senha real
- Tokens JWT, API keys, senhas
- Chaves privadas

Se encontrar: **BLOQUEADO** até remover ou mover para variável de ambiente / secrets.

#### 2.4 Mistura de serviços

- Um commit idealmente toca um único serviço ou infra compartilhada.
- Se `api/` + `frontend/` + `admin/` aparecem juntos sem motivo claro (ex.: alteração de contrato coordenada), sinalizar como **RESSALVA**.
- Alterações coordenadas (ex.: novo endpoint + tela admin que o consome) são aceitáveis, mas devem ser explicadas no corpo do commit.

#### 2.5 Encaminhar para revisão de testes

Se o diff toca lógica de negócio, controllers, services, guards, utils, componentes com comportamento:

- Encaminhar para `.cursor/skills/revisao-testes-unitarios/`.
- Se o diff for só docs/CSS/copy/migrations sem lógica, isentar.

## Saída padronizada

```markdown
## Revisão Técnica

**Veredito:** APROVADO | APROVADO COM RESSALVAS | BLOQUEADO

### Serviços tocados
- api: sim/não — arquivos: ...
- frontend: sim/não — arquivos: ...
- admin: sim/não — arquivos: ...

### Build / Lint
| Serviço | Comando | Resultado |
|---------|---------|-----------|
| api | `dotnet build -c Release` | pass/fail/skip |
| frontend | `npm run lint` / `npm run build` | pass/fail/skip |
| admin | `npm run build` | pass/fail/skip |

### Achados
1. [BLOQUEANTE|RESSALVA|INFO] ...

### Próximos passos
- (se houver) Rodar `revisao-testes-unitarios`
- (se houver) Corrigir secret em ...
- (se houver) Splitar commit em ...
```

## Integração com outras skills

- Antes de `smart-commit` em diffs não triviais.
- Encaminha para `revisao-testes-unitarios` quando há lógica.
- É chamada por `pr-review` como primeira etapa.

## Anti-padrões

- Aprovar sem rodar build/lint quando o serviço afetado tem comando disponível.
- Bloquear por estilo quando a convenção do projeto não exige.
- Deixar passar secret óbvio no diff.
