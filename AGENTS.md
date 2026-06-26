# Instruções para Agentes - MyPerson

## Visão Rápida

Monorepo full-stack com 3 serviços principais:
1. **API** (`api/`) - ASP.NET Core 8, EF Core, PostgreSQL
2. **Frontend** (`frontend/`) - Next.js 16, React 19, Tailwind 4
3. **Admin** (`admin/`) - Angular 21, Material, Tailwind 4

## Documentação

- **Arquitetura geral**: `PROJETO.md`
- **API endpoints**: `api/API.md`
- **Variáveis de ambiente**: `env.example`

## Convenções por Serviço

| Serviço | Padrões Principais |
|---------|-------------------|
| API | Controllers com `[ApiController]`, DTOs, Migrations EF |
| Frontend | App Router, Server Components por padrão, fetch em `localhost/api` |
| Admin | Standalone components, Angular Material, lazy loading |

## Comunicação entre Serviços

- Frontend → API: `fetch('http://localhost/api/...')`
- Admin → API: mesma base URL
- Tudo passa pelo Nginx (porta 80)

## Comandos Essenciais

```bash
# Iniciar tudo
docker-compose up -d

# Logs
docker-compose logs -f api
docker-compose logs -f frontend

# Rebuild
docker-compose up -d --build
```

## Regras do Projeto

As regras específicas estão em `.cursor/rules/`:
- `monorepo.mdc` - visão geral (sempre aplica)
- `api-dotnet.mdc` - quando edita arquivos `api/**/*.cs`
- `frontend-next.mdc` - quando edita `frontend/**/*.{ts,tsx}`
- `admin-angular.mdc` - quando edita `admin/**/*.{ts,html}`
- `docker-infra.mdc` - quando edita Docker/Nginx

## Cursor Cloud specific instructions

O ambiente do Cloud Agent roda os serviços **nativamente** (sem Docker), pois Docker não está disponível. Dependências (.NET 8 SDK, PostgreSQL 16, nginx, npm deps) já estão instaladas via snapshot/update script. PostgreSQL e nginx **não iniciam sozinhos** após um restart — inicie-os antes de testar.

### Iniciar os serviços (a partir de `/workspace`)
```bash
# Banco (uma vez por sessão)
sudo service postgresql start          # role: myperson / senha: myperson123 / db: myperson
sudo service nginx start               # reverse proxy em :80 (config em /etc/nginx/conf.d/myperson.conf -> upstreams 127.0.0.1)

# API (porta 5000). A connection string em appsettings.Development.json aponta para o host Docker "postgres";
# rode nativamente sobrescrevendo a connection string para 127.0.0.1:
cd api && ConnectionStrings__DefaultConnection="Host=127.0.0.1;Port=5432;Database=myperson;Username=myperson;Password=myperson123" ASPNETCORE_ENVIRONMENT=Development dotnet run

# Frontend (Next.js, porta 3000)
cd frontend && npm run dev

# Admin (Angular, porta 4200, base href /admin/)
cd admin && npx ng serve --host 0.0.0.0 --port 4200
```
Acesso via nginx: storefront em `http://localhost/`, API em `http://localhost/api`, Swagger em `http://localhost/api/swagger`, admin em `http://localhost/admin/`. O arquivo `.env` da raiz já está preenchido com valores de dev.

### Lint / Build / Test
- API: `dotnet build -c Release` em `api/`.
- Frontend: `npm run lint` e `npm run build` em `frontend/` (passam).
- Admin: `npm run build` / `ng serve` em `admin/` (ver problema conhecido abaixo).

### Problemas pré-existentes no código (não são do ambiente)
- **Migrations EF não aplicam**: as classes em `api/Data/Migrations/*.cs` não têm o atributo `[Migration]`, então `db.Database.Migrate()` no startup encontra "No migrations" e **não cria as tabelas** `Produtos`/`Clientes`. Neste ambiente o schema foi criado manualmente via SQL (igual às migrations) e persiste no volume do Postgres do snapshot. Se recriar o banco, recrie as tabelas manualmente ou corrija o atributo das migrations.
- **Admin não compila**: imports relativos quebrados (`app.ts` -> `./services/loading/...`, `auth.service.ts` -> `../../../services/rest/...`, `rest.service.ts` -> `../../../environments/enviroment`). O `npm install` e o `ng serve` funcionam, mas o build falha até esses caminhos serem corrigidos.
