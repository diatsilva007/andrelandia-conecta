[![Andrelândia Conecta](https://img.shields.io/badge/Andrel%C3%A2ndia%20Conecta-Open%20Source-blue)](https://github.com/diatsilva007/andrelandia-conecta)

# Andrelândia Conecta

Plataforma para gestão, visibilidade e fortalecimento do comércio local de Andrelândia/MG e região. Monorepo com frontend e backend integrados, focado em UX profissional, integração segura e evolução contínua.

## Objetivo

Facilitar a divulgação, gestão e conexão entre comerciantes e consumidores da região, promovendo o desenvolvimento local.

## Estrutura do Projeto

- **frontend/**: React (Vite), Material UI, animações, responsividade mobile-first, feedback global, navegação protegida, filtros avançados, dashboard analítico, integração com mapas e uploads de imagem.
- **backend/**: Node.js, Express, Prisma ORM, PostgreSQL. Autenticação JWT, controllers organizados, uploads validados, migrations via Prisma.
- **Banco de dados**: PostgreSQL

> Para instruções detalhadas de cada módulo, consulte os READMEs em `frontend/README.md` e `backend/README.md`.

## Tecnologias Utilizadas

- React, Vite, JavaScript/JSX
- Node.js, Express
- Prisma ORM
- PostgreSQL
- Docker (sugestão para produção)

## Como Rodar o Projeto

### Pré-requisitos

- Node.js >= 18
- npm
- PostgreSQL

### Instalação

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
3. Configure o banco de dados PostgreSQL e atualize o arquivo `.env` em `backend/`.
4. Execute as migrations do Prisma:
   ```bash
   cd ../backend
   npx prisma migrate dev
   ```

### Ambiente de Desenvolvimento

- Para iniciar o backend:
  ```bash
  npm run dev
  ```
- Para iniciar o frontend:
  ```bash
  npm run dev
  ```

Acesse o frontend em `http://localhost:5173` (ou porta configurada).

### Ambiente de Produção

Sugestão: Utilize Docker para orquestrar os serviços.

## Funcionalidades principais

- Cadastro, edição e exclusão de comércios, produtos e usuários
- Autenticação JWT e rotas protegidas
- Dashboard analítico para comerciantes
- Busca e filtros avançados
- Upload e otimização de imagens
- Página de favoritos
- Integração com mapas (Google Maps/Leaflet)
- Responsividade total e acessibilidade básica
- Feedback visual global (snackbar, loading, erros)

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
```

## Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m "feat: minha feature"`
4. Envie um pull request

## Roadmap de Melhorias

- Grid responsivo com cards
- Filtros avançados + busca instantânea
- Paginação tradicional
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

- Responsividade aprimorada nos principais containers e cards (Dashboard, ListaComercios, DetalheComercio)
- Correção de bugs críticos de sintaxe e estrutura de componentes (JSX, imports, return)
- Estrutura dos componentes revisada para garantir funcionamento em todos os dispositivos
- Feedback visual global (snackbar, loading, confirmação)
- Próximos passos: revisar acessibilidade, expandir testes e finalizar detalhes de UI/UX

## Dicas para desenvolvedores

- Sempre utilize os componentes globais de feedback visual (`SnackbarContext`, `GlobalSnackbar`, `LoadingBackdrop`)
- Siga o padrão de responsividade e acessibilidade já implementado nas páginas principais
- Consulte o arquivo TODO.md para prioridades e próximos passos

---

_Última atualização: 18/01/2026_

## Licença

Este projeto está sob a licença MIT.

## Contato

- Autor: Diogo Ataide Silva
- Email: diogo.ataidee@gmail.com
- [LinkedIn](https://www.linkedin.com/in/diatsilva)
- [Portfolio](https://www.diogoataide.dev)
