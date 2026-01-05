import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import comercioRoutes from "./routes/comercio.js";
import produtoRoutes from "./routes/produto.js";
import usuarioRoutes from "./routes/usuario.js";
import authRoutes from "./routes/auth.js";
import avaliacaoRoutes from "./routes/avaliacao.js";

// Configura variáveis de ambiente
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "API Plataforma de Gestão e Visibilidade para o Comércio Local de Andrelândia MG e região"
  );
});

app.use("/comercios", comercioRoutes);
app.use("/produtos", produtoRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/auth", authRoutes);
app.use("/", avaliacaoRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
