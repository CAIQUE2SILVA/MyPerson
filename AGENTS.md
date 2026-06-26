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
