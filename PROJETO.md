# Documentação do Projeto MyPerson

## Visão Geral

O MyPerson é uma aplicação web full-stack desenvolvida com arquitetura de microserviços utilizando Docker Compose. O projeto é composto por múltiplos serviços que trabalham em conjunto para fornecer uma solução completa de gerenciamento.

## Arquitetura

### Serviços

#### 1. Nginx (Reverse Proxy)
- **Porta**: 80 (externa)
- **Função**: Atua como reverse proxy, roteando requisições para os serviços apropriados
- **Roteamento**:
  - `/api/*` → API ASP.NET Core
  - `/admin/*` → Painel Administrativo Angular
  - `/` → Frontend React

#### 2. API (Backend)
- **Tecnologia**: ASP.NET Core (C#)
- **Porta**: 5000 (interna)
- **Função**: Fornece endpoints RESTful para comunicação com o banco de dados
- **Banco de Dados**: PostgreSQL

#### 3. PostgreSQL (Banco de Dados)
- **Porta**: 5432
- **Função**: Armazena os dados da aplicação
- **Persistência**: Volume Docker para garantir persistência dos dados

#### 4. Frontend
- **Tecnologia**: React
- **Porta**: 3000 (interna), servida via Nginx na porta 80
- **Função**: Interface do usuário principal da aplicação

#### 5. Admin (Painel Administrativo)
- **Tecnologia**: Angular
- **Porta**: 4200 (interna), servida via Nginx em `/admin`
- **Função**: Interface administrativa para gerenciamento do sistema

## Fluxo de Requisições

1. **Requisição do Cliente** → Nginx (porta 80)
2. **Nginx analisa o caminho**:
   - Se `/api/*` → Encaminha para API (porta 5000)
   - Se `/admin/*` → Encaminha para Admin (porta 4200)
   - Se `/` → Encaminha para Frontend (porta 3000)
3. **API processa requisições** → Consulta/atualiza PostgreSQL
4. **Resposta** → Retorna através do Nginx para o cliente

## Tecnologias Utilizadas

### Backend
- **ASP.NET Core 8.0**: Framework para desenvolvimento da API
- **C#**: Linguagem de programação
- **PostgreSQL 16**: Sistema de gerenciamento de banco de dados relacional

### Frontend
- **React**: Biblioteca JavaScript para construção da interface do usuário
- **Angular**: Framework para construção do painel administrativo

### Infraestrutura
- **Docker**: Containerização dos serviços
- **Docker Compose**: Orquestração dos containers
- **Nginx**: Servidor web e reverse proxy

## Estrutura de Diretórios

```
MyPerson/
├── docker-compose.yml      # Configuração dos serviços
├── api/                    # Projeto ASP.NET Core
│   └── Dockerfile          # Imagem da API
├── frontend/               # Projeto React
│   └── Dockerfile          # Imagem do Frontend
├── admin/                  # Projeto Angular
│   └── Dockerfile          # Imagem do Admin
├── nginx/                  # Configuração do Nginx
│   └── nginx.conf          # Arquivo de configuração
├── env.example             # Exemplo de variáveis de ambiente
├── README.md               # Instruções de uso
└── PROJETO.md             # Esta documentação
```

## Variáveis de Ambiente

### PostgreSQL
- `POSTGRES_USER`: Usuário do banco de dados (padrão: myperson)
- `POSTGRES_PASSWORD`: Senha do banco de dados (padrão: myperson123)
- `POSTGRES_DB`: Nome do banco de dados (padrão: myperson)

### API
- `ASPNETCORE_ENVIRONMENT`: Ambiente de execução (Development/Production)
- `ASPNETCORE_URLS`: URL de escuta da API
- `ConnectionStrings__DefaultConnection`: String de conexão com o PostgreSQL

## Desenvolvimento

### Iniciando o Projeto

1. Clone o repositório
2. Copie `env.example` para `.env` e configure as variáveis
3. Execute `docker-compose up -d` para iniciar todos os serviços
4. Acesse http://localhost para o frontend
5. Acesse http://localhost/admin para o painel administrativo
6. Acesse http://localhost/api para testar a API

### Desenvolvimento Local

Para desenvolvimento local sem Docker:

- **API**: Execute `dotnet run` na pasta `api/`
- **Frontend**: Execute `npm start` na pasta `frontend/`
- **Admin**: Execute `ng serve` na pasta `admin/`
- **PostgreSQL**: Configure uma instância local ou use Docker apenas para o banco

### Build das Imagens

```bash
# Build de todos os serviços
docker-compose build

# Build de um serviço específico
docker-compose build api
docker-compose build frontend
docker-compose build admin
```

### Logs

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f admin
```

## Produção

### Considerações para Produção

1. **Segurança**:
   - Altere todas as senhas padrão
   - Configure HTTPS no Nginx
   - Use variáveis de ambiente seguras
   - Configure CORS adequadamente

2. **Performance**:
   - Configure cache no Nginx
   - Otimize as imagens Docker
   - Configure connection pooling no PostgreSQL

3. **Monitoramento**:
   - Configure health checks
   - Implemente logging centralizado
   - Configure alertas

### Deploy

1. Configure variáveis de ambiente de produção
2. Build das imagens: `docker-compose build`
3. Inicie os serviços: `docker-compose up -d`
4. Configure domínio e SSL no Nginx

## Troubleshooting

### Problemas Comuns

1. **Porta já em uso**: Verifique se as portas 80, 5000, 3000, 4200 ou 5432 estão disponíveis
2. **Erro de conexão com banco**: Verifique se o PostgreSQL está rodando e as credenciais estão corretas
3. **Build falha**: Verifique se todos os arquivos necessários estão presentes nos diretórios

### Comandos Úteis

```bash
# Reiniciar um serviço específico
docker-compose restart api

# Parar e remover containers
docker-compose down

# Parar, remover containers e volumes
docker-compose down -v

# Ver status dos serviços
docker-compose ps

# Executar comandos dentro de um container
docker-compose exec api bash
docker-compose exec postgres psql -U myperson -d myperson
```

## Contribuindo

1. Crie uma branch para sua feature
2. Faça suas alterações
3. Teste localmente com Docker Compose
4. Envie um pull request

## Licença

Ver arquivo LICENSE para mais informações.

