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

`POST /api/auth/login` e `POST /api/clientes/registro` aceitam 5 requisições por minuto por IP. Além disso, 5 senhas erradas no admin (`POST /api/auth/login`) ou no cliente (`POST /api/clientes/entrar`) bloqueiam aquela conta por 15 minutos, mesmo a partir de outro IP. A resposta é **429** com `{ "message": "Muitas tentativas. Tente novamente em instantes.", "retryAfterSeconds": 900 }`. Atrás do Nginx, a API usa `X-Forwarded-For` para separar os clientes.

---

## Endpoints

> A vitrine pública (`GET /api/produtos/vitrine`) devolve só produtos ativos, sem estoque. `GET /api/produtos` e `GET /api/produtos/{id}` exigem JWT e são o contrato do admin. `GET /api/categorias` continua público: a resposta traz apenas nome e slug.

### Health Check

**Endpoint**: `GET /api/health`

Verifica o status da API e conexão com o banco de dados.

**Resposta** (200 OK): `Healthy`

---

### Produtos

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/api/produtos/vitrine` | Não | Lista produtos ativos para a loja |
| GET | `/api/produtos/vitrine/{id}` | Não | Detalhe público de produto ativo |
| GET | `/api/produtos` | Sim | Lista todos os produtos (admin) |
| GET | `/api/produtos/{id}` | Sim | Busca produto por ID (admin) |
| POST | `/api/produtos` | Sim | Cria novo produto |
| PUT | `/api/produtos/{id}` | Sim | Atualiza produto |
| DELETE | `/api/produtos/{id}` | Sim | Remove produto |

**Vitrine** — `GET /api/produtos/vitrine`

```json
[
  {
    "id": 1,
    "nome": "Camiseta Básica",
    "descricao": "Camiseta 100% algodão",
    "preco": 49.90,
    "categoriaId": 1,
    "categoriaNome": "Roupas",
    "categoriaSlug": "roupas",
    "imagemUrl": "https://exemplo.com/img.jpg"
  }
]
```

Produto inativo ou inexistente em `GET /api/produtos/vitrine/{id}` responde 404.

**Criar Produto** — `POST /api/produtos`
```json
{
  "nome": "Camiseta Básica",
  "descricao": "Camiseta 100% algodão",
  "preco": 49.90,
  "estoque": 100,
  "categoriaId": 1,
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
  "categoriaId": 1,
  "categoriaNome": "Roupas",
  "imagemUrl": "https://exemplo.com/img.jpg",
  "ativo": true,
  "dataCriacao": "2026-06-25T12:00:00Z",
  "dataAtualizacao": null
}
```

---

### Categorias

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/api/categorias` | Não | Lista todas as categorias |
| GET | `/api/categorias/{id}` | Não | Busca categoria por ID |
| POST | `/api/categorias` | Sim | Cria nova categoria |
| PUT | `/api/categorias/{id}` | Sim | Atualiza categoria |
| DELETE | `/api/categorias/{id}` | Sim | Remove categoria |

**Criar Categoria** — `POST /api/categorias`
```json
{
  "nome": "Roupas",
  "slug": "roupas"
}
```

**Resposta Categoria**:
```json
{
  "id": 1,
  "nome": "Roupas",
  "slug": "roupas"
}
```

---

### Clientes

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/api/clientes` | Sim | Lista todos os clientes |
| GET | `/api/clientes/{id}` | Sim | Busca cliente por ID |
| POST | `/api/clientes/registro` | Não | Registra novo cliente |
| POST | `/api/clientes/entrar` | Não | Entra com e-mail e senha. Não devolve token de admin |
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

# Vitrine pública
curl http://localhost/api/produtos/vitrine

# Listar produtos (admin)
curl http://localhost/api/produtos \
  -H "Authorization: Bearer {token}"

# Registrar cliente
curl -X POST http://localhost/api/clientes/registro \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com","senha":"senha123"}'

# Listar clientes (autenticado)
curl http://localhost/api/clientes \
  -H "Authorization: Bearer {token}"
```
