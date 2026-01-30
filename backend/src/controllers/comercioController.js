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
    // Suporte a paginação via query params
    const { offset = 0, limit = 10 } = req.query;
    const skip = Number(offset) || 0;
    const take = Number(limit) || 10;

    // Busca paginada
    const [comercios, total] = await Promise.all([
      prisma.comercio.findMany({
        skip,
        take,
        include: {
          produtos: true,
          avaliacoes: true,
        },
        orderBy: { id: "desc" },
      }),
      prisma.comercio.count(),
    ]);

    // Corrige tipos para o frontend (Leaflet exige número)
    const comerciosCorrigidos = comercios.map((com) => ({
      ...com,
      latitude: com.latitude !== null ? Number(com.latitude) : null,
      longitude: com.longitude !== null ? Number(com.longitude) : null,
    }));

    res.json({ data: comerciosCorrigidos, total });
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar comércios." });
  }
};

export const criarComercio = async (req, res) => {
  try {
    const {
      nome,
      categoria,
      descricao,
      endereco,
      telefone,
      latitude,
      longitude,
    } = req.body;
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }
    console.log(
      "[criarComercio] Latitude recebida:",
      latitude,
      "Longitude recebida:",
      longitude,
    );
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
        imagem: imagemUrl,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        usuarioId,
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
    const {
      nome,
      categoria,
      descricao,
      endereco,
      telefone,
      latitude,
      longitude,
    } = req.body;
    // Se endereco vier como array, pega o último valor string válido
    let enderecoFinal = endereco;
    if (Array.isArray(endereco)) {
      enderecoFinal =
        endereco.find((v) => typeof v === "string" && v !== "null") ||
        endereco[endereco.length - 1];
    }
    console.log(
      "[atualizarComercio] Valor recebido para endereco:",
      enderecoFinal,
    );
    const atualizado = await prisma.comercio.update({
      where: { id: Number(id) },
      data: {
        nome,
        categoria,
        descricao,
        endereco: enderecoFinal,
        telefone,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
      },
    });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar comércio." });
  }
};

export const removerComercio = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("[removerComercio] Tentando remover comércio com id:", id);
    await prisma.comercio.delete({ where: { id: Number(id) } });
    console.log("[removerComercio] Removido com sucesso id:", id);
    res.status(204).send();
  } catch (error) {
    console.error("[removerComercio] Erro ao remover:", error);
    res.status(500).json({ error: "Erro ao remover comércio." });
  }
};

// Handler para analytics do comércio (mock)
export const analyticsComercio = async (req, res) => {
  // Você pode evoluir para buscar dados reais do banco
  res.json({
    vendas: 0,
    acessos: 0,
    avaliacoes: 0,
  });
};
