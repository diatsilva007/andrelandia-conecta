// Excluir avaliação (apenas comerciante dono do comércio)
export const excluirAvaliacao = async (req, res) => {
  try {
    const { id } = req.params; // id da avaliação
    const usuarioId = req.usuario.id;
    // Buscar avaliação e comércio relacionado
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: Number(id) },
      include: { comercio: true },
    });
    if (!avaliacao) {
      return res.status(404).json({ error: "Avaliação não encontrada." });
    }
    // Buscar usuário dono do comércio
    const comercio = avaliacao.comercio;
    const comercioDb = await prisma.comercio.findUnique({
      where: { id: comercio.id },
      include: { usuario: true },
    });
    // Só o comerciante dono pode excluir
    if (!comercioDb || comercioDb.usuarioId !== usuarioId) {
      return res
        .status(403)
        .json({ error: "Apenas o dono do comércio pode excluir avaliações." });
    }
    await prisma.avaliacao.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir avaliação." });
  }
};
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listarAvaliacoes = async (req, res) => {
  try {
    const { comercioId } = req.params;
    const avaliacoes = await prisma.avaliacao.findMany({
      where: { comercioId: Number(comercioId) },
      include: { usuario: { select: { id: true, nome: true } } },
      orderBy: { criadoEm: "desc" },
    });
    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar avaliações." });
  }
};

export const criarAvaliacao = async (req, res) => {
  try {
    const { comercioId } = req.params;
    const { nota, comentario } = req.body;
    const usuarioId = req.usuario.id;
    if (!nota || nota < 1 || nota > 5) {
      return res.status(400).json({ error: "Nota deve ser entre 1 e 5." });
    }
    const nova = await prisma.avaliacao.create({
      data: {
        nota,
        comentario,
        usuarioId,
        comercioId: Number(comercioId),
      },
      include: { usuario: { select: { id: true, nome: true } } },
    });
    res.status(201).json(nova);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar avaliação." });
  }
};
