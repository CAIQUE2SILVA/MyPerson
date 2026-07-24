# Agent Review no PR — MyPerson

Este prompt é usado pelo Cursor Bugbot ou Cloud Automation para review de PRs.

## Trigger

- `pull_request` (opened, synchronize, reopened)

## Contexto obrigatório

Antes de analisar o diff, leia:

- `docs/AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `docs/CONVENTIONS.md`

## Instrução de review

Execute a skill `.cursor/skills/pr-review/` para este PR. Em resumo:

1. **Revisão Técnica** (`revisao-tecnica`)
   - Analise `git diff` e `git status`
   - Valide build/lint nos serviços tocados
   - Bloqueie secrets no diff
   - Sinalize misturas desnecessárias de `api/` + `frontend/` + `admin/`

2. **Revisão Arquitetônica** (`revisao-arquitetonica`)
   - API: DTOs, `[Authorize]`, migrations
   - Frontend: App Router, Server Components, fetch `/api`
   - Admin: camadas `core/shared/ui/pages`, `RestService`, `API_ENDPOINTS`
   - Nginx/Docker: rotas `/`, `/api`, `/admin` intactas

3. **Revisão de Testes** (`revisao-testes-unitarios`)
   - Mapeie produção ↔ testes
   - Avalie qualidade (AAA, mocks, sem I/O real)
   - Bloqueie mudanças de lógica/auth/bugfix sem teste

4. **Documentação** (`atualizar-docs`)
   - Verifique se endpoints novos estão em `api/API.md`
   - Verifique se padrões novos estão em `docs/ARCHITECTURE.md`
   - Verifique se skills novas estão em `docs/AGENTS.md` e `CLAUDE.md`

## Saída esperada

Emita um comentário no PR com:

```markdown
## Agent Review — MyPerson

**Veredito:** APROVADO | APROVADO COM RESSALVAS | BLOQUEADO

### Resumo
- Serviços tocados: ...
- Achados principais: ...

### Checklist
- [ ] CI passa
- [ ] Sem secrets
- [ ] Padrões arquitetônicos respeitados
- [ ] Testes adequados para lógica
- [ ] Docs atualizadas

### Próximos passos
- ...
```

## Escopo

Foque em conformidade com o monorepo MyPerson. Não faça review genérico de estilo fora das regras do projeto.
