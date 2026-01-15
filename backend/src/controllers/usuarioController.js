import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import path from "path";

const prisma = new PrismaClient();

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários." });
  }
};

export const criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, tipo = "cliente" } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    const novo = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash, tipo },
    });
    res.status(201).json({
      id: novo.id,
      nome: novo.nome,
      email: novo.email,
      tipo: novo.tipo,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    // Só permite atualizar o próprio usuário (ou admin futuramente)
    if (!req.usuario || Number(id) !== req.usuario.id) {
      return res.status(403).json({ error: "Acesso negado." });
    }
    // Suporta multipart/form-data
    const { nome, email, senha, tipo } = req.body;
    const data = { nome, email };
    if (senha) data.senha = await bcrypt.hash(senha, 10);
    if (tipo) data.tipo = tipo;
    if (req.file) {
      data.imagem = `/uploads/perfis/${req.file.filename}`;
    }
    const atualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data,
    });
    res.json({
      id: atualizado.id,
      nome: atualizado.nome,
      email: atualizado.email,
      tipo: atualizado.tipo,
      imagem: atualizado.imagem,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

export const removerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.usuario.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover usuário." });
  }
};
