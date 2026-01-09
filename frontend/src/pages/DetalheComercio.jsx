import { useEffect, useState } from "react";
import { Rating, TextField } from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useSnackbar } from "../components/SnackbarContext.jsx";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AnimatedCard from "../components/AnimatedCard.jsx";

export default function DetalheComercio() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [comercio, setComercio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [novaAvaliacao, setNovaAvaliacao] = useState({
    nota: 0,
    comentario: "",
  });
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);
  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  })();
  const navigate = useNavigate();
  const { setSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [produtoExcluir, setProdutoExcluir] = useState(null);
  // Para exclusão de avaliação
  const [avaliacaoExcluir, setAvaliacaoExcluir] = useState(null);
  const [dialogAvaliacaoOpen, setDialogAvaliacaoOpen] = useState(false);
  const [excluindoAvaliacao, setExcluindoAvaliacao] = useState(false);
  // Para exclusão de produto
  const [excluindo, setExcluindo] = useState(false);

  // Buscar comércio
  const fetchComercio = () => {
    setLoading(true);
    axios
      .get(`http://localhost:3333/comercios/${id}`)
      .then((res) => setComercio(res.data))
      .catch(() => setComercio(null))
      .finally(() => setLoading(false));
  };
  // Buscar avaliações
  const fetchAvaliacoes = () => {
    axios
      .get(`http://localhost:3333/comercios/${id}/avaliacoes`)
      .then((res) => setAvaliacoes(res.data))
      .catch(() => setAvaliacoes([]));
  };

  useEffect(() => {
    fetchComercio();
    fetchAvaliacoes();
    // eslint-disable-next-line
  }, [id]);
  // Enviar avaliação
  const handleEnviarAvaliacao = async (e) => {
    e.preventDefault();
    setEnviandoAvaliacao(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3333/comercios/${id}/avaliacoes`,
        { nota: novaAvaliacao.nota, comentario: novaAvaliacao.comentario },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Avaliação enviada!",
        severity: "success",
      });
      setNovaAvaliacao({ nota: 0, comentario: "" });
      fetchAvaliacoes();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Erro ao enviar avaliação",
        severity: "error",
      });
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  if (!comercio)
    return (
      <Typography align="center" mt={8}>
        Comércio não encontrado.
      </Typography>
    );

  return (
    <Box
      p={{ xs: 1, sm: 3 }}
      bgcolor="background.default"
      minHeight="100vh"
      mt={{ xs: 7, sm: 8, md: 10 }}
    >
      <Box sx={{ maxWidth: 1200, mb: 3, mx: "auto" }}>
        <BreadcrumbNav
          items={[
            { label: "Início", to: "/" },
            { label: comercio.nome || "Detalhe do Comércio" },
          ]}
        />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap={{ xs: 1, sm: 2 }}
        mb={3}
        role="navigation"
        aria-label="Ações do comércio"
      >
        <Tooltip title="Voltar para a página inicial">
          <Button
            component={Link}
            to="/"
            variant="outlined"
            aria-label="Voltar para a página inicial"
            tabIndex={0}
            sx={{ outline: "none", ":focus": { boxShadow: 3 } }}
          >
            Voltar
          </Button>
        </Tooltip>
        {token && (
          <Tooltip title="Cadastrar novo produto">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/comercios/${id}/produtos/novo`)}
              aria-label="Cadastrar novo produto"
              tabIndex={0}
              sx={{ outline: "none", ":focus": { boxShadow: 3 } }}
            >
              Novo Produto
            </Button>
          </Tooltip>
        )}
        {token && (
          <Tooltip title="Editar comércio">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              sx={{ ml: 2, outline: "none", ":focus": { boxShadow: 3 } }}
              onClick={() => navigate(`/comercios/${id}/editar`)}
              aria-label="Editar comércio"
              tabIndex={0}
            >
              Editar
            </Button>
          </Tooltip>
        )}
      </Box>
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          boxShadow: 3,
          p: { xs: 1, sm: 2 },
          backgroundColor: "#fff",
          color: "#222",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                fontWeight: 700,
                width: 56,
                height: 56,
                fontSize: 28,
              }}
            >
              {comercio.nome?.[0]?.toUpperCase() || "?"}
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
                color="primary.main"
                sx={{ letterSpacing: 1 }}
              >
                {comercio.nome}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {comercio.descricao}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" mb={0.5}>
            <b>Endereço:</b> {comercio.endereco}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            <b>Telefone:</b> {comercio.telefone}
          </Typography>
          <Box display="flex" gap={2} mb={1}>
            {comercio.telefone && (
              <Button
                variant="outlined"
                color="success"
                size="small"
                component="a"
                href={`https://wa.me/55${comercio.telefone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg"
                    alt="WhatsApp"
                    style={{ width: 20, height: 20 }}
                  />
                }
                aria-label="Contato WhatsApp"
              >
                WhatsApp
              </Button>
            )}
            {comercio.telefone && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                component="a"
                href={`tel:${comercio.telefone}`}
                startIcon={
                  <span role="img" aria-label="Telefone">
                    📞
                  </span>
                }
                aria-label="Ligar para o comércio"
              >
                Ligar
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
      {/* Avaliações */}
      <Typography
        variant="h6"
        mb={1.5}
        sx={{ color: "#222", fontWeight: 700, letterSpacing: 0.5 }}
      >
        Avaliações
      </Typography>
      <Box mb={3}>
        {avaliacoes.length === 0 && (
          <Typography
            color="text.secondary"
            fontStyle="italic"
            fontSize={15}
            mb={1}
          >
            Nenhuma avaliação ainda.
          </Typography>
        )}
        {avaliacoes.map((a) => (
          <Card
            key={a.id}
            sx={{ mb: 1.5, p: 1.5, borderRadius: 2, boxShadow: 1 }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Avatar sx={{ width: 32, height: 32, fontSize: 16 }}>
                {a.usuario?.nome?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Typography fontWeight={600} fontSize={15}>
                {a.usuario?.nome || "Usuário"}
              </Typography>
              <Rating value={a.nota} readOnly size="small" sx={{ ml: 1 }} />
              <Typography color="text.secondary" fontSize={13} ml={1}>
                {new Date(a.criadoEm).toLocaleDateString()}
              </Typography>
              {/* Botão de exclusão só para comerciante dono */}
              {usuario &&
                usuario.tipo === "comerciante" &&
                comercio &&
                comercio.usuarioId === usuario.id && (
                  <Tooltip title="Excluir avaliação">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      sx={{ borderRadius: 2, minWidth: 0, px: 1, ml: 2 }}
                      onClick={() => {
                        setAvaliacaoExcluir(a);
                        setDialogAvaliacaoOpen(true);
                      }}
                      disabled={excluindoAvaliacao}
                    >
                      Excluir
                    </Button>
                  </Tooltip>
                )}
            </Box>
            <Typography fontSize={15}>{a.comentario}</Typography>
          </Card>
        ))}
        {/* Dialog de confirmação de exclusão de avaliação */}
        <Dialog
          open={dialogAvaliacaoOpen}
          onClose={() => setDialogAvaliacaoOpen(false)}
        >
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir esta avaliação?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDialogAvaliacaoOpen(false)}
              disabled={excluindoAvaliacao}
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                if (!avaliacaoExcluir) return;
                setExcluindoAvaliacao(true);
                try {
                  const token = localStorage.getItem("token");
                  await axios.delete(
                    `http://localhost:3333/avaliacoes/${avaliacaoExcluir.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  setSnackbar({
                    open: true,
                    message: "Avaliação excluída com sucesso!",
                    severity: "success",
                  });
                  setDialogAvaliacaoOpen(false);
                  setAvaliacaoExcluir(null);
                  fetchAvaliacoes();
                } catch (err) {
                  setSnackbar({
                    open: true,
                    message:
                      err.response?.data?.error || "Erro ao excluir avaliação",
                    severity: "error",
                  });
                } finally {
                  setExcluindoAvaliacao(false);
                }
              }}
              color="error"
              variant="contained"
              disabled={excluindoAvaliacao}
              aria-label="Confirmar exclusão da avaliação"
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Formulário de avaliação */}
      {usuario && usuario.tipo === "cliente" && (
        <Box mb={4} component="form" onSubmit={handleEnviarAvaliacao}>
          <Typography fontWeight={600} mb={1} fontSize={16}>
            Deixe sua avaliação:
          </Typography>
          <Rating
            name="nota"
            value={novaAvaliacao.nota}
            onChange={(_, v) => setNovaAvaliacao((f) => ({ ...f, nota: v }))}
            size="large"
            sx={{ mb: 1 }}
            required
          />
          <TextField
            name="comentario"
            label="Comentário (opcional)"
            value={novaAvaliacao.comentario}
            onChange={(e) =>
              setNovaAvaliacao((f) => ({ ...f, comentario: e.target.value }))
            }
            fullWidth
            multiline
            minRows={2}
            inputProps={{ maxLength: 300 }}
            sx={{ mb: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={enviandoAvaliacao || novaAvaliacao.nota < 1}
          >
            Enviar Avaliação
          </Button>
        </Box>
      )}
      <Typography
        variant="h6"
        mb={2}
        id="produtos-lista"
        sx={{ color: "#222", fontWeight: 700, letterSpacing: 0.5 }}
      >
        Produtos
      </Typography>
      <Grid
        container
        spacing={{ xs: 1, sm: 2 }}
        aria-labelledby="produtos-lista"
      >
        {comercio.produtos && comercio.produtos.length > 0 ? (
          comercio.produtos.map((produto) => (
            <Grid
              gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
              key={produto.id}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 2,
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundColor: "#fafbfc",
                  p: 1,
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Avatar
                      sx={{
                        bgcolor: "secondary.main",
                        fontWeight: 700,
                        width: 40,
                        height: 40,
                        fontSize: 20,
                      }}
                    >
                      {produto.nome?.[0]?.toUpperCase() || "?"}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        color="primary.main"
                        sx={{ letterSpacing: 0.5 }}
                      >
                        {produto.nome}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={0.5}
                        sx={{ fontWeight: 400 }}
                      >
                        {produto.descricao}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    <b>Preço:</b> R$ {produto.preco.toFixed(2)}
                  </Typography>
                </CardContent>
                {token && (
                  <Box
                    display="flex"
                    gap={1}
                    justifyContent="flex-end"
                    px={2}
                    pb={2}
                  >
                    <Tooltip title="Editar produto">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        sx={{ borderRadius: 2, minWidth: 0, px: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/produtos/${produto.id}/editar`);
                        }}
                      >
                        Editar
                      </Button>
                    </Tooltip>
                    <Tooltip title="Excluir produto">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        sx={{ borderRadius: 2, minWidth: 0, px: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setProdutoExcluir(produto);
                          setDialogOpen(true);
                        }}
                        disabled={excluindo}
                      >
                        Excluir
                      </Button>
                    </Tooltip>
                    {/* Dialog de confirmação de exclusão */}
                    <Dialog
                      open={dialogOpen}
                      onClose={() => setDialogOpen(false)}
                    >
                      <DialogTitle>Confirmar exclusão</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Tem certeza que deseja excluir o produto "
                          {produtoExcluir?.nome}"?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => setDialogOpen(false)}
                          disabled={excluindo}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={async () => {
                            if (!produtoExcluir) return;
                            setExcluindo(true);
                            try {
                              const token = localStorage.getItem("token");
                              await axios.delete(
                                `http://localhost:3333/produtos/${produtoExcluir.id}`,
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              setSnackbar({
                                open: true,
                                message: "Produto excluído com sucesso!",
                                severity: "success",
                              });
                              setDialogOpen(false);
                              setProdutoExcluir(null);
                              fetchComercio();
                            } catch (err) {
                              setSnackbar({
                                open: true,
                                message:
                                  err.response?.data?.error ||
                                  "Erro ao excluir produto",
                                severity: "error",
                              });
                            } finally {
                              setExcluindo(false);
                            }
                          }}
                          color="error"
                          variant="contained"
                          disabled={excluindo}
                          aria-label="Confirmar exclusão do produto"
                        >
                          Excluir
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                )}
              </Card>
            </Grid>
          ))
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            ml={2}
            sx={{ fontStyle: "italic", fontWeight: 400 }}
          >
            Nenhum produto cadastrado.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
