[![Andrelândia Conecta](https://img.shields.io/badge/Andrel%C3%A2ndia%20Conecta-Open%20Source-blue)](https://github.com/diatsilva007/andrelandia-conecta)

# Andrelândia Conecta

Plataforma de gestão e visibilidade para o comércio local de Andrelândia/MG e região. Este projeto é um monorepo que reúne frontend e backend para facilitar o desenvolvimento e manutenção.

## Objetivo

Facilitar a divulgação, gestão e conexão entre comerciantes e consumidores da região, promovendo o desenvolvimento local.

## Estrutura do Projeto

- **frontend/**: Aplicação web em React (Vite)
- **backend/**: API REST em Node.js (Express + Prisma)
- **Banco de dados**: PostgreSQL

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

### Ambiente de Produção

Sugestão: Utilize Docker para orquestrar os serviços.

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

- Filtros avançados por categoria, preço e avaliação na listagem de comércios
- Exclusão de avaliações restrita ao comerciante dono do comércio
- Feedback visual global (snackbar, loading, confirmação)
- Segurança: só o dono pode editar/excluir seus dados e avaliações
- Testes automatizados (Jest, React Testing Library, Supertest)
- Dockerização
- CI/CD (GitHub Actions)
- Documentação da API (Swagger)
- Monitoramento e logs
- Validação de dados e segurança

## Licença

Este projeto está sob a licença MIT.

## Contato

- Autor: Diogo Ataíde Silva
- Email: diatsilva007@gmail.com
- [LinkedIn](https://www.linkedin.com/in/diatsilva)
