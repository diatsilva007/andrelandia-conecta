# Guia para Agentes de IA — Andrelândia Conecta

Este monorepo implementa uma plataforma para gestão e visibilidade do comércio local de Andrelândia/MG e região. O foco é UX profissional, integração segura e evolução rápida, com padrões claros para agentes de IA.

## Arquitetura Geral

- **Frontend** (`frontend/`): React (Vite), Material UI, animações (framer-motion). Feedback global obrigatório via `GlobalSnackbar`, `LoadingBackdrop` e contexto (`SnackbarContext.jsx`). Navegação protegida por JWT (`MenuDrawer.jsx`, `BreadcrumbNav.jsx`). Responsividade mobile-first (`App.css`).
- **Backend** (`backend/`): Node.js, Express, Prisma ORM, PostgreSQL. Lógica de negócio em `src/controllers/`, rotas em `src/routes/`, autenticação JWT obrigatória (`middlewares/auth.js`).
- **Integração**: REST, JWT no header. Uploads validados e salvos em `/uploads` (`comercios/`, `produtos/`, `perfis/`).
- **Banco de dados**: PostgreSQL, migrations via Prisma (`prisma/migrations/`).

## Fluxos Essenciais de Desenvolvimento

1. Instale dependências em `/backend` e `/frontend`.
2. Configure `.env` no backend (`DATABASE_URL`, `JWT_SECRET`).
3. Rode migrations Prisma: `npx prisma migrate dev` em `/backend`.
4. Inicie backend: `npm run dev` em `/backend`.
5. Inicie frontend: `npm run dev` em `/frontend`.
6. Consulte `/frontend/TODO.md` para prioridades reais de UX/UI.

## Padrões e Convenções Específicas

- **Feedback global**: Sempre use `setSnackbar`, `GlobalSnackbar`, `LoadingBackdrop` e `SnackbarContext.jsx`. Não use feedback local.
- **Navegação protegida**: JWT obrigatório em páginas sensíveis. Redirecione para `/login` se ausente. Veja `MenuDrawer.jsx`, `BreadcrumbNav.jsx`.
- **Formulários**: Padronizados, loading global, breadcrumbs (`BreadcrumbNav.jsx`).
- **Responsividade**: Mobile first, siga exemplos de `App.css` e componentes.
- **Microinterações**: Animações suaves em botões, cards, modais e navegação (`PageTransition.jsx`, `AnimatedCard.jsx`).
- **Controllers e rotas**: Cada controller lida apenas com sua entidade, sem lógica cruzada. Veja `src/controllers/` e `src/routes/`.
- **Prisma Client**: Importe por controller, nunca global.
- **Autenticação**: Middleware obrigatório em rotas protegidas (`middlewares/auth.js`).
- **Uploads**: Use middlewares específicos para cada tipo de imagem (`uploadComercioImage.js`, `uploadProdutoImage.js`, `uploadPerfilImage.js`).
- **Redefinição de senha**: Veja `authController.js` e rotas em `routes/auth.js`.

## Integração Frontend ↔ Backend

Requisições autenticadas:

```js
await axios.post("http://localhost:3333/comercios", form, {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Checklist de Deploy

- Scripts de build/teste funcionam (`npm run dev`, `npm start`)
- Migrations aplicadas e banco consistente
- Dockerfile/docker-compose revisados (se usar Docker)
- Variáveis de ambiente separadas para produção
- Testes manuais dos fluxos principais
- Logs de erro/acesso configurados
- Monitoramento básico (uptime, erros)

## Observações e Dicas

- Use sempre componentes globais para feedback e loading
- Siga padrões de responsividade e acessibilidade já implementados
- Consulte `/frontend/TODO.md` para próximos passos e prioridades
- Para produção, recomenda-se uso de Docker para orquestração

---

Seções pouco claras ou incompletas? Peça feedback para refinar as instruções!
