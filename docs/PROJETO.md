# Documentação do Projeto MyPerson

## Visão Geral

O MyPerson é uma aplicação web full-stack com três serviços independentes orquestrados por Docker Compose. A comunicação entre frontend/admin e a API é sempre via HTTP, roteada pelo Nginx.

## Arquitetura

### Serviços

| Serviço | Tecnologia | Porta interna | Rota Nginx |
|---------|------------|---------------|------------|
| API | ASP.NET Core 8.0 | 5000 | `/api/*` |
| Frontend | Next.js 16 + React 19 | 3000 | `/` |
| Admin | Angular 21 + Material/CDK | 4200 | `/admin/*` |
| Nginx | Reverse proxy | 80 | — |
| PostgreSQL | Banco de dados | 5432 | — |

### Fluxo de Requisições

1. Cliente → Nginx (`:80`)
2. Nginx encaminha conforme o caminho:
   - `/api/*` → API (`:5000`)
   - `/admin/*` → Admin (`:4200`)
   - `/` → Frontend (`:3000`)
3. API consulta/atualiza o PostgreSQL
4. Resposta retorna pelo Nginx para o cliente

## Estrutura de Diretórios

```
MyPerson/
├── api/                    # Backend ASP.NET Core 8
├── frontend/               # Next.js 16 (App Router)
├── admin/                  # Angular 21 (standalone components)
├── nginx/                  # Configuração do reverse proxy
├── .cursor/                # Rules e skills do Cursor
│   ├── rules/
│   └── skills/
├── docs/                   # Documentação do projeto
│   ├── PROJETO.md          # Esta documentação
│   ├── AGENTS.md           # Instruções para agentes
│   ├── PLANO-AUTOMACAO.md  # Plano de automação (docs, skills, testes, CI/CD)
│   ├── ARCHITECTURE.md     # Padrões arquitetônicos (a criar — item 5 do plano)
│   ├── TESTING.md          # Política de testes (a criar — item 6 do plano)
│   ├── CONVENTIONS.md      # Convenções de commits/branches (a criar — item 7)
│   └── CI.md               # Documentação do CI (a criar — item 8/18)
├── docker-compose.yml      # Desenvolvimento
├── docker-compose.prod.yml # Produção
├── env.example             # Variáveis de ambiente
└── README.md               # Instruções de uso rápido
```

## Tecnologias Utilizadas

- **Backend**: ASP.NET Core 8, C#, EF Core, PostgreSQL 16, JWT Auth
- **Frontend**: Next.js 16, React 19, TypeScript 5.9, Tailwind 4
- **Admin**: Angular 21, Material/CDK, Tailwind 4, SSR com Express
- **Infraestrutura**: Docker, Docker Compose, Nginx

## Variáveis de Ambiente

Copie `env.example` para `.env` na raiz e ajuste conforme o ambiente:

| Variável | Descrição | Padrão de dev |
|----------|-----------|---------------|
| `POSTGRES_USER` | Usuário do PostgreSQL | `myperson` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | `myperson123` |
| `POSTGRES_DB` | Nome do banco | `myperson` |
| `JWT_KEY` | Chave secreta JWT (mín. 32 caracteres) | — |
| `JWT_ISSUER` | Emissor do token | `MyPerson` |
| `JWT_AUDIENCE` | Audiência do token | `MyPersonUsers` |
| `AUTH_ADMIN_USER` | Usuário admin | `admin` |
| `AUTH_ADMIN_PASSWORD` | Senha admin | — |

## Como Executar

### Docker Compose (recomendado)

```bash
# Iniciar todos os serviços
docker-compose up -d

# Rebuild após mudanças
docker-compose up -d --build

# Parar
docker-compose down
```

### Desenvolvimento Local (sem Docker)

Veja os comandos específicos de cada serviço em `docs/AGENTS.md` (seção **Cursor Cloud specific instructions**).

Resumo:
- **API**: `dotnet run` em `api/`
- **Frontend**: `npm run dev` em `frontend/`
- **Admin**: `npm start` em `admin/`
- **PostgreSQL**: instância local na porta 5432
- **Nginx**: proxy local apontando para as portas dos serviços

## Acesso

| Aplicação | URL (Docker/Nginx) |
|-----------|--------------------|
| Frontend | http://localhost |
| Admin | http://localhost/admin |
| API | http://localhost/api |
| Swagger | http://localhost/api/swagger (apenas Development) |

## Comandos Úteis

```bash
# Logs
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f admin

# Reiniciar um serviço específico
docker-compose restart api

# Parar e remover volumes
docker-compose down -v
```

## Produção

Use `docker-compose.prod.yml`:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Considerações:
- Altere todas as senhas padrão
- Configure HTTPS no Nginx
- Use variáveis de ambiente seguras (nunca commitar `.env`)
- Configure CORS adequadamente

### Deploy via GitHub Actions

O workflow `.github/workflows/deploy.yml` builda as imagens de produção. Para push/deploy automático, configure os secrets no GitHub e descomente os passos no workflow. Veja mais em [docs/CI.md](./CI.md).

## Pendências Conhecidas

| # | Pendência | Onde impacta | Status |
|---|-----------|--------------|--------|
| 1 | Integração do frontend com a API — o frontend ainda exibe dados mockados em algumas seções | `frontend/src/app/components/sections/FeaturedProducts.tsx` | Pendente de implementação |
| 2 | Proteção dos endpoints `GET /api/produtos` e `GET /api/categorias` — atualmente públicos e podem expor campos sensíveis | `api/Controllers/ProdutosController.cs`, `api/Controllers/CategoriasController.cs` | Pendente de decisão/correção |
| 3 | Mecanismos de autoatendimento LGPD para clientes (acesso, correção, exclusão) | `api/Controllers/ClientesController.cs` | Pendente de definição |

## Documentação Relacionada

- [api/API.md](../api/API.md) — endpoints da API
- [docs/AGENTS.md](./AGENTS.md) — instruções para agentes
- [docs/PLANO-AUTOMACAO.md](./PLANO-AUTOMACAO.md) — plano de automação
- [docs/ARCHITECTURE.md](./ARCHITECTURE.md) — padrões arquitetônicos (futuro)
- [docs/TESTING.md](./TESTING.md) — política de testes (futuro)

## Licença

Ver arquivo [LICENSE](../LICENSE) para mais informações.
