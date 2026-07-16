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
- `ponytail.mdc` - princípios de desenvolvimento eficiente (sempre aplica)

## Histórico de Commits Recente

| Hash | Tipo | Descrição |
|------|------|-----------|
| `c2a2427` | chore | adiciona regra de estilo ponytail |
| `658c07b` | refactor(admin) | remove páginas home, login e rotas legadas |
| `3ee2582` | refactor(admin) | atualiza rotas e simplifica app root |
| `5619387` | refactor(admin) | cria feature module de dashboard |
| `058bd70` | refactor(admin) | cria feature module de autenticação |


