
# Copilot Instructions — Andrelândia Conecta

Este monorepo implementa uma plataforma de gestão e visibilidade para o comércio local de Andrelândia/MG e região.

## Arquitetura e Componentes

- **Frontend** (`/frontend`):
  - SPA em React (Vite), Material UI, React Router DOM.
  - Autenticação JWT (armazenado no localStorage), consumo de API REST.
  - Componentes reutilizáveis em `src/components`, páginas em `src/pages`.
  - Feedback visual padronizado: `Alert`, `Snackbar`, `Dialog` (ex: `GlobalSnackbar.jsx`).
  - Navegação protegida: páginas como `CadastroComercio.jsx` exigem token, redirecionando para `/login` se ausente.

- **Backend** (`/backend`):
  - Node.js (ESM), Express, Prisma ORM, JWT, bcryptjs.
  - API RESTful, autenticação JWT, banco PostgreSQL.
  - Controllers em `src/controllers`, rotas em `src/routes`.
  - Middleware de autenticação JWT em `src/middlewares/auth.js`.
  - Prisma Client instanciado por controller.

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

- **Rotas REST**: CRUD para `/comercios`, `/produtos`, `/usuarios`, `/auth` (login, esqueci-senha, redefinir-senha).
- **Autenticação**: JWT obrigatório para rotas protegidas (ex: criar/editar/remover produtos/comércios).
- **Frontend**:
  - Formulários padronizados, loading global, navegação protegida por token.
  - Feedback visual consistente (ex: `GlobalSnackbar.jsx`, `LoadingBackdrop.jsx`).
  - Use hooks e contextos para estado global (ex: `SnackbarContext.jsx`).
- **Backend**:
  - Controllers e rotas bem separados.
  - Middleware de autenticação sempre aplicado em rotas protegidas.
  - Prisma Client importado por controller, não global.

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

## Dicas para agentes

- Sempre respeite a separação de responsabilidades entre frontend e backend.
- Siga padrões de feedback visual e navegação protegida já presentes nas páginas.
- Consulte `/frontend/TODO.md` para prioridades de UX/UI e funcionalidades.
- Use exemplos reais dos arquivos para manter consistência de código e UX.
- Prefira comandos e fluxos documentados acima para build/dev/migrations.

<!-- Para mais detalhes: https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
