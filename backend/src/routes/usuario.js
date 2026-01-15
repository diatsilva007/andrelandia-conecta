import { Router } from "express";

import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  removerUsuario,
} from "../controllers/usuarioController.js";
import { autenticarToken } from "../middlewares/auth.js";
import { uploadPerfilImage } from "../middlewares/uploadPerfilImage.js";

const router = Router();

router.get("/", listarUsuarios);
router.post("/", criarUsuario);
router.put(
  "/:id",
  autenticarToken,
  uploadPerfilImage.single("imagem"),
  atualizarUsuario
);
router.delete("/:id", autenticarToken, removerUsuario);

export default router;
