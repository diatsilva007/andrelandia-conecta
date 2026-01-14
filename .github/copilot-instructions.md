# Guia para Agentes de IA — Andrelândia Conecta

Este monorepo implementa uma plataforma para gestão e visibilidade do comércio local de Andrelândia/MG e região.

## Arquitetura

- **Frontend** (`/frontend`): SPA React (Vite), Material UI, React Router DOM. Navegação protegida por JWT (armazenado em localStorage), consumo de API REST via Axios. Feedback visual global: **sempre** use `SnackbarContext`, `GlobalSnackbar` e `LoadingBackdrop` (nunca componentes locais). Microinterações e animações suaves são padrão (ver `PageTransition.jsx`, `AnimatedCard.jsx`).
- **Backend** (`/backend`): Node.js (ESM), Express, Prisma ORM, JWT, bcryptjs. API RESTful, autenticação JWT, banco PostgreSQL. Controllers em `src/controllers`, rotas em `src/routes`. **Prisma Client deve ser importado dentro de cada controller, nunca globalmente**. Middleware de autenticação JWT obrigatório em rotas protegidas (`src/middlewares/auth.js`).
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
  - Consulte `/frontend/TODO.md` para prioridades reais de UX/UI e funcionalidades.

## Padrões e Convenções

- **Rotas REST**: CRUD para `/comercios`, `/produtos`, `/usuarios`, `/auth` (login, esqueci-senha, redefinir-senha). Exemplos em `src/routes/` e `src/controllers/`. **Rotas públicas** (ex: listagem de comércios/produtos) não exigem autenticação, mas toda criação/edição/exclusão exige JWT e middleware.
- **Autenticação**: JWT obrigatório para rotas protegidas. Sempre use o middleware de autenticação (`autenticarToken`).
- **Frontend**:
  - Feedback visual global: sempre use `setSnackbar`, `GlobalSnackbar`, `LoadingBackdrop` (nunca componentes locais).
  - Navegação protegida: páginas sensíveis exigem token JWT, redirecionando para `/login` se ausente.
  - Formulários padronizados, loading global, breadcrumbs (`BreadcrumbNav.jsx`).
  - Material UI para UI/UX consistente e acessível.
  - Responsividade e mobile first: siga exemplos de espaçamento, breakpoints e media queries.
  - Microinterações: utilize animações suaves em botões, cards, modais e navegação (`PageTransition.jsx`, `AnimatedCard.jsx`).
- **Backend**:
  - Separe controllers e rotas (exemplos em `src/controllers/` e `src/routes/`).
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
- Fluxo de reset de senha: `/auth/esqueci-senha` e `/auth/redefinir-senha/:token`.

## Exemplos de Fluxo

- **Cadastro de comércio**:
  1. Usuário logado acessa `/cadastro-comercio`.
  2. Formulário envia POST para `/comercios` (token JWT no header).
  3. Backend valida, cria registro via Prisma, retorna dados.
- **Listagem pública**: `/comercios` e `/produtos` são acessíveis sem autenticação.
- **Feedback visual**: sempre use `setSnackbar` para mostrar mensagens após ações (sucesso/erro), e `LoadingBackdrop` para loading global.
- **Exclusão/Edição**: sempre peça confirmação visual (Dialog) antes de excluir, e atualize a listagem após sucesso.
- **Debugging**: utilize logs do backend e feedback visual do frontend para rastrear problemas.

## Dicas para Agentes

- Respeite a separação de responsabilidades entre frontend e backend.
- Siga padrões de feedback visual global, navegação protegida e responsividade já presentes.
- Sempre consulte `/frontend/TODO.md` para alinhar com prioridades reais do produto.
- Use exemplos reais dos arquivos para manter consistência de código e UX.
- Prefira comandos e fluxos documentados acima para build/dev/migrations.
- Para feedback visual, utilize sempre os componentes globais já existentes (`SnackbarContext`, `GlobalSnackbar`, `LoadingBackdrop`).
- Ao criar novas rotas protegidas, lembre-se de aplicar o middleware de autenticação (`autenticarToken`).
- Para novos modelos Prisma, siga o padrão do `schema.prisma` e gere migrations.
- Para debugging, utilize logs do backend e o feedback visual do frontend.
- Priorize acessibilidade e responsividade (ex: navegação por teclado, ARIA, contraste, foco visível).
- Sempre atualize esta documentação e exemplos práticos ao adicionar novos fluxos ou padrões.

<!-- Para mais detalhes: https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
