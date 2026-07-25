---
name: novo-page-admin
description: Scaffold de nova página no admin Angular seguindo as camadas core/shared/ui/pages, com teste mínimo. Use quando o usuário pedir "cria página no admin", "novo page admin", "scaffold de tela".
---

# Nova Page Admin — MyPerson

Cria uma nova tela no painel administrativo seguindo a arquitetura em camadas do admin.

## Quando usar

- "cria página no admin"
- "novo page admin"
- "scaffold de tela"
- "adicionar tela no painel"

## Checklist

1. **Model** em `admin/src/app/shared/models/<dominio>/`
   - Ex.: `pedido.model.ts`, `pedido-response.model.ts`

2. **Constantes de endpoint** em `admin/src/app/shared/constants/api.constants.ts`
   - Adicionar `PEDIDOS_ENDPOINT = '/api/pedidos'`

3. **Service** em `admin/src/app/core/api/<dominio>/`
   - Usar `RestService`
   - Não usar `HttpClient` direto
   - Tipar responses

4. **Page** em `admin/src/app/pages/<dominio>/<nome>/`
   - Componente standalone (`standalone: true`)
   - Lazy route em `admin/src/app/app.routes.ts`
   - Usar `loadComponent`

5. **Teste mínimo** em `admin/src/app/pages/<dominio>/<nome>/<nome>.spec.ts`
   - `TestBed` com imports standalone
   - Mock de `RestService` / service do domínio
   - Verificar criação do componente

6. **UI reutilizável** (se houver)
   - Componentes genéricos em `admin/src/app/ui/`
   - Componentes específicos da tela no mesmo folder ou `components/`

7. **Documentação**
   - Atualizar `admin/README.md` se a rota for pública/padrão
   - Usar `atualizar-docs` se necessário

## Exemplo de estrutura

```
admin/src/app/pages/pedidos/
├── pedido-list/
│   ├── pedido-list.ts
│   ├── pedido-list.html
│   ├── pedido-list.scss
│   └── pedido-list.spec.ts
└── pedido-form/
    ├── pedido-form.ts
    ├── pedido-form.html
    ├── pedido-form.scss
    └── pedido-form.spec.ts
```

## Anti-padrões

- Usar `HttpClient` direto em pages
- Hardcodear URL da API
- Colocar lógica de negócio em componentes `ui/`
- Criar página sem lazy route
- Esquecer teste mínimo
