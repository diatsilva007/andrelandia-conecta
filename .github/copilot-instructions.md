# Copilot Instructions — Andrelândia Conecta

Este monorepo implementa uma plataforma de gestão e visibilidade para o comércio local de Andrelândia/MG e região.

## Estrutura e Arquitetura

- **Frontend** (`/frontend`): React + Vite, Material UI, React Router DOM. Fluxo SPA, autenticação via JWT (armazenado no localStorage), consumo de API REST.
- **Backend** (`/backend`): Node.js (ESM), Express, Prisma ORM, JWT, bcryptjs. API RESTful, autenticação JWT, banco PostgreSQL.
- **Banco de dados**: PostgreSQL, modelado via Prisma (`/backend/prisma/schema.prisma`).

## Fluxos e Comandos Essenciais

- **Desenvolvimento**:
  - Frontend: `npm run dev` em `/frontend` (Vite)
  - Backend: `npm run dev` em `/backend` (Nodemon)
- **Build**:
  - Frontend: `npm run build` em `/frontend`
  - Backend: `npm start` em `/backend`
- **Migrations Prisma**: Use `npx prisma migrate dev` em `/backend` após alterar o schema.

## Convenções e Padrões

- **Rotas REST**: CRUD para `/comercios`, `/produtos`, `/usuarios`, `/auth` (login, esqueci-senha, redefinir-senha).
- **Autenticação**: JWT obrigatório para rotas protegidas (ex: criar/editar/remover produtos/comércios).
- **Frontend**:
  - Componentes e páginas em `/frontend/src/components` e `/frontend/src/pages`.
  - Uso intensivo de Material UI, feedback visual com `Alert`, `Snackbar`, `Dialog`.
  - Formulários padronizados, loading global e navegação protegida por token.
  - Exemplo: `CadastroComercio.jsx` exige token, redireciona para `/login` se ausente.
- **Backend**:
  - Controllers em `/backend/src/controllers`, rotas em `/backend/src/routes`.
  - Middleware de autenticação JWT em `/backend/src/middlewares/auth.js`.
  - Prisma Client instanciado por controller.

## Integrações e Comunicação

- **Frontend → Backend**: Axios, endpoints em `http://localhost:3333`.
- **Env vars**: Configure `.env` no backend (ex: `DATABASE_URL`, `JWT_SECRET`).
- **Reset de senha**: Fluxo `/auth/esqueci-senha` e `/auth/redefinir-senha/:token`.

## Exemplos de Fluxo

- **Cadastro de comércio**:
  1.  Usuário logado acessa `/cadastro-comercio`.
  2.  Formulário envia POST para `/comercios` (token JWT no header).
  3.  Backend valida, cria registro via Prisma, retorna dados.
- **Listagem pública**: `/comercios` e `/produtos` são acessíveis sem autenticação.

## Dicas para agentes

- Sempre respeite a separação de responsabilidades entre frontend e backend.
- Siga os padrões de feedback visual e navegação protegida já presentes nas páginas.
- Consulte `/frontend/TODO.md` para prioridades de UX/UI e funcionalidades.
- Use exemplos reais dos arquivos para manter consistência de código e UX.

<!-- Para mais detalhes: https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
