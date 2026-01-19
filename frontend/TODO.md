# TODO - Andrelândia Conecta

### UX/UI Profissional

- [ ] Personalização e empatia: modo escuro/claro, mensagens de boas-vindas e dicas contextuais para novos usuários.

### Melhorias em andamento/próximas tarefas

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
- [ ] Skeleton loading e lazy loading de listas
- [ ] Componentes acessíveis customizados (inputs, selects, modais)

## Funcionalidades sugeridas (Frontend)

- [ ] Notificações em tempo real (WebSocket ou polling)
- [ ] PWA: suporte a instalação e funcionamento offline

## Funcionalidades sugeridas (Backend)

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

### Nova página principal moderna e funcional

- [ ] Header com logo e slogan
- [ ] Busca rápida centralizada (comércios, produtos, serviços)
- [ ] Carrossel/grid de destaques: comércios, promoções, novidades
- [ ] Botões de ação: “Ver todos os comércios”, “Ver produtos”, “Cadastrar meu comércio”
- [ ] Mapa interativo com localização dos comércios (opcional)
- [ ] Acesso rápido: Favoritos, Login/Cadastro, Dashboard
- [ ] Layout 100% responsivo, microinterações suaves
- [ ] Rodapé com informações de contato, redes sociais, termos de uso
- [ ] Visual limpo, cores do projeto, imagens reais dos comércios
- [ ] Chamadas claras para ação e navegação intuitiva

## Tarefas já concluídas

- [x] Responsividade aprimorada nos principais containers e cards (Dashboard, ListaComercios, DetalheComercio)
- [x] Correção de bugs críticos de sintaxe e estrutura de componentes (JSX, imports, return)
- [x] Estrutura dos componentes revisada para garantir funcionamento em todos os dispositivos
- [x] Feedback visual global (snackbar, loading, confirmação)
- [x] Loading global em todas as requisições
- [x] Navbar adaptativa conforme tipo de usuário
- [x] Padronização de formulários e feedback
- [x] Breadcrumbs para navegação contextual
- [x] Edição e exclusão de produtos (frontend)
- [x] Atualização automática das listas após editar/excluir produto
- [x] Confirmação visual para exclusão de produto (Dialog)
- [x] Rotas protegidas para atualização de perfil e cadastro de produto
- [x] Log detalhado de erros no backend
- [x] Validação de vínculo entre produto e comércio
- [x] Adaptação responsiva incremental (Dashboard, Login, Cadastro, etc.)
- [x] Usar breakpoints do Material UI (`xs`, `sm`, `md`, `lg`) em containers, grids, cards e botões
- [x] Garantir touch targets adequados (mínimo 48px)
- [x] Testar navegação, menus, modais e tooltips em telas pequenas
- [x] Validar microinterações e animações em mobile
- [x] Ajustar media queries customizadas se necessário (App.css, index.css)
- [x] Testar em dispositivos reais e simuladores
- [x] Revisar todos os fluxos para mobile antes de novas features complexas
- [x] Identidade visual consistente: paleta de cores exclusiva, logotipo simples, uso padronizado em todos os elementos.
- [x] Tipografia e hierarquia: no máximo 2 famílias de fonte, destaque para títulos/botões, hierarquia visual clara.
- [x] Espaçamento e alinhamento: espaçamento consistente entre cards, seções e botões; uso de grids e containers para centralização.
- [x] Microinterações e animações suaves: hover em botões/cards, transições suaves em modais/tooltips/navegação.
- [x] Navegação clara: navbar sempre visível (fixa ou drawer), breadcrumbs para facilitar retorno em fluxos profundos.
- [x] Acessibilidade: contraste suficiente, labels e aria-labels, navegação por teclado em formulários e botões.
- [x] Feedback visual: loading, sucesso e erro claros (snackbar, backdrop, alert), uso de ícones e cores para reforço.
- [x] Mobile first: todos os fluxos testados em dispositivos móveis, touch targets grandes, menus simplificados.
- [x] Testes com usuários reais: coletar feedback de comerciantes e clientes sobre usabilidade e clareza.
- [x] Busca e filtros avançados (nome, categoria, preço, avaliação, localização)
- [x] Página de favoritos (usuário pode favoritar comércios/produtos)
- [x] Upload e otimização de imagens (compressão, preview, drag & drop)
- [x] Perfil público de comerciante e cliente
- [x] Página de histórico de compras/ações do usuário
- [x] Dashboard analítico para comerciante (vendas, acessos, avaliações)
- [x] Integração com mapas (Google Maps/Leaflet) para localização de comércios
- [x] Compartilhamento social (WhatsApp, Facebook, Instagram)

# Checklist de Prontidão para Produção (Deploy)

## Funcionalidades

- [ ] Login, cadastro e autenticação JWT funcionando
- [ ] CRUD completo de comércio, produto e usuário
- [ ] Redefinição de senha testada
- [ ] Feedback visual global (snackbar, loading, erros)
- [ ] Navegação protegida (redireciona para login se não autenticado)

## Qualidade e UX

- [ ] Responsividade em mobile/tablet/desktop
- [ ] Acessibilidade básica (labels, navegação por teclado)
- [ ] Microinterações e animações principais
- [ ] Textos e mensagens revisados

## Backend

- [ ] Todas as rotas protegidas corretamente
- [ ] Validação de dados no backend
- [ ] Prisma Client importado apenas por controller
- [ ] Variáveis de ambiente (.env) configuradas
- [ ] Migrations aplicadas e banco consistente

## Segurança

- [ ] Dados sensíveis não expostos em logs ou respostas
- [ ] Senhas sempre criptografadas
- [ ] Uploads de imagem validados (tipo/tamanho)

## Infraestrutura

- [ ] Scripts de build/teste funcionam
- [ ] Dockerfile e docker-compose revisados (se usar Docker)
- [ ] Documentação de deploy (README ou Wiki)
- [ ] Variáveis de ambiente para produção separadas

## Testes

- [ ] Fluxos principais testados manualmente
- [ ] Testes automatizados básicos (se possível)

## Monitoramento e Logs

- [ ] Logs de erro e acesso configurados
- [ ] Monitoramento básico (ex: uptime, erros)

## CI/CD (opcional)

- [ ] Pipeline de build/deploy automatizado

---

> Marque cada item conforme for validating. Quando todos estiverem completos, o projeto estará pronto para produção!
