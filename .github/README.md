# Andrelândia Conecta

[![Andrelândia Conecta](https://img.shields.io/badge/Andrel%C3%A2ndia%20Conecta-Open%20Source-blue)](https://github.com/diatsilva007/andrelandia-conecta)

> Plataforma completa para gestão, visibilidade e fortalecimento do comércio local de Andrelândia/MG e região. Monorepo com frontend (React/Vite) e backend (Express/Prisma/PostgreSQL), focado em UX, segurança, performance e evolução contínua.

---

## Objetivo

Facilitar a divulgação, gestão e conexão entre comerciantes e consumidores da região, promovendo o desenvolvimento local e digital.

## Arquitetura

- **Frontend:**
  - React (Vite), Material UI, framer-motion, react-router-dom, react-leaflet
  - Mobile-first, responsivo, animações, navegação protegida, feedback global, filtros avançados, dashboard analítico, integração com mapas, uploads de imagem
  - Autenticação JWT, favoritos, breadcrumbs, loading global, microinterações
- **Backend:**
  - Node.js, Express, Prisma ORM, PostgreSQL
  - Autenticação JWT, controllers isolados, uploads validados, migrations via Prisma
  - Paginação, validação, segurança, uploads dedicados
- **Banco de dados:**
  - PostgreSQL

## Tecnologias

- React, Vite, JavaScript/JSX
- Node.js, Express
- Prisma ORM
- PostgreSQL
- Docker (recomendado para produção)

## Instalação e Execução

### Pré-requisitos

- Node.js >= 18
- npm
- PostgreSQL

### Passos rápidos

1. Clone o repositório:
   ```bash
   git clone https://github.com/diatsilva007/andrelandia-conecta.git
   cd andrelandia-conecta
   ```
2. Instale as dependências:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Configure o banco de dados PostgreSQL e o arquivo `.env` em `backend/`.
4. Execute as migrations do Prisma:
   ```bash
   cd backend
   npx prisma migrate dev
   ```
5. Inicie os servidores:
   - Backend: `npm run dev` (porta padrão: 3333)
   - Frontend: `npm run dev` (porta padrão: 5173)

Acesse o frontend em [http://localhost:5173](http://localhost:5173).

### Produção

- Recomenda-se Docker para orquestração dos serviços.

## Funcionalidades

- Cadastro, edição e exclusão de comércios, produtos e usuários
- Autenticação JWT e rotas protegidas
- Dashboard analítico para comerciantes
- Busca e filtros avançados
- Upload e otimização de imagens
- Página de favoritos
- Integração com mapas (Leaflet)
- Responsividade total e acessibilidade
- Feedback visual global (snackbar, loading, erros)
- Breadcrumbs e microinterações
- Exclusão em cascata
- PWA (planejado)

## Estrutura das Pastas

```
backend/
  src/
    controllers/
    middlewares/
    routes/
  prisma/
    schema.prisma
frontend/
  src/
    components/
    pages/
    contexts/
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m "feat: minha feature"`
4. Envie um pull request

## Roadmap & Melhorias

- Grid responsivo com cards
- Filtros avançados + busca instantânea
- Paginação
- Skeleton loading
- Destaques/ordenadores
- Acessibilidade aprimorada
- PWA e notificações em tempo real
- Internacionalização (i18n)
- Testes automatizados (Jest, React Testing Library, Supertest)
- Dockerização
- CI/CD (GitHub Actions)
- Documentação da API (Swagger)
- Monitoramento e logs
- Validação de dados e segurança

> Consulte `/frontend/TODO.md` para planejamento detalhado e próximos passos.

## Observações e melhorias recentes

- Badge de favoritos padronizado (desktop/mobile)
- Aurora background responsivo e elegante
- Correção de rotas de produto (visualização individual)
- Feedback visual global aprimorado
- Responsividade e acessibilidade revisadas
- Correção de bugs críticos de sintaxe e estrutura
- Estrutura dos componentes revisada para garantir funcionamento em todos os dispositivos
- Próximos passos: expandir testes, finalizar detalhes de UI/UX, implementar PWA

## Dicas para desenvolvedores

- Utilize sempre os componentes globais de feedback visual (`SnackbarContext`, `GlobalSnackbar`, `LoadingBackdrop`)
- Siga o padrão de responsividade e acessibilidade já implementado
- Consulte o arquivo TODO.md para prioridades e próximos passos

---

_Última atualização: 06/02/2026_

## Licença

Este projeto está sob a licença MIT.

## Contato

- Autor: Diogo Ataide Silva
- Email: diogo.ataidee@gmail.com
- [LinkedIn](https://www.linkedin.com/in/diatsilva)
- [Portfolio](https://www.diogoataide.dev)
