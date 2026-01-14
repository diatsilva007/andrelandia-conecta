// Buscar comércio por ID
export const buscarComercioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const comercio = await prisma.comercio.findUnique({
      where: { id: Number(id) },
      include: {
        produtos: true,
        usuario: { select: { id: true, nome: true } },
      },
    });
    if (!comercio) {
      return res.status(404).json({ error: "Comércio não encontrado." });
    }
    // Para compatibilidade com frontend, incluir usuarioId na resposta
    res.json({ ...comercio, usuarioId: comercio.usuario?.id });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comércio." });
  }
};
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listarComercios = async (req, res) => {
  try {
    const comercios = await prisma.comercio.findMany({
      include: {
        produtos: true,
        avaliacoes: true,
      },
    });
    res.json(comercios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar comércios." });
  }
};

export const criarComercio = async (req, res) => {
  try {
    const { nome, categoria, descricao, endereco, telefone } = req.body;
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }
    let imagemUrl = null;
    if (req.file) {
      // Caminho relativo para servir a imagem depois
      imagemUrl = `/uploads/comercios/${req.file.filename}`;
    }
    const novo = await prisma.comercio.create({
      data: {
        nome,
        categoria,
        descricao,
        endereco,
        telefone,
        usuarioId,
        imagem: imagemUrl,
      },
    });
    res.status(201).json(novo);
  } catch (error) {
    console.error("Erro ao criar comércio:", error);
    res.status(500).json({ error: "Erro ao criar comércio." });
  }
};

export const atualizarComercio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, categoria, descricao, endereco, telefone } = req.body;
    const atualizado = await prisma.comercio.update({
      where: { id: Number(id) },
      data: { nome, categoria, descricao, endereco, telefone },
    });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar comércio." });
  }
};

export const removerComercio = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.comercio.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover comércio." });
  }
};
