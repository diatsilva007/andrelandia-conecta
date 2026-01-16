# Guia para Agentes de IA — Andrelândia Conecta

Este monorepo implementa uma plataforma para gestão e visibilidade do comércio local de Andrelândia/MG e região.

## Arquitetura

## Workflows Essenciais

- Frontend: `npm run dev` em `/frontend`
- Backend: `npm run dev` em `/backend`
- Frontend: `npm run build` em `/frontend`
- Backend: `npm start` em `/backend`
- `.env` no backend com `DATABASE_URL` e `JWT_SECRET` obrigatórios.
- Configure o banco PostgreSQL local e execute as migrations.
- Consulte `/frontend/TODO.md` para prioridades reais de UX/UI e funcionalidades.

## Padrões e Convenções

- Feedback visual global: sempre use `setSnackbar`, `GlobalSnackbar`, `LoadingBackdrop` (nunca componentes locais).
- Navegação protegida: páginas sensíveis exigem token JWT, redirecionando para `/login` se ausente.
- Formulários padronizados, loading global, breadcrumbs (`BreadcrumbNav.jsx`).
- Material UI para UI/UX consistente e acessível.
- Responsividade e mobile first: siga exemplos de espaçamento, breakpoints e media queries.
- Microinterações: utilize animações suaves em botões, cards, modais e navegação (`PageTransition.jsx`, `AnimatedCard.jsx`).
- Separe controllers e rotas (exemplos em `src/controllers/` e `src/routes/`).
- Middleware de autenticação sempre aplicado em rotas protegidas.
- Prisma Client importado por controller, nunca global.
- Fluxo de redefinição de senha: veja `authController.js` e rotas em `routes/auth.js`.

## Integração Frontend ↔ Backend

```js
await axios.post("http://localhost:3333/comercios", form, {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Exemplos de Fluxo

1. Usuário logado acessa `/cadastro-comercio`.
2. Formulário envia POST para `/comercios` (token JWT no header).
3. Backend valida, cria registro via Prisma, retorna dados.

## Dicas para Agentes

<!-- Para mais detalhes: https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
