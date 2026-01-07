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
router.get("/:id", async (req, res, next) => {
  // Controller buscarProdutoPorId
  const { buscarProdutoPorId } = await import(
    "../controllers/produtoController.js"
  );
  return buscarProdutoPorId(req, res, next);
});
router.post("/", autenticarToken, criarProduto);
router.put("/:id", autenticarToken, atualizarProduto);
router.delete("/:id", autenticarToken, removerProduto);

export default router;
