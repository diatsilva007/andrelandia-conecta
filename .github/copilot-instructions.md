# Guia para Agentes de IA — Andrelândia Conecta

Este monorepo implementa uma plataforma para gestão e visibilidade do comércio local de Andrelândia/MG e região.

## Arquitetura

- **Frontend** (`/frontend`): SPA React (Vite), Material UI, React Router DOM. Navegação protegida por JWT (localStorage), consumo de API REST via Axios. Feedback visual global padronizado: use sempre `SnackbarContext`, `GlobalSnackbar` e `LoadingBackdrop`. Microinterações e animações suaves (ver `PageTransition.jsx`, `AnimatedCard.jsx`).
- **Backend** (`/backend`): Node.js (ESM), Express, Prisma ORM, JWT, bcryptjs. API RESTful, autenticação JWT, banco PostgreSQL. Controllers em `src/controllers`, rotas em `src/routes`. Middleware de autenticação JWT obrigatório em rotas protegidas (`src/middlewares/auth.js`). Prisma Client importado por controller (nunca global).
- **Banco de dados**: PostgreSQL, modelado via Prisma (`backend/prisma/schema.prisma`).

## Workflows Essenciais

- **Desenvolvimento**:
  - Frontend: `npm run dev` em `/frontend`
  - Backend: `npm run dev` em `/backend`
- **Build**:
  - Frontend: `npm run build` em `/frontend`
  - Backend: `npm start` em `/backend`
- **Migrations Prisma**: `npx prisma migrate dev` em `/backend` após alterar o schema.
- **Configuração**:
  - `.env` no backend com `DATABASE_URL` e `JWT_SECRET` obrigatórios.
  - Configure o banco PostgreSQL local e execute as migrations.

## Padrões e Convenções

- **Rotas REST**: CRUD para `/comercios`, `/produtos`, `/usuarios`, `/auth` (login, esqueci-senha, redefinir-senha). Veja exemplos em `src/routes/` e `src/controllers/`.
- **Autenticação**: JWT obrigatório para rotas protegidas. Sempre use o middleware de autenticação (`src/middlewares/auth.js`).
- **Frontend**:
  - Use sempre os componentes globais de feedback visual: `setSnackbar` (via `SnackbarContext.jsx`), `GlobalSnackbar.jsx` e `LoadingBackdrop.jsx`.
  - Navegação protegida: páginas sensíveis exigem token JWT, redirecionando para `/login` se ausente (ver `Login.jsx`, `CadastroComercio.jsx`).
  - Formulários padronizados, loading global, breadcrumbs (`BreadcrumbNav.jsx`).
  - Material UI para UI/UX consistente e acessível. Siga exemplos reais e microinterações do `/frontend/TODO.md`.
  - Responsividade e mobile first: siga exemplos de espaçamento, breakpoints e media queries em `App.css`, `index.css` e componentes.
  - Microinterações: utilize animações suaves em botões, cards, modais e navegação (ver `AnimatedCard.jsx`, `PageTransition.jsx`).
- **Backend**:
  - Separe controllers e rotas.
  - Middleware de autenticação sempre aplicado em rotas protegidas.
  - Prisma Client importado por controller, nunca global.
  - Fluxo de redefinição de senha: veja `authController.js` e rotas em `routes/auth.js`.

## Integração Frontend ↔ Backend

- Use Axios para consumir endpoints em `http://localhost:3333`.
- Sempre envie o JWT no header Authorization para rotas protegidas:
  ```js
  await axios.post("http://localhost:3333/comercios", form, {
    headers: { Authorization: `Bearer ${token}` },
  });
  ```
- Fluxo de reset de senha: `/auth/esqueci-senha` e `/auth/redefinir-senha/:token` (ver `authController.js` e `RedefinirSenha.jsx`).

## Exemplos de Fluxo

- **Cadastro de comércio**:
  1. Usuário logado acessa `/cadastro-comercio`.
  2. Formulário envia POST para `/comercios` (token JWT no header).
  3. Backend valida, cria registro via Prisma, retorna dados.
- **Listagem pública**: `/comercios` e `/produtos` são acessíveis sem autenticação.
- **Feedback visual**: sempre use `setSnackbar` para mostrar mensagens após ações (sucesso/erro), e `LoadingBackdrop` para loading global.
- **Exclusão/Edição**: sempre peça confirmação visual (Dialog) antes de excluir, e atualize a listagem após sucesso.

## Dicas e Regras para Agentes

- Respeite a separação de responsabilidades entre frontend e backend.
- Siga padrões de feedback visual, navegação protegida e responsividade já presentes nas páginas e componentes.
- Consulte `/frontend/TODO.md` para prioridades de UX/UI e funcionalidades reais.
- Use exemplos reais dos arquivos para manter consistência de código e UX.
- Prefira comandos e fluxos documentados acima para build/dev/migrations.
- Para feedback visual, utilize sempre os componentes globais já existentes (`SnackbarContext`, `GlobalSnackbar`, `LoadingBackdrop`).
- Ao criar novas rotas protegidas, lembre-se de aplicar o middleware de autenticação.
- Para novos modelos Prisma, siga o padrão do `schema.prisma` e gere migrations.
- Para debugging, utilize logs do backend e o feedback visual do frontend.
- Priorize acessibilidade e responsividade (ver TODO.md, exemplos de uso de MUI, breakpoints e media queries).
- Sempre atualize a documentação e exemplos práticos ao adicionar novos fluxos ou padrões.

<!-- Para mais detalhes: https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
