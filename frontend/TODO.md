# TODO - Andrelândia Conecta

## Checklist de Responsividade e Mobile First

- [x] Adaptação responsiva incremental (Dashboard, Login, Cadastro, etc.)
- [x] Usar breakpoints do Material UI (`xs`, `sm`, `md`, `lg`) em containers, grids, cards e botões
- [x] Garantir touch targets adequados (mínimo 48px)
- [x] Testar navegação, menus, modais e tooltips em telas pequenas
- [x] Validar microinterações e animações em mobile
- [ ] Ajustar media queries customizadas se necessário (App.css, index.css)
- [ ] Testar em dispositivos reais e simuladores
- [ ] Revisar todos os fluxos para mobile antes de novas features complexas

## Checklist de UX/UI Profissional

- [x] Identidade visual consistente: paleta de cores exclusiva, logotipo simples, uso padronizado em todos os elementos.
- [x] Tipografia e hierarquia: no máximo 2 famílias de fonte, destaque para títulos/botões, hierarquia visual clara.
- [x] Espaçamento e alinhamento: espaçamento consistente entre cards, seções e botões; uso de grids e containers para centralização.
- [ ] Microinterações e animações suaves: animações de hover em botões/cards, transições suaves em modais/tooltips/navegação.
- [ ] Navegação clara: navbar sempre visível (fixa ou drawer), breadcrumbs para facilitar retorno em fluxos profundos.
- [ ] Acessibilidade: contraste suficiente, labels e aria-labels, navegação por teclado em formulários e botões.
- [ ] Feedback visual: loading, sucesso e erro claros (snackbar, backdrop, alert), uso de ícones e cores para reforço.
- [ ] Personalização e empatia: modo escuro/claro, mensagens de boas-vindas e dicas contextuais para novos usuários.
- [ ] Mobile first: todos os fluxos testados em dispositivos móveis, touch targets grandes, menus simplificados.
- [ ] Testes com usuários reais: coletar feedback de comerciantes e clientes sobre usabilidade e clareza.

## Melhorias em andamento/próximas tarefas

- [ ] Revisar acessibilidade (a11y): navegação por teclado, ARIA, contraste, foco visível
- [ ] Expandir testes automatizados (unitários, integração, e2e)
- [ ] Refatorar componentes para máxima reusabilidade
- [ ] Adicionar onboarding, tooltips e mensagens de ajuda
- [ ] Implementar CI/CD (GitHub Actions)
- [ ] Documentação técnica e de API (Swagger/OpenAPI)
- [ ] Analytics de uso (Google Analytics, Matomo ou Plausible)
- [ ] Monitoramento de erros (Sentry, LogRocket)
- [ ] Dark mode e personalização de temas
- [ ] Internacionalização (i18n) e suporte multilíngue

## Funcionalidades profissionais sugeridas (Frontend)

- [ ] Busca e filtros avançados (nome, categoria, preço, avaliação, localização)
- [ ] Página de favoritos (usuário pode favoritar comércios/produtos)
- [ ] Notificações em tempo real (WebSocket ou polling)
- [ ] Upload e otimização de imagens (compressão, preview, drag & drop)
- [ ] Perfil público de comerciante e cliente
- [ ] Página de histórico de compras/ações do usuário
- [ ] Dashboard analítico para comerciante (vendas, acessos, avaliações)
- [ ] Integração com mapas (Google Maps/Leaflet) para localização de comércios
- [ ] Compartilhamento social (WhatsApp, Facebook, Instagram)
- [ ] PWA: suporte a instalação e funcionamento offline
- [ ] Skeleton loading e lazy loading de listas
- [ ] Componentes acessíveis customizados (inputs, selects, modais)

## Funcionalidades profissionais sugeridas (Backend)

- [ ] API RESTful completa e versionada
- [ ] Autenticação OAuth2/social login (Google, Facebook, etc.)
- [ ] Permissões e papéis avançados (admin, comerciante, cliente)
- [ ] Logs estruturados e monitoramento (Winston, Morgan, Sentry)
- [ ] Rate limiting e proteção contra brute force
- [ ] Webhooks para integrações externas
- [ ] Exportação de dados (CSV, Excel, PDF)
- [ ] Notificações por e-mail (nodemailer) e push notification
- [ ] Agendamento de tarefas (agenda, cron)
- [ ] API pública/documentada para integrações
- [ ] Testes automatizados backend (Jest, Supertest)
- [ ] Backup e restore automatizado do banco de dados
- [ ] Auditoria de ações sensíveis (logs de alteração/exclusão)

## Tarefas já concluídas

- Responsividade aprimorada nos principais containers e cards (Dashboard, ListaComercios, DetalheComercio)
- Correção de bugs críticos de sintaxe e estrutura de componentes (JSX, imports, return)
- Estrutura dos componentes revisada para garantir funcionamento em todos os dispositivos
- Feedback visual global (snackbar, loading, confirmação)
- Loading global em todas as requisições
- Navbar adaptativa conforme tipo de usuário
- Padronização de formulários e feedback
- Breadcrumbs para navegação contextual
- Edição e exclusão de produtos (frontend)
- Atualização automática das listas após editar/excluir produto
- Confirmação visual para exclusão de produto (Dialog)
- Rotas protegidas para atualização de perfil e cadastro de produto
- Log detalhado de erros no backend
- Validação de vínculo entre produto e comércio

---
