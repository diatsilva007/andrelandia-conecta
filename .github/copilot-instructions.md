# Guia Rápido para Agentes de IA — Andrelândia Conecta

> **Este repositório é um monorepo para uma plataforma de gestão e visibilidade do comércio local de Andrelândia/MG.**

## Arquitetura e Fluxo

- **Frontend:** React (Vite), Material UI, framer-motion, react-router-dom, react-leaflet
  - Consome API REST em `http://localhost:3333`
  - Autenticação JWT (`Authorization: Bearer <token>`) — token restaurado via `/auth/me` em `UserContext.jsx`
  - Feedback global: use `SnackbarContext.jsx` (`setSnackbar`) e loading global com `<LoadingBackdrop />`
  - Navegação protegida: redirecione para `/login` se não autenticado
  - Sempre use `<BreadcrumbNav />` em páginas internas
  - Microinterações: `<AnimatedCard>`, `<PageTransition>` (não crie animações inline)

- **Backend:** Express, Prisma, PostgreSQL
  - Cada controller importa **sua própria** instância de `PrismaClient` (nunca singleton global)
    - Exemplo: `import { PrismaClient } from "@prisma/client"; const prisma = new PrismaClient();`
  - Controllers são isolados por entidade (ex: `comercioController.js` só lida com Comércio)
  - Uploads: cada entidade tem middleware dedicado (`uploadComercioImage.js`, etc.)
  - Rotas protegidas: sempre use `autenticarToken` e injete `req.usuario`
  - Paginação padrão: utilize `offset`/`limit` e retorne `{ data, total }`

## Fluxos de Desenvolvimento

- **Iniciar ambiente:**
  - Backend: `cd backend && npm install && npx prisma migrate dev && npm run dev`
  - Frontend: `cd frontend && npm install && npm run dev`
  - Use tasks do VS Code: `Dev Backend` e `Dev Frontend`

- **Nova migration:**
  - Edite `backend/prisma/schema.prisma`
  - Rode: `npx prisma migrate dev --name nome_migracao`

- **Adicionar novo modelo:**
  1.  Edite o schema
  2.  Rode migration
  3.  Crie controller em `src/controllers/`
  4.  Crie rota em `src/routes/`
  5.  Registre em `src/index.js`

## Convenções e Padrões

- Feedback e loading **sempre globais** (nunca locais)
- Nunca use `console.log` em produção (apenas `console.error` para erros)
- Variáveis camelCase, componentes PascalCase
- Sempre valide `req.usuario` em rotas protegidas
- Normalize strings para buscas: `normalize("NFD").replace(/[\u0300-\u036f]/g, "")`
- Converta tipos numéricos explicitamente (`Number(id)`, `parseFloat(preco)`)
- Coordenadas: valide `latitude`/`longitude` como `Float?` no Prisma

## Integrações e Exemplos

- Veja exemplos reais em:
  - `frontend/src/components/ListaComercios.jsx` (feedback, loading, breadcrumbs)
  - `backend/src/controllers/comercioController.js` (paginação, uso local do Prisma)
  - `backend/src/middlewares/uploadComercioImage.js` (upload dedicado)

## Troubleshooting

- **Token inválido:** cheque `JWT_SECRET` e fluxo de restauração em `/auth/me`
- **Prisma Client não inicializado:** rode `npx prisma generate` em `/backend`
- **Uploads falham:** confira middleware correto e permissões em `uploads/`
- **Dúvidas de padrões:** busque exemplos nos arquivos existentes antes de propor novo padrão

## Referências

- [frontend/TODO.md](../frontend/TODO.md): melhorias, bugs e features planejadas

---

> **Mantenha este guia conciso e atualizado. Foque em instruções práticas e exemplos reais do projeto.**
