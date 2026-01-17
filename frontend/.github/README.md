# Frontend — Andrelândia Conecta

Aplicação web em React (Vite) para gestão e visibilidade do comércio local de Andrelândia/MG e região.

## Scripts principais

- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run build`: gera a versão de produção
- `npm run preview`: visualiza o build local

## Estrutura

- `src/components/`: componentes globais (feedback visual, navegação, animações)
- `src/pages/`: páginas principais (Dashboard, Cadastro, Detalhes, etc)
- `src/contexts/`: contexto global de usuário e autenticação
- `public/`: arquivos estáticos

## Padrões e Convenções

- Sempre utilize `GlobalSnackbar`, `LoadingBackdrop` e `SnackbarContext` para feedback visual
- Navegação protegida: páginas sensíveis exigem token JWT, redirecionando para `/login` se ausente
- Formulários padronizados, loading global, breadcrumbs (`BreadcrumbNav.jsx`)
- Material UI para UI/UX consistente
- Responsividade: mobile first, siga exemplos de espaçamento e breakpoints
- Microinterações: animações suaves em botões, cards, modais e navegação (`AnimatedCard.jsx`, `PageTransition.jsx`)

## Integração com Backend

- Requisições autenticadas via JWT:
```js
await axios.post("http://localhost:3333/comercios", form, {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Checklist de Prontidão para Produção

- [ ] Funcionalidades essenciais implementadas e testadas
- [ ] Responsividade e acessibilidade validadas
- [ ] Feedback visual global funcionando
- [ ] Integração com backend validada
- [ ] Scripts de build/teste funcionando
- [ ] Documentação atualizada

## Dicas

- Consulte o arquivo TODO.md para prioridades e próximos passos
- Para produção, recomenda-se uso de Docker

---

_Última atualização: 17/01/2026_
