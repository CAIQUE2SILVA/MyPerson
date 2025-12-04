# MyPerson
Web site My Person

## Descrição do Projeto

Projeto full-stack utilizando Docker Compose com os seguintes serviços:
- **Nginx**: Reverse proxy roteando requisições
- **API**: Backend em ASP.NET Core (C#)
- **PostgreSQL**: Banco de dados
- **Frontend**: Aplicação React
- **Admin**: Painel administrativo em Angular

## Pré-requisitos

- Docker
- Docker Compose

## Como Usar

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `env.example` para `.env` e ajuste as variáveis conforme necessário:

```bash
cp env.example .env
```

### 2. Iniciar os Serviços

```bash
docker-compose up -d
```

### 3. Acessar as Aplicações

- **Frontend (React)**: http://localhost
- **Admin (Angular)**: http://localhost/admin
- **API**: http://localhost/api
- **PostgreSQL**: localhost:5432

### 4. Parar os Serviços

```bash
docker-compose down
```

Para remover também os volumes (dados do banco):

```bash
docker-compose down -v
```

## Estrutura do Projeto

```
MyPerson/
├── docker-compose.yml
├── api/              # API ASP.NET Core
├── frontend/         # Frontend React
├── admin/            # Admin Angular
├── nginx/            # Configuração do Nginx
└── env.example       # Exemplo de variáveis de ambiente
```

## Observações Importantes

- **Frontend**: React (porta 3000 internamente, exposta via Nginx)
- **Admin**: Angular (porta 4200 internamente, exposta via Nginx em /admin)
- Ambos são aplicações separadas servidas pelo Nginx
- A API está disponível em `/api/*` através do Nginx
