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
router.get("/:id/publico", async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await import("../controllers/usuarioController.js");
    return usuario.perfilPublico(req, res);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar perfil público." });
  }
});
router.post("/", criarUsuario);
router.put(
  "/:id",
  autenticarToken,
  uploadPerfilImage.single("imagem"),
  atualizarUsuario
);
router.delete("/:id", autenticarToken, removerUsuario);

export default router;
