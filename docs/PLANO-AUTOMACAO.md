# Plano de Melhoria — Documentação, Skills e CI/CD

Plano numerado para aumentar a automação e a qualidade do monorepo MyPerson.  
Cada item é independente o bastante para virar um PR pequeno; a ordem abaixo reduz retrabalho.

**Estado atual (baseline)**

| Área | Situação |
|------|----------|
| Docs | `README.md`, `docs/PROJETO.md`, `docs/AGENTS.md`, `api/API.md` — links e stack parcialmente desatualizados |
| Rules | `.cursor/rules/` cobrindo monorepo, API, frontend, admin, docker, ponytail |
| Skills | Só `git-commit` e `smart-commit` (sobrepostas) |
| CI/CD | Sem `.github/workflows` |
| Claude / outros agentes | Sem `CLAUDE.md` na raiz |

**Objetivo final**

```text
dev → revisao-tecnica → (revisao-arquitetonica se estrutura) → commit
    → push/PR → CI (build/lint por serviço) → agent review no PR → merge
```

---

## Fase A — Documentação (fundação para agentes e humanos)

### 1. Corrigir índices e links quebrados

**Por quê:** o README ainda aponta para `./PROJETO.md`, mas o arquivo vive em `docs/PROJETO.md`.

**Fazer:**
- Atualizar links em `README.md` → `docs/PROJETO.md`, `docs/AGENTS.md`, este plano
- Conferir referências cruzadas em `docs/AGENTS.md` e READMEs de `admin/` / `frontend/`

**Critério de pronto:** nenhum link interno do README aponta para arquivo inexistente.

---

### 2. Atualizar `docs/PROJETO.md` para a stack real

**Por quê:** ainda descreve “React” genérico e estrutura incompleta.

**Fazer:**
- Stack: ASP.NET Core 8, Next.js 16 + React 19, Angular 21, PostgreSQL 16, Nginx, JWT
- Estrutura de pastas incluindo `.cursor/`, `docs/`, `docker-compose.prod.yml`
- Fluxo de requests e URLs (`/`, `/api`, `/admin`)
- Distinção dev local vs Docker vs Cloud Agent (apontar para `AGENTS.md`)

**Critério de pronto:** um agente novo consegue entender arquitetura sem ler o código.

---

### 3. Criar `CLAUDE.md` na raiz

**Por quê:** Claude Code e outros agentes procuram esse arquivo; hoje só existe `docs/AGENTS.md` (Cursor).

**Fazer:**
- Arquivo curto na raiz apontando para `docs/AGENTS.md`, `docs/PROJETO.md`, `api/API.md`, `.cursor/rules/`
- Regras duras: não misturar `api/` / `frontend/` / `admin/`; HTTP via `/api`; diff mínimo (ponytail)

**Critério de pronto:** abrir o repo em Claude Code já carrega o contrato do projeto.

---

### 4. Enxugar e estabilizar `docs/AGENTS.md`

**Por quê:** tabela de “commits recentes” envelhece e vira ruído.

**Fazer:**
- Remover histórico de commits estático; instruir `git log --oneline -5`
- Manter: visão rápida, regras, comandos Cloud Agent, lint/build por serviço
- Linkar skills (quando existirem) e este plano

**Critério de pronto:** AGENTS.md só contém instruções que não dependem de data.

---

### 5. Criar `docs/ARCHITECTURE.md`

**Por quê:** padrões estão espalhados nas rules; humanos e reviews precisam de um checklist único.

**Fazer:** consolidar (sem duplicar código de exemplo longo):
- API: controllers, DTOs, auth, migrations
- Frontend: App Router, Server Components, consumo `/api`
- Admin: camadas `core` / `shared` / `ui` / `pages`, `RestService`, constants de endpoints
- Infra: Nginx e limites do monorepo

**Critério de pronto:** skill de revisão arquitetônica e review de PR usam este doc como fonte.

---

### 6. Criar `docs/CONVENTIONS.md`

**Por quê:** commits, branches e PRs precisam de uma regra única para skills e CI.

**Fazer:**
- Conventional Commits (tipos + escopos: `api`, `frontend`, `admin`, `docker`, `docs`, `ci`)
- Branches: `feat/…`, `fix/…`, cloud: `cursor/<nome>-aec9`
- PR: descrição mínima, o que validar localmente antes de abrir
- Idioma: português nas mensagens do projeto

**Critério de pronto:** `smart-commit` e CI de mensagem (se houver) apontam para este arquivo.

---

### 7. Criar `docs/CI.md`

**Por quê:** documentar o que o pipeline valida evita “CI vermelho misterioso”.

**Fazer:**
- Jobs por serviço e triggers (`pull_request`, `push` em `main`)
- Path filters
- Como rodar localmente o mesmo comando do CI
- O que NÃO está no CI ainda (ex.: e2e) e por quê

**Critério de pronto:** criado junto ou logo após o workflow do item 14.

---

### 8. Skill `atualizar-docs` (fecha o ciclo da documentação)

**Por quê:** mudança de endpoint/rota/env sem atualizar docs é regressão silenciosa.

**Trigger:** “atualiza a doc”, mudança em controllers, nginx, env, rotas admin/frontend.

**Fazer:** skill que, após o diff, atualiza `api/API.md` / `PROJETO.md` / `AGENTS.md` / `ARCHITECTURE.md` conforme o caso.

**Critério de pronto:** mudança de API no mesmo PR já inclui diff de docs quando aplicável.

---

## Fase B — Skills (automação local do agente)

### 9. Unificar skills de commit

**Por quê:** `git-commit` e `smart-commit` fazem quase a mesma coisa.

**Fazer:**
- Manter uma skill canônica (`smart-commit` ou `git-commit`)
- A outra vira stub que redireciona, ou é removida
- Alinhar com `docs/CONVENTIONS.md` (idioma PT, escopos do monorepo)

**Critério de pronto:** um único fluxo de commit documentado em `AGENTS.md`.

---

### 10. Criar skill `revisao-tecnica` (gate antes do commit)

**Por quê:** pega build quebrado, secret e diff bagunçado antes do histórico git.

**Trigger:** “revisa antes de commitar”, “code review”, “pré-commit”, “revisão técnica”.

**Checklist obrigatório:**
1. Analisar `git status` + `git diff` / `git diff --cached`
2. Rodar lint/build só nos serviços tocados (`dotnet build`, `npm run lint` / `build`)
3. Bloquear secrets (`.env`, tokens, connection strings)
4. Sinalizar misturas desnecessárias de `api`+`frontend`+`admin` no mesmo commit
5. Saída: **APROVADO** / **APROVADO COM RESSALVAS** / **BLOQUEADO** + lista de achados

**Critério de pronto:** agente consegue bloquear commit claramente inadequado sem o usuário pedir item a item.

---

### 11. Criar skill `revisao-arquitetonica`

**Por quê:** CI não valida “está na pasta certa / usa RestService / não expõe entity”.

**Trigger:** “revisão arquitetural”, “segue o padrão?”, PR que muda estrutura.

**Fazer:** ler `docs/ARCHITECTURE.md` + rules por path e validar o diff:
- `api/**` — DTOs, `[Authorize]` em writes, migrations se schema mudou
- `frontend/**` — App Router, fetch via `/api`
- `admin/**` — camadas, `RestService`, endpoints em constants
- Docker/nginx — rotas `/`, `/api`, `/admin` intactas

**Saída:** tabela `padrão → evidência no diff → ok/quebra`.

**Critério de pronto:** violações de camada admin ou entity na API aparecem no relatório.

---

### 12. Criar skill `pr-review`

**Por quê:** um único entrypoint para review completo de PR (técnica + arquitetura + docs).

**Trigger:** “revisa o PR”, “review deste branch”, Bugbot/Automation no GitHub.

**Fazer:** orquestrar checklists dos itens 10 e 11 + checagem se docs foram atualizados (item 8).

**Critério de pronto:** prompt de Automation/Bugbot aponta só para esta skill + `docs/AGENTS.md`.

---

### 13. Skills opcionais de alto ROI (depois do núcleo)

Ordem sugerida:

1. **`debug-servicos`** — subir postgres/nginx + API/frontend/admin no Cloud Agent (comandos já em `AGENTS.md`)
2. **`novo-endpoint-api`** — scaffold controller + DTO + nota em `API.md`
3. **`novo-page-admin`** — scaffold em `pages/<domínio>/` seguindo `admin-architecture`

**Critério de pronto:** cada skill tem `description` com triggers claros e checklist curto (ponytail: sem boilerplate).

---

## Fase C — CI/CD e agents no PR

### 14. Adicionar GitHub Actions CI mínimo

**Por quê:** hoje não há rede de segurança mecânica no remoto.

**Fazer:** `.github/workflows/ci.yml`

| Job | Comandos | Path filter |
|-----|----------|-------------|
| `api` | `dotnet restore` + `dotnet build -c Release` | `api/**` |
| `frontend` | `npm ci` + `npm run lint` + `npm run build` | `frontend/**` |
| `admin` | `npm ci` + `npm run build` | `admin/**` |

Triggers: `pull_request`, `push` em `main`. Jobs em paralelo.

**Critério de pronto:** PR que quebra build do serviço tocado fica vermelho.

---

### 15. Documentar o pipeline (`docs/CI.md` — item 7) e linkar no README

**Fazer:** após o workflow existir, preencher `docs/CI.md` e linkar em `README` + `AGENTS.md`.

---

### 16. Endurecimentos leves de CI (segunda leva)

Só depois do CI básico estável:

1. Cache NuGet / `node_modules`
2. Job opcional de build Docker em `main` (ou `workflow_dispatch`)
3. Check de links de docs (falha se README apontar arquivo morto)
4. (Opcional) validação de Conventional Commits no título do PR

---

### 17. Ligar agent review no PR

**Por quê:** CI valida build; agente valida padrão do monorepo.

**Fazer:**
- Cursor Bugbot e/ou Cloud Automation no `pull_request`
- Prompt fixo: ler `docs/AGENTS.md`, `docs/ARCHITECTURE.md`, skill `pr-review`
- Escopo: conformidade com monorepo — não “estilo genérico”

**Critério de pronto:** todo PR recebe comentário de review alinhado às rules do projeto.

---

### 18. Produção / deploy (só quando CI de PR estiver maduro)

**Fazer (quando fizer sentido):**
- Workflow separado `deploy.yml` (manual ou tag) usando `docker-compose.prod.yml`
- Secrets no GitHub (nunca no repo)
- Documentar em `docs/CI.md` e `PROJETO.md`

**Fora de escopo deste plano inicial:** e2e browser, staging completo, multi-ambiente.

---

## Ordem de execução resumida

| # | Item | Fase |
|---|------|------|
| 1 | Corrigir links / índices | Docs |
| 2 | Atualizar `PROJETO.md` | Docs |
| 3 | Criar `CLAUDE.md` | Docs |
| 4 | Enxugar `AGENTS.md` | Docs |
| 5 | Criar `ARCHITECTURE.md` | Docs |
| 6 | Criar `CONVENTIONS.md` | Docs |
| 7 | Criar `CI.md` (esqueleto; completar no 15) | Docs |
| 8 | Skill `atualizar-docs` | Docs ↔ Skills |
| 9 | Unificar commit skills | Skills |
| 10 | Skill `revisao-tecnica` | Skills |
| 11 | Skill `revisao-arquitetonica` | Skills |
| 12 | Skill `pr-review` | Skills |
| 13 | Skills opcionais (debug / scaffold) | Skills |
| 14 | GitHub Actions CI mínimo | CI |
| 15 | Completar `CI.md` + links | Docs + CI |
| 16 | Cache, Docker build, checks extras | CI |
| 17 | Agent review no PR | CI + Agents |
| 18 | Deploy prod (quando maduro) | CI |

---

## Princípios (ponytail)

- Um PR por item ou por bloco pequeno (ex.: 1–4 docs; 10+11 skills; 14 CI).
- Não inventar abstração de “plataforma de agents” — skills + docs + Actions bastam.
- Agent não substitui CI: CI = mecânico; skill/agent = julgamento de padrão.
- Reutilizar `.cursor/rules/` existentes; docs novas só consolidam, não contradizem.

---

## Como usar este plano

1. Pegue o próximo `#` não feito.
2. Abra um branch / PR só daquele item (ou do bloco indicado).
3. Marque o item como feito neste arquivo (checkbox abaixo) no mesmo PR, se quiser rastreio.

### Checklist de progresso

- [ ] 1 Links
- [ ] 2 PROJETO.md
- [ ] 3 CLAUDE.md
- [ ] 4 AGENTS.md
- [ ] 5 ARCHITECTURE.md
- [ ] 6 CONVENTIONS.md
- [ ] 7 CI.md (esqueleto)
- [ ] 8 Skill atualizar-docs
- [ ] 9 Unificar commits
- [ ] 10 revisao-tecnica
- [ ] 11 revisao-arquitetonica
- [ ] 12 pr-review
- [ ] 13 Skills opcionais
- [ ] 14 CI Actions
- [ ] 15 CI.md completo
- [ ] 16 Endurecimentos CI
- [ ] 17 Agent no PR
- [ ] 18 Deploy
