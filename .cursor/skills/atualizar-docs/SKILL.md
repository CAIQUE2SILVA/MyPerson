---
name: atualizar-docs
description: Após um diff, atualiza a documentação do projeto (API.md, PROJETO.md, AGENTS.md, ARCHITECTURE.md, TESTING.md, CI.md) conforme o caso. Use quando o usuário pedir "atualiza a doc", ou quando o diff tocar controllers, nginx, env, rotas admin/frontend, ou skills de revisão.
---

# Atualizar Documentação — MyPerson

Garante que mudanças de código, infra ou processo sejam refletidas na documentação correta do monorepo. Não duplica conteúdo: atualiza o doc primário e linka os outros quando necessário.

## Quando usar

- Usuário pede: "atualiza a doc", "documenta isso", "docs precisam refletir"
- Diff toca `api/**/*.cs` (controllers, DTOs, endpoints, auth)
- Diff toca `nginx/` ou `docker-compose*.yml` (rotas, env, infra)
- Diff toca `admin/src/app/**` (rotas, camadas, serviços)
- Diff toca `frontend/src/app/**` (rotas, Server Components, consumo de API)
- Diff cria/altera skills de revisão (`revisao-tecnica`, `revisao-arquitetonica`, `revisao-testes-unitarios`, `pr-review`)

## Workflow

### 1. Mapear o diff para docs

Para cada serviço ou área tocada, identifique o doc primário:

| Área tocada | Doc primário | Secundários |
|-------------|--------------|-------------|
| Endpoints da API (novo/alterado) | `api/API.md` | `docs/ARCHITECTURE.md`, `docs/PROJETO.md` |
| Padrões de API (DTOs, auth, migrations) | `docs/ARCHITECTURE.md` | `api/API.md`, `docs/AGENTS.md` |
| Rotas/camadas do admin | `docs/ARCHITECTURE.md` | `admin/README.md`, `docs/AGENTS.md` |
| Rotas/App Router do frontend | `docs/ARCHITECTURE.md` | `frontend/README.md`, `docs/AGENTS.md` |
| Nginx / Docker / env | `docs/PROJETO.md` | `docs/ARCHITECTURE.md`, `docs/AGENTS.md` |
| CI/CD | `docs/CI.md` | `docs/PROJETO.md`, `README.md`, `docs/AGENTS.md` |
| Testes / política de testes | `docs/TESTING.md` | `docs/AGENTS.md`, `docs/ARCHITECTURE.md` |
| Convenções de commit/branch/PR | `docs/CONVENTIONS.md` | `docs/AGENTS.md`, `CLAUDE.md` |
| Skills novas ou alteradas | `docs/AGENTS.md` | `CLAUDE.md` |

### 2. Atualizar o doc primário

- Não reescreva o arquivo inteiro a menos que esteja obsoleto.
- Atualize apenas a seção relevante (tabela de endpoints, stack, comandos, padrões, links).
- Mantenha o tom e estrutura do arquivo existente.
- Use português.

### 3. Atualizar docs secundários, se necessário

- Se `api/API.md` ganhou um endpoint novo, `docs/ARCHITECTURE.md` pode precisar de uma linha na tabela de padrões.
- Se `nginx.conf` mudou, `docs/PROJETO.md` e `docs/ARCHITECTURE.md` devem refletir as rotas.
- Se uma skill nova foi criada, `docs/AGENTS.md` e `CLAUDE.md` devem listá-la.

### 4. Verificar links internos

- Garanta que links entre docs apontam para arquivos existentes.
- Use caminhos relativos (`./PROJETO.md`, `../api/API.md`).

### 5. Não atualizar

- Não toque em docs não relacionados ao diff.
- Não reescreva histórico de commits ou dados de data.
- Não crie doc novo sem justificativa.

## Saída esperada

Liste os arquivos de documentação atualizados e o que mudou em cada um:

```markdown
## Docs atualizadas

- `api/API.md` — adicionado endpoint POST /api/categorias
- `docs/ARCHITECTURE.md` — atualizada tabela de padrões da API
- `docs/AGENTS.md` — link para nova skill de revisão
```

## Integração com outras skills

- Rodar **antes** do `smart-commit` quando o diff incluir código + docs.
- `revisao-tecnica` e `pr-review` devem verificar se docs foram atualizadas quando aplicável.

## Anti-padrões

- Criar doc novo sem necessidade.
- Duplicar exemplos longos entre `ARCHITECTURE.md` e as rules.
- Esquecer de linkar uma skill nova em `AGENTS.md` / `CLAUDE.md`.
