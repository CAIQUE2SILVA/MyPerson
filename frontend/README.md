# Frontend MyPerson

Loja pública em **Next.js 16** (App Router) + **React 19** + **TypeScript 5.9** + **Tailwind 4**.

## Acesso

| Ambiente | URL |
|----------|-----|
| Docker/Nginx | http://localhost |
| Dev local (`npm run dev`) | http://localhost:3000 |

A API é chamada em `http://localhost/api` (via Nginx em produção/Docker).

## Stack

- **Next.js**: 16.2.9 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.9.3
- **Tailwind CSS**: 4.x
- **ESLint**: 9.x com config Next

## Estrutura

```
frontend/src/
├── app/                    # App Router
│   ├── page.tsx           # Página inicial /
│   ├── layout.tsx         # Layout raiz
│   ├── globals.css        # Estilos globais
│   └── (outras rotas)/    # /produtos, etc.
└── components/
    ├── layout/            # Header, Footer
    └── sections/          # HeroSection, FeaturedProducts, etc.
```

## Comandos

```bash
npm install          # dependências
npm run dev          # dev server (porta 3000)
npm run build        # build de produção
npm run lint         # verificar ESLint
```

## Convenções

- Server Components por padrão; Client Components só quando precisar de estado/eventos.
- Estilização com Tailwind; não misturar CSS modules.
- Fetch de dados em Server Components, quando possível.
- Chamar a API em `http://localhost/api/{endpoint}`.

## Documentação do projeto

- [docs/PROJETO.md](../docs/PROJETO.md) — arquitetura geral
- [docs/AGENTS.md](../docs/AGENTS.md) — instruções para agentes
- [docs/PLANO-AUTOMACAO.md](../docs/PLANO-AUTOMACAO.md) — plano de automação (docs, skills, testes, CI/CD)
- [api/API.md](../api/API.md) — endpoints da API
