# Frontend - MyPerson

## Visão Geral

O frontend do MyPerson é uma aplicação React desenvolvida com **Vite** e **TypeScript**, oferecendo uma experiência de desenvolvimento rápida e moderna. A aplicação é servida através do Nginx em produção e se integra com a API ASP.NET Core através do reverse proxy.

## Tecnologias

- **React 18.3**: Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript 5.5**: Superset do JavaScript com tipagem estática
- **Vite 5.4**: Build tool moderna e rápida para desenvolvimento frontend
- **Nginx**: Servidor web para servir arquivos estáticos em produção

## Estrutura do Projeto

```
frontend/
├── Dockerfile              # Configuração multi-stage para build e produção
├── package.json            # Dependências e scripts do projeto
├── vite.config.ts          # Configuração do Vite
├── tsconfig.json           # Configuração TypeScript para o código fonte
├── tsconfig.node.json      # Configuração TypeScript para arquivos Node
├── index.html              # HTML principal da aplicação
├── .dockerignore           # Arquivos ignorados no build Docker
├── .gitignore              # Arquivos ignorados pelo Git
└── src/
    ├── main.tsx            # Ponto de entrada da aplicação React
    ├── App.tsx             # Componente principal
    ├── App.css             # Estilos do componente principal
    └── vite-env.d.ts       # Definições de tipos do Vite
```

## Scripts Disponíveis

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# O servidor estará disponível em http://localhost:3000
```

### Build e Produção

```bash
# Build da aplicação para produção
npm run build

# Preview do build de produção localmente
npm run preview
```

### Linting

```bash
# Executar linter
npm run lint
```

## Configuração do Vite

O arquivo `vite.config.ts` contém as seguintes configurações:

- **Porta**: 3000 (desenvolvimento)
- **Host**: 0.0.0.0 (para aceitar conexões de qualquer IP)
- **Proxy**: Configurado para redirecionar requisições `/api` para `http://api:5000`

### Proxy da API

Durante o desenvolvimento, o Vite automaticamente redireciona requisições para `/api/*` para o backend:

```typescript
proxy: {
  '/api': {
    target: 'http://api:5000',
    changeOrigin: true,
    secure: false,
  },
}
```

## Docker

### Build da Imagem

O Dockerfile utiliza uma estratégia multi-stage:

1. **Stage 1 (build)**: 
   - Base: `node:20-alpine`
   - Instala dependências
   - Compila a aplicação React
   - Gera arquivos estáticos em `dist/`

2. **Stage 2 (production)**:
   - Base: `nginx:alpine`
   - Copia arquivos buildados do stage anterior
   - Serve arquivos estáticos na porta 80

### Executando com Docker Compose

O frontend está integrado ao `docker-compose.yml` do projeto:

```bash
# Build e iniciar todos os serviços
docker-compose up -d --build

# Build apenas do frontend
docker-compose build frontend

# Ver logs do frontend
docker-compose logs -f frontend

# Reiniciar o frontend
docker-compose restart frontend
```

## Integração com Nginx

O frontend é servido através do Nginx reverse proxy:

- **Rota principal**: `http://localhost/` → Frontend React
- **API**: `http://localhost/api/*` → API ASP.NET Core
- **Admin**: `http://localhost/admin/*` → Painel Administrativo Angular

### Configuração do Nginx

O Nginx está configurado para:
- Servir o frontend na rota raiz (`/`)
- Fazer proxy reverso para a API em `/api/*`
- Fazer proxy reverso para o Admin em `/admin/*`

## Desenvolvimento

### Adicionando Novos Componentes

1. Crie seus componentes na pasta `src/components/`
2. Importe e use no `App.tsx` ou em outros componentes

Exemplo:

```typescript
// src/components/MyComponent.tsx
import { FC } from 'react';

const MyComponent: FC = () => {
  return <div>Meu Componente</div>;
};

export default MyComponent;
```

### Estrutura de Pastas Recomendada

```
src/
├── components/          # Componentes reutilizáveis
├── pages/               # Páginas/rotas da aplicação
├── hooks/               # Custom hooks
├── services/            # Serviços de API
├── utils/               # Funções utilitárias
├── types/               # Definições de tipos TypeScript
├── styles/              # Estilos globais
└── assets/              # Imagens, ícones, etc.
```

### Fazendo Requisições à API

Exemplo de como fazer requisições à API:

```typescript
// src/services/api.ts
const API_BASE_URL = '/api';

export const fetchData = async () => {
  const response = await fetch(`${API_BASE_URL}/endpoint`);
  const data = await response.json();
  return data;
};
```

## Variáveis de Ambiente

Para desenvolvimento local, você pode criar um arquivo `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Acesse as variáveis no código usando `import.meta.env.VITE_API_URL`.

**Nota**: Variáveis de ambiente no Vite devem começar com `VITE_` para serem expostas ao código do cliente.

## TypeScript

O projeto está configurado com TypeScript strict mode, garantindo:

- Verificação de tipos em tempo de compilação
- Detecção de erros antes da execução
- Melhor autocomplete e IntelliSense no editor
- Refatoração mais segura

### Configurações Importantes

- **target**: ES2020
- **module**: ESNext
- **jsx**: react-jsx
- **strict**: true

## Troubleshooting

### Problemas Comuns

1. **Erro de conexão com API**:
   - Verifique se a API está rodando
   - Confirme que o proxy está configurado corretamente no `vite.config.ts`

2. **Porta já em uso**:
   - Altere a porta no `vite.config.ts` ou pare o processo que está usando a porta 3000

3. **Erro de build no Docker**:
   - Verifique se todos os arquivos necessários estão presentes
   - Confirme que o `.dockerignore` não está excluindo arquivos importantes

4. **Tipos TypeScript não encontrados**:
   - Execute `npm install` para garantir que todas as dependências estão instaladas
   - Verifique se os arquivos `.d.ts` estão presentes

### Comandos Úteis

```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versões das dependências
npm list

# Atualizar dependências
npm update

# Verificar problemas de tipos
npx tsc --noEmit
```

## Próximos Passos

1. **Roteamento**: Adicionar React Router para navegação entre páginas
2. **Gerenciamento de Estado**: Considerar Context API, Redux ou Zustand
3. **Requisições HTTP**: Adicionar Axios ou Fetch wrapper para chamadas à API
4. **Formulários**: Integrar React Hook Form ou Formik
5. **Validação**: Adicionar Yup ou Zod para validação de schemas
6. **Testes**: Configurar Vitest ou React Testing Library
7. **Estilização**: Adicionar Tailwind CSS, Styled Components ou CSS Modules

## Recursos Adicionais

- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do TypeScript](https://www.typescriptlang.org/)
- [Guia de TypeScript no React](https://react-typescript-cheatsheet.netlify.app/)

## Licença

Ver arquivo LICENSE na raiz do projeto para mais informações.

