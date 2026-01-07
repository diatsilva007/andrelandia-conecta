import { Router } from "express";
import {
  listarAvaliacoes,
  criarAvaliacao,
  excluirAvaliacao,
} from "../controllers/avaliacaoController.js";
import { autenticarToken } from "../middlewares/auth.js";

const router = Router();

// Excluir avaliação (apenas comerciante dono do comércio)
router.delete("/avaliacoes/:id", autenticarToken, excluirAvaliacao);

// Listar avaliações de um comércio
router.get("/comercios/:comercioId/avaliacoes", listarAvaliacoes);
// Criar avaliação (autenticado)
router.post(
  "/comercios/:comercioId/avaliacoes",
  autenticarToken,
  criarAvaliacao
);

export default router;
