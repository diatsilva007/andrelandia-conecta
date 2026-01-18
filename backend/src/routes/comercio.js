import { Router } from "express";
import {
  listarComercios,
  criarComercio,
  atualizarComercio,
  removerComercio,
  buscarComercioPorId,
} from "../controllers/comercioController.js";

const router = Router();

import { autenticarToken } from "../middlewares/auth.js";
import { uploadComercioImage } from "../middlewares/uploadComercioImage.js";

router.get("/", listarComercios);
router.get("/:id", buscarComercioPorId);
router.post(
  "/",
  autenticarToken,
  uploadComercioImage.single("imagem"),
  criarComercio,
);
// Removido rota duplicada sem middleware de upload
router.put(
  "/:id",
  autenticarToken,
  uploadComercioImage.single("imagem"),
  atualizarComercio,
);
router.delete("/:id", autenticarToken, removerComercio);

export default router;
