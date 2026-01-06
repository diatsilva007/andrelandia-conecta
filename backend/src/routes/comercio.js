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

router.get("/", listarComercios);
router.get("/:id", buscarComercioPorId);
router.post("/", autenticarToken, criarComercio);
router.put("/:id", autenticarToken, atualizarComercio);
router.delete("/:id", autenticarToken, removerComercio);

export default router;
