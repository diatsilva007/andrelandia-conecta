import { Router } from "express";
import {
  listarComercios,
  criarComercio,
  atualizarComercio,
  removerComercio,
  buscarComercioPorId,
  analyticsComercio,
  analyticsComercioDetalhado,
} from "../controllers/comercioController.js";

const router = Router();

import { autenticarToken } from "../middlewares/auth.js";
import { uploadComercioImage } from "../middlewares/uploadComercioImage.js";

router.get("/", listarComercios);
router.get("/:id", buscarComercioPorId);
router.get("/:id/analytics", analyticsComercio); // resumo
router.get("/:id/analytics-detalhado", analyticsComercioDetalhado); // detalhado para gráficos
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
