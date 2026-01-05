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
