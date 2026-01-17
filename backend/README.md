# Backend

API Node.js com Express e Prisma para a Plataforma de Gestão e Visibilidade do Comércio Local de Andrelândia/MG e região.

## Scripts principais

- `npm run dev`: inicia o servidor em modo desenvolvimento
- `npm start`: inicia o servidor em modo produção

Configure o banco de dados PostgreSQL e personalize as rotas conforme a necessidade do seu projeto.

# Checklist de Prontidão para Produção (Deploy)

## Funcionalidades

- [ ] Todas as rotas essenciais implementadas e testadas
- [ ] CRUD completo de comércio, produto, usuário e avaliação
- [ ] Autenticação JWT protegendo rotas sensíveis
- [ ] Redefinição de senha funcional

## Qualidade e Segurança

- [ ] Validação de dados em todas as rotas
- [ ] Middleware de autenticação aplicado corretamente
- [ ] Prisma Client importado apenas por controller
- [ ] Dados sensíveis não expostos em logs ou respostas
- [ ] Senhas sempre criptografadas
- [ ] Uploads de imagem validados (tipo/tamanho)

## Banco de Dados

- [ ] Migrations aplicadas e banco consistente
- [ ] Variáveis de ambiente (.env) configuradas para produção
- [ ] Testes manuais de integridade dos dados

## Infraestrutura

- [ ] Scripts de build/teste funcionam
- [ ] Dockerfile e docker-compose revisados (se usar Docker)
- [ ] Documentação de deploy (README ou Wiki)
- [ ] Variáveis de ambiente para produção separadas

## Testes

- [ ] Fluxos principais testados manualmente
- [ ] Testes automatizados básicos (Supertest, se possível)

## Monitoramento e Logs

- [ ] Logs de erro e acesso configurados
- [ ] Monitoramento básico (ex: uptime, erros)

## CI/CD (opcional)

- [ ] Pipeline de build/deploy automatizado

---

> Marque cada item conforme for validando. Quando todos estiverem completos, o backend estará pronto para produção!
