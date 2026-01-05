import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const prisma = new PrismaClient();

export const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario)
      return res.status(401).json({ error: "Usuário ou senha inválidos." });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida)
      return res.status(401).json({ error: "Usuário ou senha inválidos." });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || "segredo",
      { expiresIn: "1d" }
    );
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao autenticar." });
  }
};

export const esqueciSenha = async (req, res) => {
  const { email } = req.body;
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.json({
        message: "Se o e-mail estiver cadastrado, você receberá instruções.",
      });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos
    await prisma.usuario.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });
    console.log(
      `Link de redefinição: http://localhost:5173/redefinir-senha/${token}`
    );
    res.json({
      message: "Se o e-mail estiver cadastrado, você receberá instruções.",
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao solicitar redefinição de senha." });
  }
};

export const redefinirSenha = async (req, res) => {
  const { token } = req.params;
  const { senha } = req.body;
  try {
    const usuario = await prisma.usuario.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      },
    });
    if (!usuario) {
      return res.status(400).json({ error: "Token inválido ou expirado." });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        senha: senhaHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });
    res.json({ message: "Senha redefinida com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao redefinir senha." });
  }
};
