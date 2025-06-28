import { Router } from "express";
import {
  login,
  esqueciSenha,
  redefinirSenha,
} from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/esqueci-senha", esqueciSenha);
router.post("/redefinir-senha/:token", redefinirSenha);

export default router;
