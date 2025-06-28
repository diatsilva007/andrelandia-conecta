import { Router } from "express";
import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  removerProduto,
} from "../controllers/produtoController.js";
import { autenticarToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", listarProdutos);
router.post("/", autenticarToken, criarProduto);
router.put("/:id", autenticarToken, atualizarProduto);
router.delete("/:id", autenticarToken, removerProduto);

export default router;
