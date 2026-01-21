# Guia para Agentes de IA — Andrelândia Conecta

> Este monorepo implementa uma plataforma para gestão e visibilidade do comércio local de Andrelândia/MG e região. O objetivo é garantir UX profissional, integração segura e evolução rápida.

## Visão Geral da Arquitetura

- **Frontend**: React (Vite), Material UI, animações (framer-motion), feedback global (`GlobalSnackbar`, `LoadingBackdrop`), navegação protegida (`BreadcrumbNav.jsx`, `MenuDrawer.jsx`), responsividade mobile-first (`App.css`).
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL. Lógica em `src/controllers/`, rotas em `src/routes/`, autenticação JWT obrigatória (`middlewares/auth.js`).
- **Integração**: REST com JWT no header. Uploads validados e salvos em `/uploads`.
- **Banco de dados**: PostgreSQL, migrations via Prisma (`prisma/migrations/`).

## Fluxo de Desenvolvimento

1. Instale dependências em `/backend` e `/frontend`.
2. Configure `.env` no backend (`DATABASE_URL`, `JWT_SECRET`).
3. Rode migrations Prisma: `npx prisma migrate dev` em `/backend`.
4. Inicie backend: `npm run dev` em `/backend`.
5. Inicie frontend: `npm run dev` em `/frontend`.
6. Consulte `/frontend/TODO.md` para prioridades reais de UX/UI.

## Padrões e Convenções do Projeto

- **Feedback visual global**: Sempre use `setSnackbar`, `GlobalSnackbar`, `LoadingBackdrop` (evite feedback local). Exemplo: ao salvar um formulário, acione o loading global e exiba feedback via Snackbar.
- **Navegação protegida**: Páginas sensíveis exigem JWT, redirecionando para `/login` se ausente. Veja exemplos em `MenuDrawer.jsx` e `BreadcrumbNav.jsx`.
- **Formulários**: Padronizados, loading global, breadcrumbs (`BreadcrumbNav.jsx`).
- **Responsividade**: Mobile first, siga exemplos de `App.css` e componentes.
- **Microinterações**: Animações suaves em botões, cards, modais e navegação (`PageTransition.jsx`, `AnimatedCard.jsx`).
- **Controllers e rotas**: Lógica em `src/controllers/`, rotas em `src/routes/`.
- **Prisma Client**: Importe por controller, nunca global. Exemplo: cada controller importa seu próprio Prisma Client.
- **Autenticação**: Middleware obrigatório em rotas protegidas (`middlewares/auth.js`).
- **Uploads**: Imagens validadas por tipo/tamanho, salvas em `/uploads` (subpastas: `comercios/`, `produtos/`, `perfis/`).
- **Redefinição de senha**: Veja `authController.js` e rotas em `routes/auth.js`.

## Integração Frontend ↔ Backend

Exemplo de requisição autenticada:

```js
await axios.post("http://localhost:3333/comercios", form, {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Fluxos Típicos

1. Usuário logado acessa `/cadastro-comercio`.
2. Formulário envia POST para `/comercios` (JWT no header).
3. Backend valida, cria registro via Prisma, retorna dados.

## Convenções Específicas Descobertas

- **Feedback global obrigatório**: Não use feedback local em componentes, sempre utilize contexto global (`SnackbarContext.jsx`).
- **JWT obrigatório em rotas protegidas**: Falta de token redireciona para `/login`.
- **Uploads**: Use middlewares específicos para cada tipo de imagem (`uploadComercioImage.js`, `uploadProdutoImage.js`, `uploadPerfilImage.js`).
- **Estrutura de controllers**: Cada controller lida apenas com sua entidade, sem lógica cruzada.
- **Breadcrumbs e navegação**: Sempre utilize `BreadcrumbNav.jsx` para UX consistente.
- **Migrations**: Sempre rode migrations antes de iniciar o backend.
- **Prioridades de UX/UI**: Consulte e atualize `/frontend/TODO.md` para refletir o estado real do produto.

## Checklist de Deploy

- Scripts de build/teste funcionam (`npm run dev`, `npm start`)
- Migrations aplicadas e banco consistente
- Dockerfile/docker-compose revisados (se usar Docker)
- Variáveis de ambiente separadas para produção
- Testes manuais dos fluxos principais
- Logs de erro/acesso configurados
- Monitoramento básico (uptime, erros)

## Dicas e Observações

- Use sempre componentes globais para feedback e loading
- Siga padrões de responsividade e acessibilidade já implementados
- Consulte `/frontend/TODO.md` para próximos passos e prioridades
- Para produção, recomenda-se uso de Docker para orquestração

---

Seções pouco claras ou incompletas? Peça feedback para refinar as instruções!
