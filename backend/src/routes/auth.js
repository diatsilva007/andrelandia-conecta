import { Router } from "express";
import {
  login,
  esqueciSenha,
  redefinirSenha,
  me,
} from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/esqueci-senha", esqueciSenha);
router.post("/redefinir-senha/:token", redefinirSenha);
router.get("/me", me);

export default router;
