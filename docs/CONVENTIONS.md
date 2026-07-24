# Convenções de Commits, Branches e PRs — MyPerson

Todas as mensagens, descrições de PR e documentação do projeto são em **português**.

## Commits — Conventional Commits

Formato:

```
<tipo>(<escopo>): <descrição curta>

<corpo opcional>

<rodapé opcional>
```

### Tipos

| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Mudanças em documentação |
| `style` | Formatação, estilo, sem mudança de comportamento |
| `refactor` | Refatoração de código |
| `perf` | Melhoria de performance |
| `test` | Adição ou correção de testes |
| `chore` | Build, dependências, tooling |
| `ci` | Mudanças em CI/CD |

### Escopos

| Escopo | Uso |
|--------|-----|
| `api` | Backend ASP.NET Core |
| `frontend` | Next.js / React |
| `admin` | Angular |
| `docker` | Docker, Compose, Nginx |
| `docs` | Documentação geral |
| `ci` | GitHub Actions, pipelines |
| `test` | Infraestrutura ou política de testes |

### Exemplos

```
feat(api): adiciona endpoint de listagem de produtos

fix(admin): corrige redirecionamento do authGuard

docs: atualiza PROJETO.md para stack real

test(api): adiciona testes para AuthController
```

### Regras de mensagem

- Descrição curta no infinitivo ("adiciona", "corrige", "remove"), não no passado
- Máximo 72 caracteres na primeira linha
- Sem ponto final na primeira linha
- Escopo opcional, mas recomendado quando o serviço afetado é claro

## Branches

### Padrão geral

```
<tipo>/<descricao-curta>
```

Tipos de branch: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

Exemplos:

```
feat/auth-jwt
fix/cors-localhost
docs/plano-automacao
```

### Branches do Cloud Agent

No ambiente Cursor Cloud, use o prefixo e sufixo obrigatórios:

```
cursor/<descricao>-a1ef
```

Exemplos:

```
cursor/plano-automacao-docs-a1ef
cursor/infra-testes-api-a1ef
```

## Pull Requests

### Título

Siga o mesmo padrão de commits:

```
feat(api): adiciona endpoint de produtos
```

### Descrição mínima

A descrição deve conter:

- O que foi feito (1-2 frases)
- Como testar (comando ou passos)
- Serviços tocados

### Checklist local

Antes de abrir o PR, rode localmente nos serviços tocados:

- [ ] `dotnet build -c Release` (API)
- [ ] `npm run lint` (Frontend)
- [ ] `npm run build` (Frontend / Admin)
- [ ] `npm test` (Admin / Frontend, quando houver suite)
- [ ] `dotnet test` (API, quando houver suite)
- [ ] Revisão de testes unitários com `.cursor/skills/revisao-testes-unitarios/` (se mudou lógica)

## Documentação relacionada

- [docs/PLANO-AUTOMACAO.md](./PLANO-AUTOMACAO.md) — plano de automação
- [docs/TESTING.md](./TESTING.md) — política de testes
- [docs/ARCHITECTURE.md](./ARCHITECTURE.md) — padrões arquitetônicos
- [docs/AGENTS.md](./AGENTS.md) — instruções para agentes
- `.cursor/skills/smart-commit/` — skill de mensagens de commit
