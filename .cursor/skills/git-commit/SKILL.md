---
name: git-commit
description: Analisa o diff, executa revisões técnicas/arquitetônicas/de testes quando necessário e gera mensagens de commit em português seguindo Conventional Commits. Use quando o usuário pedir para fazer commit, commitar mudanças ou gerar mensagem de commit.
---

# Git Commit — Skill Canônica

Gere mensagens de commit analisando o diff real — nunca invente ou assuma mudanças que não estão nos arquivos staged.

Esta skill é a **canônica** para commits no projeto. A skill `smart-commit` foi consolidada aqui.

Siga as convenções do projeto em [docs/CONVENTIONS.md](../../../docs/CONVENTIONS.md): Conventional Commits, português, escopos do monorepo (`api`, `frontend`, `admin`, `docker`, `docs`, `ci`, `test`).

## Antes de sugerir o commit

Se o diff tocar lógica de negócio, autenticação, autorização, validação, controllers, serviços, guards, utils ou qualquer regra funcional, execute **antes** as skills de revisão na ordem:

1. `.cursor/skills/revisao-tecnica/` — build, lint, secrets, mistura de serviços.
2. `.cursor/skills/revisao-arquitetonica/` — padrões de camada, DTOs, `RestService`, rotas.
3. `.cursor/skills/revisao-testes-unitarios/` — cobertura e qualidade de testes.

Se o diff for apenas documentação, copy, configuração sem lógica condicional ou CSS puro, a revisão de testes pode ser omitida, mas `revisao-tecnica` ainda deve ser acionada para garantir que não há secrets ou diff bagunçado.

## Workflow

### Passo 1 — Coletar contexto

Execute em paralelo:

```bash
git status
git diff --cached
git diff
git log --oneline -5
```

Se nada estiver staged, avise o usuário e pare.

### Passo 2 — Analisar o diff

Para cada arquivo alterado, identifique:

- O que **realmente mudou** (adicionado, removido, modificado).
- A **intenção** por trás da mudança (nova feature, correção, refactor, config, docs, chore, teste).
- Se a mudança está **completa** ou parece work-in-progress.

Regras:
- Descreva apenas o que o diff mostra. Nunca invente contexto.
- Se uma mudança for ambígua, descreva-a factualmente ("adiciona campo X ao modelo Y") em vez de interpretar intenção.

### Passo 3 — Alinhar com o padrão do projeto

Leia os últimos 5 commits (`git log --oneline -5`) e detecte:

- Idioma (português).
- Uso de tipos (`feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `ci`).
- Uso de escopo (`feat(api):` vs `feat:`).
- Capitalização (minúsculas após o escopo).
- Uso de corpo/descrição.

Adapte a nova mensagem ao padrão observado.

### Passo 4 — Rascunhar a mensagem

Formato:

```
<tipo>[escopo opcional]: <resumo curto no infinitivo>

[corpo opcional — apenas se múltiplas mudanças lógicas precisarem de explicação]
```

Tipos:

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

Regras do resumo:
- Máximo 72 caracteres.
- Infinitivo ("adiciona", "corrige", "remove"), não passado.
- Sem ponto final.
- Minúsculas após o escopo.

Regras do corpo (quando necessário):
- Linha em branco entre resumo e corpo.
- Quebra em 72 caracteres.
- Explique **o quê** e **por quê**, não **como**.

### Passo 5 — Validar antes de commitar

Checklist:

- [ ] A mensagem descreve apenas mudanças presentes no diff.
- [ ] Não há mudanças inventadas ou assumidas.
- [ ] O tipo corresponde à natureza da mudança.
- [ ] O idioma é português, alinhado aos commits recentes.
- [ ] O resumo tem ≤ 72 caracteres, está no infinitivo e sem ponto final.
- [ ] Se houver mudanças não relacionadas staged, sugira separar em commits distintos.
- [ ] As skills de revisão foram executadas quando o diff tocou lógica.

### Passo 6 — Commit

Use HEREDOC para preservar formatação:

```bash
git commit -m "$(cat <<'EOF'
<tipo>: <resumo>

<corpo opcional>
EOF
)"
```

Depois execute `git status` para confirmar sucesso.

## Exemplos

**Mudança única:**
```
feat(api): adiciona endpoint de listagem de produtos
```

**Múltiplas mudanças relacionadas:**
```
feat(admin): adiciona listagem de produtos no painel

- Cria componente ProdutoList
- Adiciona ProdutoService com RestService
- Inclui testes unitários do componente
```

**Mudança de config/infra:**
```
chore(docker): ajusta healthcheck do serviço api
```

**Correção:**
```
fix(admin): corrige redirecionamento do authGuard
```

## Anti-padrões

- **Nunca** escreva "várias melhorias" ou "atualiza arquivos" — seja específico.
- **Nunca** descreva mudanças que não estão no diff.
- **Nunca** combine mudanças não relacionadas sem sinalizar ao usuário.
- **Nunca** pule a leitura do diff. O diff é a fonte da verdade.
- **Nunca** execute `git commit`, `git push` ou PR sem autorização explícita do usuário.
