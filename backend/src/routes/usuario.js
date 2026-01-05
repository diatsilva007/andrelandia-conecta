import { Router } from "express";

import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  removerUsuario,
} from "../controllers/usuarioController.js";
import { autenticarToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", listarUsuarios);
router.post("/", criarUsuario);
router.put("/:id", autenticarToken, atualizarUsuario);
router.delete("/:id", autenticarToken, removerUsuario);

export default router;
