import { Router } from "express";
import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  removerProduto,
} from "../controllers/produtoController.js";

import { autenticarToken } from "../middlewares/auth.js";
import { uploadProdutoImage } from "../middlewares/uploadProdutoImage.js";

const router = Router();

router.get("/", listarProdutos);
router.get("/:id", async (req, res, next) => {
  // Controller buscarProdutoPorId
  const { buscarProdutoPorId } = await import(
    "../controllers/produtoController.js"
  );
  return buscarProdutoPorId(req, res, next);
});
router.post(
  "/",
  autenticarToken,
  uploadProdutoImage.single("imagem"),
  criarProduto
);
router.put("/:id", autenticarToken, atualizarProduto);
router.delete("/:id", autenticarToken, removerProduto);

export default router;
