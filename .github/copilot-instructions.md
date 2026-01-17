# Guia para Agentes de IA — Andrelândia Conecta

Este monorepo implementa uma plataforma para gestão e visibilidade do comércio local de Andrelândia/MG e região, reunindo frontend (React/Vite) e backend (Node.js/Express/Prisma).

## Arquitetura & Fluxos

- **Frontend**: React (Vite), Material UI, componentes globais para feedback visual e navegação.
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL.
- **Integração**: Comunicação via REST, autenticação JWT obrigatória em rotas protegidas.
- **Banco de dados**: PostgreSQL, migrations via Prisma.

## Workflows Essenciais

- Instale dependências em `/backend` e `/frontend`.
- Configure `.env` no backend com `DATABASE_URL` e `JWT_SECRET`.
- Execute migrations Prisma: `npx prisma migrate dev` em `/backend`.
- Inicie o backend: `npm run dev` em `/backend`.
- Inicie o frontend: `npm run dev` em `/frontend`.
- Consulte `/frontend/TODO.md` para prioridades reais de UX/UI e funcionalidades.

## Padrões e Convenções

- **Feedback visual global**: Sempre use `setSnackbar`, `GlobalSnackbar`, `LoadingBackdrop` (nunca componentes locais).
- **Navegação protegida**: Páginas sensíveis exigem token JWT, redirecionando para `/login` se ausente.
- **Formulários**: Padronizados, com loading global e breadcrumbs (`BreadcrumbNav.jsx`).
- **Responsividade**: Mobile first, siga exemplos de espaçamento, breakpoints e media queries.
- **Microinterações**: Utilize animações suaves em botões, cards, modais e navegação (`PageTransition.jsx`, `AnimatedCard.jsx`).
- **Controllers e rotas**: Separe lógica em `src/controllers/` e `src/routes/` no backend.
- **Prisma Client**: Importe por controller, nunca global.
- **Autenticação**: Middleware obrigatório em rotas protegidas.
- **Redefinição de senha**: Veja `authController.js` e rotas em `routes/auth.js`.

## Integração Frontend ↔ Backend

Exemplo de requisição autenticada:

```js
await axios.post("http://localhost:3333/comercios", form, {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Exemplos de Fluxo

1. Usuário logado acessa `/cadastro-comercio`.
2. Formulário envia POST para `/comercios` (token JWT no header).
3. Backend valida, cria registro via Prisma, retorna dados.

## Dicas e Observações

- Use sempre componentes globais para feedback e loading.
- Siga padrões de responsividade e acessibilidade já implementados.
- Consulte `/frontend/TODO.md` para próximos passos e prioridades.
- Para produção, recomenda-se uso de Docker para orquestração.

---

Seções pouco claras ou incompletas? Peça feedback para refinar as instruções!
