// Histórico do usuário autenticado
export const historicoUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    // Compras: mock com campos esperados
    const compras = [
      {
        id: 1,
        produtoNome: "Produto Exemplo",
        data: new Date().toISOString(),
        valor: 99.9,
        comercioNome: "Comércio Exemplo",
      },
    ];
    // Avaliações feitas pelo usuário, ajustando campos
    const avaliacoesRaw = await prisma.avaliacao.findMany({
      where: { usuarioId },
      select: {
        id: true,
        nota: true,
        comentario: true,
        criadoEm: true,
        comercio: { select: { nome: true } },
      },
      orderBy: { criadoEm: "desc" },
    });
    const avaliacoes = avaliacoesRaw.map((a) => ({
      id: a.id,
      comercioNome: a.comercio?.nome || "",
      data: a.criadoEm,
      nota: a.nota,
      comentario: a.comentario,
    }));
    // Ações: mock com campos esperados
    const acoes = [
      {
        tipo: "login",
        data: new Date().toISOString(),
        descricao: "Login realizado",
      },
      {
        tipo: "atualizacao",
        data: new Date().toISOString(),
        descricao: "Perfil atualizado",
      },
    ];
    res.json({ compras, avaliacoes, acoes });
  } catch (error) {
    console.error("Erro ao buscar histórico do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar histórico do usuário." });
  }
};
export const perfilPublico = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        tipo: true,
        imagem: true,
        descricao: true,
      },
    });
    if (!usuario)
      return res.status(404).json({ error: "Usuário não encontrado." });
    // Se comerciante, buscar comércios vinculados
    let comercios = [];
    if (usuario.tipo === "comerciante") {
      comercios = await prisma.comercio.findMany({
        where: { usuarioId: usuario.id },
        select: {
          id: true,
          nome: true,
          categoria: true,
          imagem: true,
        },
      });
    }
    // Buscar avaliações recebidas (de produtos e comércios do usuário)
    let avaliacoes = [];
    if (usuario.tipo === "comerciante") {
      const comercioIds = comercios.map((c) => c.id);
      avaliacoes = await prisma.avaliacao.findMany({
        where: { comercioId: { in: comercioIds } },
        select: {
          id: true,
          nota: true,
          comentario: true,
          criadoEm: true,
          usuario: { select: { nome: true, imagem: true } },
        },
        orderBy: { criadoEm: "desc" },
        take: 5,
      });
    }
    // Para clientes, buscar favoritos (mock: vazio, pois localStorage é client-side)
    let favoritos = [];
    if (usuario.tipo === "cliente") {
      // Se desejar persistir favoritos, buscar de uma tabela; aqui retorna vazio
      favoritos = [];
    }
    res.json({
      ...usuario,
      comercios,
      avaliacoes,
      favoritos,
      mediaAvaliacao: avaliacoes.length
        ? (
            avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
          ).toFixed(1)
        : null,
      totalAvaliacao: avaliacoes.length,
    });
  } catch (error) {
    console.error("Erro no perfilPublico:", error);
    res.status(500).json({
      error: "Erro ao buscar perfil público.",
      details: error?.message,
    });
  }
};
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
    const { nome, email, senha, tipo = "cliente", descricao } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    const novo = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash, tipo, descricao },
    });
    res.status(201).json({
      id: novo.id,
      nome: novo.nome,
      email: novo.email,
      tipo: novo.tipo,
      descricao: novo.descricao,
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
    const { nome, email, senha, tipo, descricao } = req.body;
    const data = { nome, email, descricao };
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
      descricao: atualizado.descricao,
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
