// Listar todos os produtos
export const listarProdutos = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: { comercio: true },
    });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos." });
  }
};
// Buscar produto por ID
export const buscarProdutoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await prisma.produto.findUnique({
      where: { id: Number(id) },
      include: { comercio: true },
    });
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produto." });
  }
};
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const criarProduto = async (req, res) => {
  try {
    const { nome, preco, descricao } = req.body;
    // Aceita comercioId do corpo ou da query string
    let comercioId = req.body.comercioId || req.query.comercioId;
    comercioId = Number(comercioId);
    if (!comercioId || isNaN(comercioId)) {
      return res.status(400).json({ error: "comercioId inválido ou ausente." });
    }
    let imagemUrl = null;
    if (req.file) {
      imagemUrl = `/uploads/produtos/${req.file.filename}`;
    }
    const novo = await prisma.produto.create({
      data: {
        nome,
        preco: parseFloat(preco),
        descricao,
        comercioId,
        imagem: imagemUrl,
      },
    });
    res.status(201).json(novo);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: "Erro ao criar produto." });
  }
};
// ...existing code...

export const atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, descricao, comercioId } = req.body;
    const atualizado = await prisma.produto.update({
      where: { id: Number(id) },
      data: { nome, preco, descricao, comercioId },
    });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
};

export const removerProduto = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.produto.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover produto." });
  }
};
