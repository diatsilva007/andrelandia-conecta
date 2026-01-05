import { Router } from "express";
import {
  listarAvaliacoes,
  criarAvaliacao,
} from "../controllers/avaliacaoController.js";
import { autenticarToken } from "../middlewares/auth.js";

const router = Router();

// Listar avaliações de um comércio
router.get("/comercios/:comercioId/avaliacoes", listarAvaliacoes);
// Criar avaliação (autenticado)
router.post(
  "/comercios/:comercioId/avaliacoes",
  autenticarToken,
  criarAvaliacao
);

export default router;
