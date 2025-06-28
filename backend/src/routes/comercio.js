import { Router } from "express";
import {
  listarComercios,
  criarComercio,
  atualizarComercio,
  removerComercio,
} from "../controllers/comercioController.js";

const router = Router();

router.get("/", listarComercios);
router.post("/", criarComercio);
router.put("/:id", atualizarComercio);
router.delete("/:id", removerComercio);

export default router;
