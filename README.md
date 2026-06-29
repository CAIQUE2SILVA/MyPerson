# MyPerson

Aplicação web full-stack para gerenciamento, com API REST, frontend público e painel administrativo.

## Stack

| Serviço    | Tecnologia              | Rota (via Nginx)   |
|------------|-------------------------|--------------------|
| API        | ASP.NET Core 8 + EF Core | `/api/*`          |
| Frontend   | Next.js 16 + React 19   | `/`               |
| Admin      | Angular 21 + Material   | `/admin/`         |
| Banco      | PostgreSQL 16           | porta 5432        |
| Proxy      | Nginx                   | porta 80          |

## Pré-requisitos

- Docker
- Docker Compose

## Como usar

### 1. Variáveis de ambiente

```bash
cp env.example .env
```

Ajuste as variáveis conforme necessário (credenciais do PostgreSQL, JWT, etc.).

### 2. Subir os serviços

```bash
docker-compose up -d
```

Para rebuild após mudanças no código:

```bash
docker-compose up -d --build
```

### 3. Acessar

| Aplicação | URL |
|-----------|-----|
| Frontend  | http://localhost |
| Admin     | http://localhost/admin |
| API       | http://localhost/api |

### 4. Parar

```bash
docker-compose down
```

Para remover volumes (dados do banco):

```bash
docker-compose down -v
```

## Estrutura do projeto

```
MyPerson/
├── api/              # Backend ASP.NET Core
├── frontend/         # App Next.js (App Router)
├── admin/            # Painel Angular (login, dashboard)
├── nginx/            # Reverse proxy
├── docker-compose.yml
├── env.example
├── PROJETO.md        # Documentação detalhada da arquitetura
└── api/API.md        # Referência dos endpoints da API
```

## Painel Admin

O admin (`/admin/`) possui:

- **Login** com autenticação JWT contra a API
- **Guards** de rota (`authGuard` / `guestGuard`)
- **Dashboard** (home) com layout e toolbar
- Serviços em `admin/src/app/core/` (auth, HTTP, loading, notificações)

Desenvolvimento local do admin:

```bash
cd admin
npm install
npm start
```

Acesse em http://localhost:4200 (em produção/Docker, use http://localhost/admin).

## Desenvolvimento local (sem Docker)

| Serviço   | Comando              | Pasta      |
|-----------|----------------------|------------|
| API       | `dotnet run`         | `api/`     |
| Frontend  | `npm run dev`        | `frontend/`|
| Admin     | `npm start`          | `admin/`   |

A API é consumida em `http://localhost/api` (via Nginx) ou diretamente na porta configurada.

## Logs

```bash
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f admin
```

## Documentação

- [PROJETO.md](./PROJETO.md) — arquitetura, fluxo de requisições e deploy
- [api/API.md](./api/API.md) — endpoints da API
- [admin/README.md](./admin/README.md) — estrutura e convenções do painel Angular
