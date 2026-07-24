---
name: debug-servicos
description: Sobe postgres/nginx + API/frontend/admin no Cloud Agent para debug ou teste manual. Use quando o usuário pedir "subir os serviços", "debug local", "testar no cloud agent", ou antes de testar mudanças em múltiplos serviços.
---

# Debug de Serviços — Cloud Agent

Sobe os serviços necessários no ambiente Cursor Cloud para testar o monorepo localmente. Docker não está disponível, então os serviços rodam nativamente.

## Quando usar

- "subir os serviços"
- "debug local"
- "testar no cloud agent"
- Antes de testar manualmente mudanças que tocam API + frontend/admin

## Pré-requisitos

- PostgreSQL 16 e nginx já instalados no ambiente (via snapshot)
- `.env` na raiz preenchido com valores de dev

## Passo a passo

### 1. Banco de dados

```bash
sudo service postgresql start
# role: myperson / senha: myperson123 / db: myperson
```

### 2. Nginx (reverse proxy)

```bash
sudo service nginx start
# config em /etc/nginx/conf.d/myperson.conf
```

### 3. API (porta 5000)

```bash
cd /workspace/api
ConnectionStrings__DefaultConnection="Host=127.0.0.1;Port=5432;Database=myperson;Username=myperson;Password=myperson123" ASPNETCORE_ENVIRONMENT=Development dotnet run
```

### 4. Frontend (porta 3000)

```bash
cd /workspace/frontend
npm run dev
```

### 5. Admin (porta 4200)

```bash
cd /workspace/admin
npx ng serve --host 0.0.0.0 --port 4200
```

## Verificação

Acesso via nginx:

- Frontend: http://localhost/
- API: http://localhost/api
- Swagger: http://localhost/api/swagger
- Admin: http://localhost/admin/

## Comandos úteis

```bash
# Ver status dos serviços do sistema
sudo service postgresql status
sudo service nginx status

# Logs
sudo tail -f /var/log/postgresql/postgresql-16-main.log
sudo tail -f /var/log/nginx/error.log

# Parar
sudo service postgresql stop
sudo service nginx stop
```

## Anti-padrões

- Não matar processos por nome (`pkill -f dotnet`). Use o PID específico se necessário.
- Não expor o PostgreSQL na rede externa.
