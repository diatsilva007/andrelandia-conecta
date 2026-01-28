# Guia para Agentes de IA — Andrelândia Conecta

Este monorepo implementa uma plataforma para gestão e visibilidade do comércio local de Andrelândia/MG e região. O foco é UX profissional, integração segura e evolução rápida, com padrões claros para agentes de IA.

## Visão Geral da Arquitetura

- **Frontend** (`frontend/`):
  - React (Vite), Material UI, animações com framer-motion.
  - Feedback global obrigatório: utilize sempre `setSnackbar`, `GlobalSnackbar`, `LoadingBackdrop` e `SnackbarContext.jsx` para qualquer mensagem ao usuário (nunca feedback local ou isolado).
  - Navegação protegida por JWT: redirecione para `/login` se não autenticado. Veja exemplos em `MenuDrawer.jsx` e `BreadcrumbNav.jsx`.
  - Responsividade mobile-first: siga padrões de `App.css` e componentes.
  - Microinterações: use animações suaves em botões, cards, modais e navegação (`PageTransition.jsx`, `AnimatedCard.jsx`).
  - Formulários: padronizados, loading global, breadcrumbs (`BreadcrumbNav.jsx`).
  - Prioridades e tarefas reais: consulte sempre [`frontend/TODO.md`](../frontend/TODO.md).

- **Backend** (`backend/`):
  - Node.js, Express, Prisma ORM, PostgreSQL.
  - Lógica de negócio em [`src/controllers/`](../backend/src/controllers/), rotas em [`src/routes/`](../backend/src/routes/).
  - Cada controller lida apenas com sua entidade (sem lógica cruzada entre controllers).
  - Prisma Client: importe localmente por controller, nunca global.
  - Autenticação JWT obrigatória em rotas sensíveis ([`middlewares/auth.js`](../backend/src/middlewares/auth.js)).
  - Uploads: middlewares específicos para cada tipo de imagem ([`uploadComercioImage.js`](../backend/src/middlewares/uploadComercioImage.js), [`uploadProdutoImage.js`](../backend/src/middlewares/uploadProdutoImage.js), [`uploadPerfilImage.js`](../backend/src/middlewares/uploadPerfilImage.js)).
  - Redefinição de senha: veja [`authController.js`](../backend/src/controllers/authController.js) e rotas em [`routes/auth.js`](../backend/src/routes/auth.js).

- **Integração**:
  - REST, JWT no header. Exemplo:
    ```js
    await axios.post("http://localhost:3333/comercios", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    ```
  - Uploads salvos em `/uploads/{comercios, produtos, perfis}`.

- **Banco de dados**:
  - PostgreSQL, migrations via Prisma ([`prisma/migrations/`](../backend/prisma/migrations/)).
  - Para atualizar o schema: `npx prisma migrate dev` em `/backend`.

## Workflows Essenciais

1. Instale dependências em `/backend` e `/frontend`.
2. Configure `.env` no backend (`DATABASE_URL`, `JWT_SECRET`).
3. Rode migrations Prisma: `npx prisma migrate dev` em `/backend`.
4. Inicie backend: `npm run dev` em `/backend`.
5. Inicie frontend: `npm run dev` em `/frontend`.
6. Consulte [`frontend/TODO.md`](../frontend/TODO.md) para prioridades reais de UX/UI.

## Convenções e Padrões Específicos

- Feedback global obrigatório (nunca local)
- JWT obrigatório em páginas/rotas sensíveis
- Controllers e rotas: 1-para-1, sem lógica cruzada
- Prisma Client: importação local por controller
- Uploads: middlewares específicos por entidade
- Responsividade e acessibilidade: siga exemplos existentes
- Microinterações: use componentes animados já implementados

## Exemplos e Dicas Práticas

- Para adicionar um novo tipo de upload, crie um middleware dedicado em [`src/middlewares/`](../backend/src/middlewares/).
- Para feedback visual, sempre utilize o contexto global de snackbar (`SnackbarContext.jsx`).
- Para proteger rotas, siga o padrão de uso do middleware JWT em [`src/middlewares/auth.js`](../backend/src/middlewares/auth.js).
- Para criar novas entidades, siga o padrão controller/route já existente (ex: [`comercioController.js`](../backend/src/controllers/comercioController.js) e [`comercio.js`](../backend/src/routes/comercio.js)).
- Para microinterações, utilize componentes animados já presentes em [`components/`](../frontend/src/components/).

## Deploy e Manutenção

- Scripts de build/teste: `npm run dev`, `npm start`
- Migrations aplicadas e banco consistente
- Dockerfile/docker-compose revisados (se usar Docker)
- Variáveis de ambiente separadas para produção
- Testes manuais dos fluxos principais
- Logs de erro/acesso configurados
- Monitoramento básico (uptime, erros)

---

Seções pouco claras ou incompletas? Peça feedback para refinar as instruções!
