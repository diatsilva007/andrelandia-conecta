# Copilot Instructions — Andrelândia Conecta

Este monorepo implementa uma plataforma de gestão e visibilidade para o comércio local de Andrelândia/MG e região.

## Visão Geral da Arquitetura

- **Frontend** (`/frontend`):

  - SPA React (Vite), Material UI, React Router DOM.
  - Autenticação JWT (armazenado no localStorage), consumo de API REST.
  - Componentes reutilizáveis em `src/components` (ex: `GlobalSnackbar.jsx`, `LoadingBackdrop.jsx`).
  - Páginas em `src/pages` (ex: `CadastroComercio.jsx`, `Login.jsx`).
  - Navegação protegida: páginas sensíveis exigem token, redirecionando para `/login` se ausente.
  - Feedback visual padronizado via Snackbar/Alert/Dialog.

- **Backend** (`/backend`):

  - Node.js (ESM), Express, Prisma ORM, JWT, bcryptjs.
  - API RESTful, autenticação JWT, banco PostgreSQL.
  - Controllers em `src/controllers`, rotas em `src/routes`.
  - Middleware de autenticação JWT em `src/middlewares/auth.js` (sempre use em rotas protegidas).
  - Prisma Client instanciado por controller (não global).

- **Banco de dados**: PostgreSQL, modelado via Prisma (`backend/prisma/schema.prisma`).

## Fluxos e Comandos Essenciais

- **Desenvolvimento**:
  - Frontend: `npm run dev` em `/frontend` (Vite)
  - Backend: `npm run dev` em `/backend` (Nodemon)
- **Build**:
  - Frontend: `npm run build` em `/frontend`
  - Backend: `npm start` em `/backend`
- **Migrations Prisma**: `npx prisma migrate dev` em `/backend` após alterar o schema.

## Convenções e Padrões do Projeto

- **Rotas REST**: CRUD para `/comercios`, `/produtos`, `/usuarios`, `/auth` (login, esqueci-senha, redefinir-senha). Veja exemplos em `src/routes/` e `src/controllers/`.
- **Autenticação**: JWT obrigatório para rotas protegidas (ex: criar/editar/remover produtos/comércios). Use o middleware de autenticação.
- **Frontend**:
  - Formulários padronizados, loading global, navegação protegida por token.
  - Feedback visual consistente (ex: `GlobalSnackbar.jsx`, `LoadingBackdrop.jsx`).
  - Hooks/contextos para estado global (ex: `SnackbarContext.jsx`).
  - Use Material UI para UI/UX consistente.
- **Backend**:
  - Controllers e rotas bem separados.
  - Middleware de autenticação sempre aplicado em rotas protegidas.
  - Prisma Client importado por controller, nunca global.

## Integrações e Comunicação

- **Frontend → Backend**: Axios, endpoints em `http://localhost:3333`.
- **Env vars**: Configure `.env` no backend (`DATABASE_URL`, `JWT_SECRET`).
- **Reset de senha**: Fluxo `/auth/esqueci-senha` e `/auth/redefinir-senha/:token`.

## Exemplos de Fluxo

- **Cadastro de comércio**:
  1. Usuário logado acessa `/cadastro-comercio`.
  2. Formulário envia POST para `/comercios` (token JWT no header).
  3. Backend valida, cria registro via Prisma, retorna dados.
- **Listagem pública**: `/comercios` e `/produtos` são acessíveis sem autenticação.

## Dicas e Observações para Agentes

- Sempre respeite a separação de responsabilidades entre frontend e backend.
- Siga padrões de feedback visual e navegação protegida já presentes nas páginas.
- Consulte `/frontend/TODO.md` para prioridades de UX/UI e funcionalidades.
- Use exemplos reais dos arquivos para manter consistência de código e UX.
- Prefira comandos e fluxos documentados acima para build/dev/migrations.
- Para feedback visual, utilize sempre os componentes globais já existentes.
- Ao criar novas rotas protegidas, lembre-se de aplicar o middleware de autenticação.
- Para novos modelos Prisma, siga o padrão do `schema.prisma` e gere migrations.

<!-- Para mais detalhes: https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
