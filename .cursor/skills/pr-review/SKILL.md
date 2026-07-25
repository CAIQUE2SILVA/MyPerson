---
name: pr-review
description: Review completo de PR, orquestrando revisão técnica, arquitetônica, testes unitários e atualização de docs. Use quando o usuário pedir "revisa o PR", "review deste branch", ou como prompt de Bugbot/Automation no GitHub.
---

# PR Review — MyPerson

Entrypoint único para review de PR. Orquestra as skills especializadas e emite um veredito final.

## Quando usar

- "revisa o PR"
- "review deste branch"
- "revisão completa do PR"
- Bugbot / Automation no GitHub em `pull_request`

## Contexto obrigatório

Antes de começar, ler:

- `docs/AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `docs/CONVENTIONS.md`
- `docs/PLANO-AUTOMACAO.md`

## Workflow

### 1. Revisão Técnica

Use `.cursor/skills/revisao-tecnica/` para:

- Analisar `git status` + `git diff`
- Rodar lint/build nos serviços tocados
- Bloquear secrets
- Sinalizar misturas desnecessárias de serviços

### 2. Revisão Arquitetônica

Use `.cursor/skills/revisao-arquitetonica/` para:

- Validar padrões de API, frontend, admin
- Verificar camadas e rotas nginx/docker

### 3. Revisão de Testes Unitários

Use `.cursor/skills/revisao-testes-unitarios/` para:

- Mapear produção ↔ testes
- Avaliar qualidade
- Rodar suites nos serviços tocados
- Emitir severidade (BLOQUEADO / RESSALVA / OK)

### 4. Atualização de Documentação

Use `.cursor/skills/atualizar-docs/` para verificar se o PR precisa atualizar:

- `api/API.md` (novos/alterados endpoints)
- `docs/PROJETO.md` (infra, env, stack)
- `docs/ARCHITECTURE.md` (padrões novos)
- `docs/TESTING.md` (política de testes)
- `docs/AGENTS.md` / `CLAUDE.md` (skills novas ou comandos)

## Saída final

```markdown
## PR Review — <branch>

**Veredito:** APROVADO | APROVADO COM RESSALVAS | BLOQUEADO

### Resumo executivo
- Serviços tocados: api/frontend/admin/infra/docs
- Risco principal: ...

### Revisão Técnica
- Veredito: ...
- Achados: ...

### Revisão Arquitetônica
- Veredito: ...
- Achados: ...

### Revisão de Testes Unitários
- Veredito: ...
- Achados: ...

### Documentação
- Docs atualizadas: sim/não/parcialmente
- O que falta: ...

### Checklist de merge
- [ ] CI passa (build + lint + test nos serviços tocados)
- [ ] Não há secrets no diff
- [ ] Padrões arquitetônicos respeitados
- [ ] Testes adequados para lógica de negócio
- [ ] Docs atualizadas quando aplicável
- [ ] Mensagens de commit seguem Conventional Commits

### Próximos passos
- ...
```

## Regras de veredito final

- Qualquer **BLOQUEADO** em uma das etapas → **BLOQUEADO** geral.
- **RESSALVAS** não críticas podem gerar **APROVADO COM RESSALVAS**.
- Docs faltando para mudança de API/infra/rotas → **RESSALVA** forte ou **BLOQUEADO**.

## Integração com CI

- O agente valida padrão e lacunas de teste no diff; o CI valida build/test mecânico.
- Não aprovar um PR cujo CI esteja vermelho.

## Anti-padrões

- Fazer review genérico de estilo sem considerar as rules do projeto.
- Ignorar quebra arquitetônica porque os testes passam.
- Aprovar sem verificar se docs foram atualizadas.
