# Guia para Agentes de IA — Andrelândia Conecta

> Este monorepo implementa uma plataforma para gestão e visibilidade do comércio local de Andrelândia/MG e região. O objetivo é garantir UX profissional, integração segura e padrões consistentes para evoluir rapidamente.

## Arquitetura

- **Frontend**: React (Vite), Material UI, animações (framer-motion), componentes globais para feedback (`GlobalSnackbar`, `LoadingBackdrop`), navegação (`BreadcrumbNav.jsx`, `MenuDrawer.jsx`), responsividade mobile-first (ver `App.css`).
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL. Lógica separada em `src/controllers/` e rotas em `src/routes/`. Autenticação JWT obrigatória em rotas protegidas (`middlewares/auth.js`).
- **Integração**: Comunicação via REST, sempre com JWT no header. Uploads de imagem validados e salvos em `/uploads`.
- **Banco de dados**: PostgreSQL, migrations via Prisma (`prisma/migrations/`).

## Workflows Essenciais

1. Instale dependências em `/backend` e `/frontend`.
2. Configure `.env` no backend (`DATABASE_URL`, `JWT_SECRET`).
3. Execute migrations Prisma: `npx prisma migrate dev` em `/backend`.
4. Inicie backend: `npm run dev` em `/backend`.
5. Inicie frontend: `npm run dev` em `/frontend`.
6. Consulte `/frontend/TODO.md` para prioridades reais de UX/UI e funcionalidades.

## Padrões e Convenções

- **Feedback visual global**: Use sempre `setSnackbar`, `GlobalSnackbar`, `LoadingBackdrop` (evite componentes locais de feedback).
- **Navegação protegida**: Páginas sensíveis exigem token JWT, redirecionando para `/login` se ausente.
- **Formulários**: Padronizados, loading global, breadcrumbs (`BreadcrumbNav.jsx`).
- **Responsividade**: Mobile first, espaçamento e breakpoints conforme exemplos em `App.css` e componentes.
- **Microinterações**: Animações suaves em botões, cards, modais e navegação (`PageTransition.jsx`, `AnimatedCard.jsx`).
- **Controllers e rotas**: Lógica em `src/controllers/`, rotas em `src/routes/`.
- **Prisma Client**: Importe por controller, nunca global.
- **Autenticação**: Middleware obrigatório em rotas protegidas (`middlewares/auth.js`).
- **Uploads**: Imagens validadas por tipo/tamanho, salvas em `/uploads`.
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

## Checklist de Prontidão (Deploy)

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
