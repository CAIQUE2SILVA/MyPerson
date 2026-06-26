---
name: git-commit
description: Analisa mudanças no git, gera mensagens de commit descritivas seguindo Conventional Commits e executa commits. Use quando o usuário pedir para fazer commit, commitar mudanças, ou gerar mensagem de commit.
---

# Git Commit Helper

## Quando Usar

Use esta skill quando o usuário:
- Pedir para fazer commit
- Quiser gerar uma mensagem de commit
- Precisar analisar mudanças antes de commitar
- Solicitar ajuda com commits

## Fluxo de Trabalho

### 1. Verificar Status do Git

Primeiro, verifique o status do repositório:

```bash
git status
```

### 2. Analisar Mudanças

Analise as mudanças staged e unstaged:

```bash
# Mudanças staged
git diff --cached

# Todas as mudanças (staged + unstaged)
git diff
```

### 3. Gerar Mensagem de Commit

Com base nas mudanças analisadas, gere uma mensagem seguindo o padrão **Conventional Commits**:

**Formato:**
```
<tipo>(<escopo>): <descrição curta>

<corpo opcional>

<rodapé opcional>
```

**Tipos comuns:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças em documentação
- `style`: Formatação, ponto e vírgula faltando, etc (não afeta código)
- `refactor`: Refatoração de código
- `perf`: Melhoria de performance
- `test`: Adição ou correção de testes
- `chore`: Mudanças em build, dependências, etc
- `ci`: Mudanças em CI/CD

**Exemplos:**

```
feat(auth): adiciona autenticação JWT

Implementa endpoint de login e middleware de validação de tokens

fix(reports): corrige formatação de datas

Usa timestamps UTC consistentemente na geração de relatórios

refactor(client): reorganiza estrutura de pastas

Separa models, services e interfaces em módulos distintos
```

### 4. Validar Antes de Commitar

Antes de executar o commit, verifique:
- [ ] Há mudanças staged para commitar?
- [ ] A mensagem está clara e descritiva?
- [ ] O tipo de commit está correto?
- [ ] Não há arquivos sensíveis sendo commitados?

### 5. Executar Commit

Se o usuário pedir explicitamente para executar o commit:

```bash
git commit -m "mensagem gerada"
```

**Importante:** Sempre confirme com o usuário antes de executar o commit, a menos que ele tenha pedido explicitamente.

## Padrões de Mensagem

### Mensagens Simples (uma linha)
Para mudanças pequenas e diretas:
```
fix: corrige cálculo de desconto
```

### Mensagens com Corpo
Para mudanças mais complexas, adicione um corpo explicativo:
```
feat(client): implementa cache de requisições

Adiciona sistema de cache em memória para reduzir chamadas
redundantes à API. Cache expira após 5 minutos.
```

### Múltiplas Mudanças
Se houver múltiplas mudanças relacionadas, liste no corpo:
```
refactor: reorganiza estrutura de pastas

- Move models para Models/
- Move services para Services/
- Atualiza namespaces em todos os arquivos
```

## Análise de Mudanças

Ao analisar `git diff`, identifique:

1. **Tipo de mudança:**
   - Arquivos novos → `feat` ou `chore`
   - Correções → `fix`
   - Refatoração → `refactor`
   - Testes → `test`

2. **Escopo:**
   - Nome do módulo/componente afetado
   - Ex: `auth`, `client`, `api`, `ui`

3. **Descrição:**
   - Seja específico e conciso
   - Use verbo no infinitivo (adiciona, corrige, remove)
   - Máximo 72 caracteres na primeira linha

## Comandos Úteis

```bash
# Ver mudanças staged
git diff --cached

# Ver todas as mudanças
git diff

# Ver status resumido
git status -s

# Adicionar arquivos específicos
git add <arquivo>

# Adicionar todos os arquivos modificados
git add -u
```

## Exemplos de Uso

**Cenário 1: Commit simples**
```
Usuário: "Faz commit das mudanças"
→ Analisa git diff
→ Gera: "feat(client): adiciona método de busca"
→ Executa: git commit -m "..."
```

**Cenário 2: Apenas gerar mensagem**
```
Usuário: "Gera mensagem de commit para essas mudanças"
→ Analisa git diff
→ Gera mensagem
→ Não executa commit
```

**Cenário 3: Múltiplas mudanças**
```
Usuário: "Commit essas mudanças"
→ Analisa git diff
→ Identifica: 3 arquivos modificados, 1 novo
→ Gera: "feat: adiciona sistema de notificações e refatora client"
→ Executa commit
```
