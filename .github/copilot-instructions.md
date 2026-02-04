# Guia para Agentes de IA — Andrelândia Conecta

Este monorepo implementa uma plataforma para gestão e visibilidade do comércio local de Andrelândia/MG. O foco é UX profissional, integração segura e evolução rápida.

## Arquitetura e Fluxo de Dados

**Stack:** React (Vite) + Material UI + Express + Prisma + PostgreSQL

**Frontend → Backend:**

- Frontend consome API REST em `http://localhost:3333`
- Autenticação via JWT no header `Authorization: Bearer <token>`
- Estado global de usuário via `UserContext.jsx` (restaura token do localStorage em `/auth/me`)
- Feedback visual via `SnackbarContext.jsx` (componente `components/SnackbarContext.jsx`)

**Backend → Database:**

- Prisma ORM gerencia schema em `backend/prisma/schema.prisma`
- **CRÍTICO:** Cada controller importa seu próprio `PrismaClient` localmente (nunca singleton global)
- Exemplo: `backend/src/controllers/comercioController.js` linha 22: `import { PrismaClient } from "@prisma/client";`

**Entidades principais:** Comercio, Produto, Usuario, Avaliacao, Pedido, ItemPedido

## Padrões Obrigatórios

### Frontend

1. **Feedback global (NUNCA local):**

   ```jsx
   const { setSnackbar } = useSnackbar();
   setSnackbar({ open: true, message: "Sucesso!", severity: "success" });
   ```

   Veja `ListaComercios.jsx` linha 60 e 149-152.

2. **Loading global:**
   Use `<LoadingBackdrop open={loading} />` para operações assíncronas. Exemplo: `PerfilPublico.jsx` linha 14 e 52.

3. **Navegação protegida:**

   ```jsx
   const { usuario, loadingUser } = useUser();
   useEffect(() => {
     if (!loadingUser && !usuario) navigate("/login");
   }, [usuario, loadingUser]);
   ```

4. **Breadcrumbs:**
   Sempre inclua `<BreadcrumbNav items={...} />` em páginas internas. Exemplo: `ListaComercios.jsx`.

5. **Animações:**
   Use `<AnimatedCard>`, `<PageTransition>` para microinterações. Nunca crie animações inline.

### Backend

1. **Controller isolado por entidade:**
   - `comercioController.js` → apenas lógica de Comercio
   - `produtoController.js` → apenas lógica de Produto
   - NÃO cruze lógica entre controllers

2. **Prisma Client local:**

   ```javascript
   import { PrismaClient } from "@prisma/client";
   const prisma = new PrismaClient({});
   ```

   Cada controller deve ter sua própria instância (padrão atual).

3. **Uploads dedicados:**
   - Comercio: `uploadComercioImage.js` → salva em `uploads/comercios/`
   - Produto: `uploadProdutoImage.js` → salva em `uploads/produtos/`
   - Perfil: `uploadPerfilImage.js` → salva em `uploads/perfis/`
     Rota: `.single("imagem")` + `req.file.filename`

4. **Rotas protegidas:**

   ```javascript
   router.post("/", autenticarToken, uploadXXX.single("imagem"), criarXXX);
   ```

   Middleware `auth.js` valida JWT e injeta `req.usuario`.

5. **Paginação padrão:**
   ```javascript
   const { offset = 0, limit = 10 } = req.query;
   const [data, total] = await Promise.all([
     prisma.xxx.findMany({ skip: Number(offset), take: Number(limit) }),
     prisma.xxx.count(),
   ]);
   res.json({ data, total });
   ```
   Veja `comercioController.js` linha 6-28 e `produtoController.js` linha 1-26.

## Workflows Críticos

**Desenvolvimento:**

```powershell
# Backend (porta 3333)
cd backend
npm install
# Configure .env: DATABASE_URL, JWT_SECRET
npx prisma migrate dev
npm run dev

# Frontend (porta 5173)
cd frontend
npm install
npm run dev
```

**Tasks do VS Code:**

- `Dev Backend` → roda nodemon em `/backend`
- `Dev Frontend` → roda Vite em `/frontend`

**Nova migration:**

```powershell
cd backend
npx prisma migrate dev --name adiciona_campo_x
```

**Adicionar novo modelo:**

1. Edite `backend/prisma/schema.prisma`
2. Rode `npx prisma migrate dev --name novo_modelo`
3. Crie controller dedicado em `backend/src/controllers/`
4. Crie rotas em `backend/src/routes/`
5. Registre em `backend/src/index.js`

## Integrações e Dependências

**Frontend:**

- `react-router-dom` → navegação SPA
- `@mui/material` → componentes UI
- `framer-motion` → animações (PageTransition, AnimatedCard)
- `axios` → chamadas HTTP (configure base URL para produção)
- `react-leaflet` → mapas (latitude/longitude em Comercio)

**Backend:**

- `express` → API REST
- `@prisma/client` → ORM
- `bcryptjs` → hash de senhas
- `jsonwebtoken` → autenticação
- `multer` → upload de arquivos
- `cors` → habilita requests cross-origin

**Redefinição de senha:**

1. POST `/auth/esqueci-senha` → gera token e salva em `Usuario.resetToken`
2. POST `/auth/redefinir-senha/:token` → valida token e atualiza senha
3. Veja `authController.js` linhas 32-68.

## Prioridades e Bugs

Consulte sempre [`frontend/TODO.md`](../frontend/TODO.md) para:

- Melhorias de UX/UI em andamento
- Bugs reportados
- Features planejadas (onboarding, analytics, CI/CD)

## Convenções de Código

- **Não** use `console.log` em produção (use `console.error` para erros)
- Variáveis em camelCase, componentes em PascalCase
- Sempre valide `req.usuario` em rotas protegidas
- Normalize strings com `normalize("NFD").replace(/[\u0300-\u036f]/g, "")` para buscas
- Tipos numéricos no Prisma: converta explicitamente (`Number(id)`, `parseFloat(preco)`)
- Coordenadas geográficas: valide `latitude`/`longitude` como `Float?` no schema

## Troubleshooting

**"Token inválido ou expirado":**

- Verifique `JWT_SECRET` no `.env`
- UserContext restaura token em `/auth/me` (linha 12-46)

**"Prisma Client não inicializado":**

- Rode `npx prisma generate` em `/backend`

**Upload falha:**

- Confirme middleware correto (`uploadComercioImage`, `uploadProdutoImage`, `uploadPerfilImage`)
- Verifique permissões da pasta `uploads/`

**Duplicação de Prisma Client:**

- Confirme que cada controller instancia localmente (não importe de arquivo compartilhado)

---

> **Antes de criar novos padrões**, busque exemplos em arquivos existentes. Para mudanças estruturais, proponha primeiro e aguarde aprovação.
