---
name: novo-endpoint-api
description: Scaffold de novo endpoint na API: controller + DTOs + teste âncora + nota em api/API.md. Use quando o usuário pedir "cria endpoint", "novo endpoint da API", "scaffold de controller".
---

# Novo Endpoint API — MyPerson

Cria um novo endpoint seguindo os padrões do monorepo, com teste âncora e documentação atualizada.

## Quando usar

- "cria endpoint"
- "novo endpoint da API"
- "scaffold de controller"
- "adicionar recurso na API"

## Checklist

1. **Controller** em `api/Controllers/<Nome>Controller.cs`
   - `[ApiController]` e `[Route("api/[controller]")]`
   - Injetar `ApplicationDbContext` e `ILogger<T>`
   - `[Authorize]` em writes/listagens protegidas
   - `try/catch` com `_logger.LogError`

2. **DTOs** em `api/Models/DTOs/`
   - `Criar{Nome}Dto.cs` para entrada (POST)
   - `{Nome}ResponseDto.cs` para saída (GET)
   - Não exponha entidades EF

3. **Migrations** (se schema mudou)
   ```bash
   dotnet ef migrations add Adiciona{Nome} --project api/MyPerson.Api.csproj
   ```

4. **Teste âncora** em `api/MyPerson.Api.Tests/Controllers/<Nome>ControllerTests.cs`
   - Pelo menos 1 teste para o caminho feliz e 1 para erro
   - Mockar `DbContext` com InMemory ou usar controller que não depende de DbContext

5. **Documentação** em `api/API.md`
   - Adicionar endpoint na tabela de métodos
   - Exemplo de request/response

6. **Revisão**
   - Rodar `dotnet test api/MyPerson.sln`
   - Usar `revisao-tecnica` e `revisao-arquitetonica`

## Exemplo de saída

```markdown
Endpoint criado:
- `api/Controllers/PedidosController.cs`
- `api/Models/DTOs/CriarPedidoDto.cs`
- `api/Models/DTOs/PedidoResponseDto.cs`
- `api/MyPerson.Api.Tests/Controllers/PedidosControllerTests.cs`
- Atualizado `api/API.md`
```

## Anti-padrões

- Retornar entidade EF diretamente
- Esquecer `[Authorize]` em writes
- Criar endpoint sem teste ou sem atualizar API.md
