# Plano de Melhoria — Documentação, Skills e CI/CD

Plano numerado para aumentar a automação e a qualidade do monorepo MyPerson.  
Cada item é independente o bastante para virar um PR pequeno; a ordem abaixo reduz retrabalho.

**Estado atual (baseline)**

| Área | Situação |
|------|----------|
| Docs | `README.md`, `docs/PROJETO.md`, `docs/AGENTS.md`, `api/API.md` — links e stack parcialmente desatualizados |
| Rules | `.cursor/rules/` cobrindo monorepo, API, frontend, admin, docker, ponytail |
| Skills | `git-commit`, `smart-commit` (sobrepostas) + `revisao-testes-unitarios` |
| Testes | Quase só Admin (`*.spec.ts`); API e Frontend sem suite unitária configurada |
| CI/CD | Sem `.github/workflows` |
| Claude / outros agentes | Sem `CLAUDE.md` na raiz |

**Objetivo final**

```text
dev → revisao-tecnica → revisao-arquitetonica (se estrutura)
    → revisao-testes-unitarios → commit
    → push/PR → CI (build/lint/test por serviço) → agent review no PR → merge
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
- Mencionar skill `revisao-testes-unitarios` e `docs/TESTING.md` (quando existir)

**Critério de pronto:** abrir o repo em Claude Code já carrega o contrato do projeto.

---

### 4. Enxugar e estabilizar `docs/AGENTS.md`

**Por quê:** tabela de “commits recentes” envelhece e vira ruído.

**Fazer:**
- Remover histórico de commits estático; instruir `git log --oneline -5`
- Manter: visão rápida, regras, comandos Cloud Agent, lint/build/**test** por serviço
- Linkar skills (incl. `revisao-testes-unitarios`) e este plano

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

### 6. Criar `docs/TESTING.md` (testes unitários em todo o monorepo)

**Por quê:** sem contrato único, cada serviço testa (ou não) de um jeito; a skill de revisão precisa de fonte estável.

**Fazer:**
- Política: mudança de lógica de negócio / bugfix / auth → teste unitário obrigatório
- Por serviço:
  - **API:** xUnit, projeto `api/*.Tests`, mocks de DbContext/deps; sem Kestrel
  - **Frontend:** Vitest (ou Jest), `*.test.ts(x)` / `*.spec.ts(x)`; priorizar lógica pura
  - **Admin:** Vitest via `ng test`, `*.spec.ts`; mock de `RestService`; TestBed standalone
- O que **não** exige unitário: CSS/copy, migrations isoladas, docs, docker
- Comandos locais iguais aos do CI
- Link para skill `.cursor/skills/revisao-testes-unitarios/`

**Critério de pronto:** agente e humano sabem o que testar e como rodar em `api` / `frontend` / `admin`.

---

### 7. Criar `docs/CONVENTIONS.md`

**Por quê:** commits, branches e PRs precisam de uma regra única para skills e CI.

**Fazer:**
- Conventional Commits (tipos + escopos: `api`, `frontend`, `admin`, `docker`, `docs`, `ci`, `test`)
- Branches: `feat/…`, `fix/…`, cloud: `cursor/<nome>-aec9`
- PR: descrição mínima; checklist local incluindo testes dos serviços tocados
- Idioma: português nas mensagens do projeto

**Critério de pronto:** `smart-commit` e CI de mensagem (se houver) apontam para este arquivo.

---

### 8. Criar `docs/CI.md`

**Por quê:** documentar o que o pipeline valida evita “CI vermelho misterioso”.

**Fazer:**
- Jobs por serviço: build, lint (onde houver) e **test**
- Path filters e triggers (`pull_request`, `push` em `main`)
- Como rodar localmente o mesmo comando do CI
- O que NÃO está no CI ainda (ex.: e2e) e por quê

**Critério de pronto:** criado junto ou logo após o workflow do item 16; completar no item 17.

---

### 9. Skill `atualizar-docs` (fecha o ciclo da documentação)

**Por quê:** mudança de endpoint/rota/env sem atualizar docs é regressão silenciosa.

**Trigger:** “atualiza a doc”, mudança em controllers, nginx, env, rotas admin/frontend.

**Fazer:** skill que, após o diff, atualiza `api/API.md` / `PROJETO.md` / `AGENTS.md` / `ARCHITECTURE.md` / `TESTING.md` conforme o caso.

**Critério de pronto:** mudança de API no mesmo PR já inclui diff de docs quando aplicável.

---

## Fase B — Skills (automação local do agente)

### 10. Unificar skills de commit

**Por quê:** `git-commit` e `smart-commit` fazem quase a mesma coisa.

**Fazer:**
- Manter uma skill canônica (`smart-commit` ou `git-commit`)
- A outra vira stub que redireciona, ou é removida
- Alinhar com `docs/CONVENTIONS.md` (idioma PT, escopos do monorepo)

**Critério de pronto:** um único fluxo de commit documentado em `AGENTS.md`.

---

### 11. Criar skill `revisao-tecnica` (gate antes do commit)

**Por quê:** pega build quebrado, secret e diff bagunçado antes do histórico git.

**Trigger:** “revisa antes de commitar”, “code review”, “pré-commit”, “revisão técnica”.

**Checklist obrigatório:**
1. Analisar `git status` + `git diff` / `git diff --cached`
2. Rodar lint/build só nos serviços tocados (`dotnet build`, `npm run lint` / `build`)
3. Bloquear secrets (`.env`, tokens, connection strings)
4. Sinalizar misturas desnecessárias de `api`+`frontend`+`admin` no mesmo commit
5. Encaminhar para `revisao-testes-unitarios` se o diff tocar lógica
6. Saída: **APROVADO** / **APROVADO COM RESSALVAS** / **BLOQUEADO** + lista de achados

**Critério de pronto:** agente consegue bloquear commit claramente inadequado sem o usuário pedir item a item.

---

### 12. Criar skill `revisao-arquitetonica`

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

### 13. Skill `revisao-testes-unitarios` (todo o monorepo) ✅ em andamento / criada

**Por quê:** build verde sem teste de regressão não protege auth, CRUD nem rules de negócio.

**Status:** skill criada em `.cursor/skills/revisao-testes-unitarios/SKILL.md`.

**Trigger:** “revisa os testes”, “unit test”, “coverage”, “tem teste?”, revisão em todo o projeto.

**Checklist (resumo):**
1. Mapear diff (ou inventário full-repo se pedido) em `api` / `frontend` / `admin`
2. Parear produção ↔ `*Tests.cs` / `*.spec.ts` / `*.test.ts(x)`
3. Avaliar qualidade (AAA, mocks, sem I/O real, asserts úteis)
4. Rodar suite só nos serviços tocados
5. Severidade: bug/auth/regra sem teste → **BLOQUEADO**
6. Saída padronizada com veredito

**Ainda falta para fechar o item:**
- `docs/TESTING.md` (item 6)
- Infra de testes na API e no Frontend (item 15)
- CI rodando `dotnet test` / `npm test` (item 16)
- `pr-review` e `revisao-tecnica` chamando esta skill (itens 11 e 14)
- Link em `AGENTS.md` / `CLAUDE.md`

**Critério de pronto:** mudança de lógica em qualquer serviço passa por esta skill antes do merge; CI executa as suites existentes.

---

### 14. Criar skill `pr-review`

**Por quê:** um único entrypoint para review completo de PR.

**Trigger:** “revisa o PR”, “review deste branch”, Bugbot/Automation no GitHub.

**Fazer:** orquestrar:
- `revisao-tecnica` (item 11)
- `revisao-arquitetonica` (item 12)
- `revisao-testes-unitarios` (item 13)
- docs atualizados (item 9)

**Critério de pronto:** prompt de Automation/Bugbot aponta só para esta skill + `docs/AGENTS.md`.

---

### 15. Infraestrutura de testes unitários por serviço

**Por quê:** a skill sozinha não cria runner; API e Frontend ainda não têm suite.

**Fazer (PRs separados por serviço, ponytail):**

| Serviço | Trabalho |
|---------|----------|
| `admin/` | Manter Vitest/`ng test`; melhorar specs frágeis; cobrir `RestService`, guards, auth |
| `api/` | Criar projeto `*.Tests` (xUnit), referência à API, 1–2 testes âncora (ex.: health/auth/produto) |
| `frontend/` | Configurar Vitest (ou Jest) + script `test`; 1–2 testes âncora de util/lógica |

Não misturar e2e neste item.

**Critério de pronto:** `dotnet test` / `npm test` rodam com pelo menos um teste verde em cada serviço.

---

### 16. Skills opcionais de alto ROI (depois do núcleo)

Ordem sugerida:

1. **`debug-servicos`** — subir postgres/nginx + API/frontend/admin no Cloud Agent
2. **`novo-endpoint-api`** — scaffold controller + DTO + teste âncora + nota em `API.md`
3. **`novo-page-admin`** — scaffold em `pages/<domínio>/` + `*.spec.ts` mínimo

**Critério de pronto:** cada skill tem `description` com triggers claros e checklist curto.

---

## Fase C — CI/CD e agents no PR

### 17. Adicionar GitHub Actions CI (build + lint + test)

**Por quê:** hoje não há rede de segurança mecânica no remoto.

**Fazer:** `.github/workflows/ci.yml`

| Job | Comandos | Path filter |
|-----|----------|-------------|
| `api` | `dotnet restore` + `dotnet build -c Release` + `dotnet test` | `api/**` |
| `frontend` | `npm ci` + `npm run lint` + `npm test` + `npm run build` | `frontend/**` |
| `admin` | `npm ci` + `npm test` + `npm run build` | `admin/**` |

Triggers: `pull_request`, `push` em `main`. Jobs em paralelo.  
Se um serviço ainda não tiver suite (antes do item 15), o job de test pode ser `continue-on-error` temporário — remover assim que o item 15 fechar.

**Critério de pronto:** PR que quebra build **ou teste** do serviço tocado fica vermelho.

---

### 18. Documentar o pipeline (`docs/CI.md` — item 8) e linkar no README

**Fazer:** após o workflow existir, preencher `docs/CI.md` (incluir jobs de test) e linkar em `README` + `AGENTS.md` + `TESTING.md`.

---

### 19. Endurecimentos leves de CI (segunda leva)

Só depois do CI básico estável:

1. Cache NuGet / `node_modules`
2. Job opcional de build Docker em `main` (ou `workflow_dispatch`)
3. Check de links de docs
4. (Opcional) Conventional Commits no título do PR
5. (Opcional) gate de coverage mínimo só em pastas críticas (`api` auth, `admin` core) — sem meta ilusória de 100%

---

### 20. Ligar agent review no PR

**Por quê:** CI valida build/test mecânico; agente valida padrão + lacunas de teste no diff.

**Fazer:**
- Cursor Bugbot e/ou Cloud Automation no `pull_request`
- Prompt fixo: `docs/AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, skill `pr-review` (inclui testes)
- Escopo: conformidade com monorepo — não “estilo genérico”

**Critério de pronto:** todo PR recebe review alinhado às rules e à política de testes.

---

### 21. Produção / deploy (só quando CI de PR estiver maduro)

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
| 6 | Criar `TESTING.md` | Docs / Testes |
| 7 | Criar `CONVENTIONS.md` | Docs |
| 8 | Criar `CI.md` (esqueleto; completar no 18) | Docs |
| 9 | Skill `atualizar-docs` | Docs ↔ Skills |
| 10 | Unificar commit skills | Skills |
| 11 | Skill `revisao-tecnica` | Skills |
| 12 | Skill `revisao-arquitetonica` | Skills |
| 13 | Skill `revisao-testes-unitarios` | Skills / Testes |
| 14 | Skill `pr-review` | Skills |
| 15 | Infra de testes (api + frontend + reforço admin) | Testes |
| 16 | Skills opcionais (debug / scaffold + teste) | Skills |
| 17 | GitHub Actions CI (build/lint/test) | CI |
| 18 | Completar `CI.md` + links | Docs + CI |
| 19 | Endurecimentos CI (+ coverage opcional) | CI |
| 20 | Agent review no PR | CI + Agents |
| 21 | Deploy prod (quando maduro) | CI |

---

## Princípios (ponytail)

- Um PR por item ou por bloco pequeno (ex.: 1–4 docs; 11–13 skills; 15 por serviço; 17 CI).
- Não inventar abstração de “plataforma de agents” — skills + docs + Actions bastam.
- Agent não substitui CI: CI = mecânico; skill/agent = julgamento de padrão e de lacuna de teste.
- Reutilizar `.cursor/rules/` existentes; docs novas só consolidam, não contradizem.
- Teste unitário > e2e neste plano; e2e fica explícito como fora de escopo até o núcleo estar estável.

---

## Como usar este plano

1. Pegue o próximo `#` não feito.
2. Abra um branch / PR só daquele item (ou do bloco indicado).
3. Marque o item como feito neste arquivo (checkbox abaixo) no mesmo PR, se quiser rastreio.

### Checklist de progresso

- [x] 1 Links
- [x] 2 PROJETO.md
- [x] 3 CLAUDE.md
- [x] 4 AGENTS.md
- [x] 5 ARCHITECTURE.md
- [x] 6 TESTING.md
- [x] 7 CONVENTIONS.md
- [x] 8 CI.md (esqueleto)
- [x] 9 Skill atualizar-docs
- [x] 10 Unificar commits
- [x] 11 revisao-tecnica
- [x] 12 revisao-arquitetonica
- [x] 13 revisao-testes-unitarios (skill atualizada; TESTING.md + infra + CI prontos)
- [x] 14 pr-review
- [x] 15 Infra de testes por serviço
- [x] 16 Skills opcionais
- [x] 17 CI Actions (com test)
- [x] 18 CI.md completo
- [x] 19 Endurecimentos CI
- [x] 20 Agent no PR
- [x] 21 Deploy
