# Documentação da API MyPerson

## Visão Geral

A API MyPerson é uma aplicação RESTful desenvolvida em ASP.NET Core 8.0 que fornece endpoints para gerenciamento de produtos e clientes. A API utiliza PostgreSQL via Entity Framework Core, autenticação JWT e é acessível através do Nginx como reverse proxy.

## Informações Técnicas

- **Framework**: ASP.NET Core 8.0
- **Banco de Dados**: PostgreSQL 16
- **ORM**: Entity Framework Core
- **Autenticação**: JWT Bearer
- **Documentação**: Swagger/OpenAPI (ambiente Development)
- **Porta Interna**: 5000
- **Base URL**: `http://localhost/api`

## Padrão de Projeto

Todos os controllers seguem o mesmo padrão:

- `[ApiController]` com rota `api/[controller]`
- DTOs de entrada e saída
- Acesso direto ao `ApplicationDbContext`
- `try/catch` com `ILogger`
- `[Authorize]` nas operações de escrita e listagem protegida

## Autenticação

### Login Admin

**Endpoint**: `POST /api/auth/login`

**Body**:
```json
{
  "username": "admin",
  "password": "sua_senha_admin"
}
```

**Resposta** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiration": "2026-06-25T23:00:00Z"
}
```

Use o token nas requisições protegidas:
```
Authorization: Bearer {token}
```

---

## Endpoints

### Health Check

**Endpoint**: `GET /api/health`

Verifica o status da API e conexão com o banco de dados.

**Resposta** (200 OK): `Healthy`

---

### Produtos

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/api/produtos` | Não | Lista todos os produtos |
| GET | `/api/produtos/{id}` | Não | Busca produto por ID |
| POST | `/api/produtos` | Sim | Cria novo produto |
| PUT | `/api/produtos/{id}` | Sim | Atualiza produto |
| DELETE | `/api/produtos/{id}` | Sim | Remove produto |

**Criar Produto** — `POST /api/produtos`
```json
{
  "nome": "Camiseta Básica",
  "descricao": "Camiseta 100% algodão",
  "preco": 49.90,
  "estoque": 100,
  "categoria": "Roupas",
  "imagemUrl": "https://exemplo.com/img.jpg",
  "ativo": true
}
```

**Resposta Produto**:
```json
{
  "id": 1,
  "nome": "Camiseta Básica",
  "descricao": "Camiseta 100% algodão",
  "preco": 49.90,
  "estoque": 100,
  "categoria": "Roupas",
  "imagemUrl": "https://exemplo.com/img.jpg",
  "ativo": true,
  "dataCriacao": "2026-06-25T12:00:00Z",
  "dataAtualizacao": null
}
```

---

### Clientes

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/api/clientes` | Sim | Lista todos os clientes |
| GET | `/api/clientes/{id}` | Sim | Busca cliente por ID |
| POST | `/api/clientes/registro` | Não | Registra novo cliente |
| PUT | `/api/clientes/{id}` | Sim | Atualiza cliente |
| DELETE | `/api/clientes/{id}` | Sim | Remove cliente |

**Registrar Cliente** — `POST /api/clientes/registro`
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "minhasenha123",
  "telefone": "11999999999"
}
```

**Resposta Cliente**:
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "11999999999",
  "ativo": true,
  "dataCriacao": "2026-06-25T12:00:00Z",
  "dataAtualizacao": null
}
```

---

### Swagger UI

Disponível apenas em ambiente Development:

**URL**: `http://localhost/api/swagger`

---

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Requisição bem-sucedida |
| 201 | Recurso criado |
| 204 | Atualização/remoção bem-sucedida (sem conteúdo) |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 404 | Recurso não encontrado |
| 409 | Conflito (ex: e-mail duplicado) |
| 500 | Erro interno do servidor |

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `POSTGRES_USER` | Usuário do banco |
| `POSTGRES_PASSWORD` | Senha do banco |
| `POSTGRES_DB` | Nome do banco |
| `JWT_KEY` | Chave secreta JWT (mín. 32 chars) |
| `JWT_ISSUER` | Emissor do token |
| `JWT_AUDIENCE` | Audiência do token |
| `AUTH_ADMIN_USER` | Usuário admin |
| `AUTH_ADMIN_PASSWORD` | Senha admin |

## Migrations

As migrations são aplicadas automaticamente no startup da API. Para criar novas migrations manualmente:

```bash
dotnet ef migrations add NomeDaMigration --project api/MyPerson.Api.csproj
dotnet ef database update --project api/MyPerson.Api.csproj
```

## Exemplos com cURL

```bash
# Health Check
curl http://localhost/api/health

# Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"sua_senha"}'

# Listar produtos
curl http://localhost/api/produtos

# Registrar cliente
curl -X POST http://localhost/api/clientes/registro \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com","senha":"senha123"}'

# Listar clientes (autenticado)
curl http://localhost/api/clientes \
  -H "Authorization: Bearer {token}"
```
