import { Router } from "express";
import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  removerUsuario,
} from "../controllers/usuarioController.js";

const router = Router();

router.get("/", listarUsuarios);
router.post("/", criarUsuario);
router.put("/:id", atualizarUsuario);
router.delete("/:id", removerUsuario);

export default router;
