# Documentação da API MyPerson

## Visão Geral

A API MyPerson é uma aplicação RESTful desenvolvida em ASP.NET Core 8.0 que fornece endpoints para gerenciamento de dados. A API está configurada para trabalhar com PostgreSQL através do Entity Framework Core e é acessível através do Nginx como reverse proxy.

## Informações Técnicas

- **Framework**: ASP.NET Core 8.0
- **Banco de Dados**: PostgreSQL 16
- **ORM**: Entity Framework Core
- **Documentação**: Swagger/OpenAPI
- **Porta Interna**: 5000
- **Porta Externa**: 80 (via Nginx)
- **Base URL**: `http://localhost/api`

## Estrutura do Projeto

```
api/
├── Controllers/          # Controladores da API
│   ├── HealthController.cs
│   └── WeatherForecastController.cs
├── Data/                 # Contexto do Entity Framework
│   └── ApplicationDbContext.cs
├── Properties/           # Configurações de launch
│   └── launchSettings.json
├── Program.cs            # Configuração principal da aplicação
├── appsettings.json      # Configurações da aplicação
├── appsettings.Development.json
├── MyPerson.Api.csproj   # Arquivo de projeto
└── Dockerfile            # Configuração Docker
```

## Configuração

### Variáveis de Ambiente

A API utiliza as seguintes variáveis de ambiente (configuradas no `docker-compose.yml`):

- `ASPNETCORE_ENVIRONMENT`: Ambiente de execução (Development/Production)
- `ASPNETCORE_URLS`: URL de escuta da API (padrão: `http://+:5000`)
- `ConnectionStrings__DefaultConnection`: String de conexão com PostgreSQL

### Connection String

Formato padrão da connection string:
```
Host=postgres;Port=5432;Database=myperson;Username=myperson;Password=myperson123
```

### CORS

A API está configurada para aceitar requisições de qualquer origem (`AllowAll`), permitindo:
- Qualquer origem (`AllowAnyOrigin`)
- Qualquer método HTTP (`AllowAnyMethod`)
- Qualquer header (`AllowAnyHeader`)

## Rotas e Endpoints

Todas as rotas da API utilizam o prefixo base `/api/`.

### 1. Health Check

Verifica o status da API.

**Endpoint**: `GET /api/health`

**Descrição**: Retorna informações sobre o status de saúde da API.

**Resposta de Sucesso** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "MyPerson.Api"
}
```

**Exemplo de Requisição**:
```bash
curl -X GET http://localhost/api/health
```

**Exemplo de Resposta**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T14:30:00.0000000Z",
  "service": "MyPerson.Api"
}
```

---

### 2. Weather Forecast

Retorna uma previsão do tempo de exemplo.

**Endpoint**: `GET /api/weatherforecast`

**Descrição**: Retorna uma lista de 5 previsões meteorológicas de exemplo (dados fictícios).

**Resposta de Sucesso** (200 OK):
```json
[
  {
    "date": "2024-01-16",
    "temperatureC": 25,
    "temperatureF": 77,
    "summary": "Warm"
  },
  {
    "date": "2024-01-17",
    "temperatureC": 30,
    "temperatureF": 86,
    "summary": "Hot"
  },
  ...
]
```

**Modelo de Dados**:
```typescript
interface WeatherForecast {
  date: string;           // Data no formato YYYY-MM-DD
  temperatureC: number;    // Temperatura em Celsius
  temperatureF: number;   // Temperatura em Fahrenheit (calculada)
  summary: string;        // Descrição do clima
}
```

**Possíveis Valores de Summary**:
- "Freezing"
- "Bracing"
- "Chilly"
- "Cool"
- "Mild"
- "Warm"
- "Balmy"
- "Hot"
- "Sweltering"
- "Scorching"

**Exemplo de Requisição**:
```bash
curl -X GET http://localhost/api/weatherforecast
```

**Exemplo de Resposta**:
```json
[
  {
    "date": "2024-01-16",
    "temperatureC": 25,
    "temperatureF": 77,
    "summary": "Warm"
  },
  {
    "date": "2024-01-17",
    "temperatureC": 30,
    "temperatureF": 86,
    "summary": "Hot"
  },
  {
    "date": "2024-01-18",
    "temperatureC": 15,
    "temperatureF": 59,
    "summary": "Mild"
  },
  {
    "date": "2024-01-19",
    "temperatureC": 5,
    "temperatureF": 41,
    "summary": "Chilly"
  },
  {
    "date": "2024-01-20",
    "temperatureC": 35,
    "temperatureF": 95,
    "summary": "Scorching"
  }
]
```

---

### 3. Swagger UI

Interface interativa para testar e explorar a API.

**Endpoint**: `GET /api/swagger`

**Descrição**: Interface Swagger UI para documentação interativa e testes da API.

**Acesso**: Disponível apenas em ambiente de desenvolvimento.

**URL**: `http://localhost/api/swagger`

**Recursos**:
- Visualização de todos os endpoints
- Teste interativo de requisições
- Documentação automática dos modelos
- Validação de requisições e respostas

---

## Códigos de Status HTTP

A API utiliza os seguintes códigos de status:

- `200 OK`: Requisição bem-sucedida
- `400 Bad Request`: Requisição inválida
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro interno do servidor

## Headers de Requisição

### Headers Aceitos

A API aceita os seguintes headers (devido à configuração CORS):

- `Content-Type`: Tipo de conteúdo (ex: `application/json`)
- `Authorization`: Token de autenticação (quando implementado)
- `Accept`: Tipo de resposta aceita

### Headers de Resposta

A API retorna os seguintes headers:

- `Content-Type`: `application/json`
- `Access-Control-Allow-Origin`: `*`
- `Access-Control-Allow-Methods`: `GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers`: Headers permitidos

## Banco de Dados

### Entity Framework Core

A API utiliza Entity Framework Core com PostgreSQL. O contexto está definido em `ApplicationDbContext`.

**Contexto**: `MyPerson.Api.Data.ApplicationDbContext`

**Configuração**: O DbContext está configurado no `Program.cs` e utiliza a connection string das variáveis de ambiente.

### Migrations

Para criar e aplicar migrations (quando necessário):

```bash
# Criar uma nova migration
dotnet ef migrations add NomeDaMigration --project api/MyPerson.Api.csproj

# Aplicar migrations
dotnet ef database update --project api/MyPerson.Api.csproj
```

## Exemplos de Uso

### Usando cURL

```bash
# Health Check
curl -X GET http://localhost/api/health

# Weather Forecast
curl -X GET http://localhost/api/weatherforecast
```

### Usando JavaScript (Fetch)

```javascript
// Health Check
fetch('http://localhost/api/health')
  .then(response => response.json())
  .then(data => console.log(data));

// Weather Forecast
fetch('http://localhost/api/weatherforecast')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Usando Python (requests)

```python
import requests

# Health Check
response = requests.get('http://localhost/api/health')
print(response.json())

# Weather Forecast
response = requests.get('http://localhost/api/weatherforecast')
print(response.json())
```

### Usando Postman

1. Importe a collection do Swagger: `http://localhost/api/swagger/v1/swagger.json`
2. Ou crie requisições manualmente:
   - GET `http://localhost/api/health`
   - GET `http://localhost/api/weatherforecast`

## Desenvolvimento

### Executando Localmente

```bash
# Navegar para a pasta da API
cd api

# Restaurar dependências
dotnet restore

# Executar a aplicação
dotnet run
```

A API estará disponível em `http://localhost:5000` (localmente) ou `http://localhost/api` (via Docker).

### Build Docker

```bash
# Build da imagem
docker build -t myperson-api ./api

# Executar container
docker run -p 5000:5000 myperson-api
```

### Via Docker Compose

```bash
# Iniciar todos os serviços
docker-compose up --build

# Iniciar apenas a API
docker-compose up api

# Ver logs
docker-compose logs -f api
```

## Logs

Os logs da API podem ser visualizados através do Docker Compose:

```bash
# Logs em tempo real
docker-compose logs -f api

# Últimas 100 linhas
docker-compose logs --tail=100 api
```

## Troubleshooting

### Problema: API retorna 404

**Solução**: Verifique se:
- A API está rodando (`docker-compose ps`)
- O Nginx está configurado corretamente
- A rota está usando o prefixo `/api/`

### Problema: Erro de conexão com banco de dados

**Solução**: Verifique se:
- O PostgreSQL está rodando
- As credenciais estão corretas no `docker-compose.yml`
- A connection string está configurada corretamente

### Problema: Swagger não carrega

**Solução**: 
- Verifique se está em ambiente Development
- Acesse `http://localhost/api/swagger` (não `/swagger`)
- Verifique os logs da API

## Próximos Passos

### Funcionalidades Planejadas

- [ ] Autenticação e autorização (JWT)
- [ ] CRUD completo de entidades
- [ ] Validação de dados
- [ ] Paginação de resultados
- [ ] Filtros e busca
- [ ] Upload de arquivos
- [ ] Logging estruturado
- [ ] Rate limiting

## Suporte

Para questões ou problemas, consulte:
- Documentação do Swagger: `http://localhost/api/swagger`
- Logs da aplicação: `docker-compose logs api`
- Documentação do projeto: `PROJETO.md`

## Changelog

### v1.0.0 (2024-01-15)
- Implementação inicial da API
- Endpoints de Health Check e Weather Forecast
- Integração com PostgreSQL
- Configuração de CORS
- Swagger UI configurado
- Docker e Docker Compose configurados

