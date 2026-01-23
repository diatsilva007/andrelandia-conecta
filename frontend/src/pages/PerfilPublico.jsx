import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingBackdrop from "../components/LoadingBackdrop";
import GlobalSnackbar from "../components/GlobalSnackbar";
import EditarPerfilDialog from "../components/EditarPerfilDialog";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const PerfilPublico = () => {
  const { id } = useParams();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
  const [editarOpen, setEditarOpen] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3333/usuarios/${id}/publico`)
      .then((res) => {
        setPerfil(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Não foi possível carregar o perfil público.");
        setLoading(false);
      });
  }, [id]);

  const compartilharPerfil = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "Perfil público", url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link do perfil copiado!");
    }
  };

  if (loading) return <LoadingBackdrop open />;
  if (error) return <GlobalSnackbar message={error} severity="error" open />;
  if (!perfil || !perfil.nome) {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Perfil não encontrado ou sem informações públicas.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 0 },
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          mx: "auto",
          p: { xs: 2, sm: 3 },
          boxShadow: 4,
          borderRadius: 4,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            src={
              perfil.imagem && perfil.imagem.startsWith("/uploads")
                ? `${import.meta.env.VITE_API_URL || "http://localhost:3333"}${perfil.imagem}`
                : perfil.imagem || undefined
            }
            sx={{
              width: { xs: 72, sm: 96 },
              height: { xs: 72, sm: 96 },
              mb: 2,
              bgcolor: perfil.imagem ? undefined : "#e3f2fd",
              boxShadow: 2,
              objectFit: "cover",
            }}
            imgProps={{ referrerPolicy: "no-referrer" }}
          >
            {!perfil.imagem && perfil.nome?.[0]}
          </Avatar>
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            sx={{ textAlign: "center", wordBreak: "break-word" }}
          >
            {perfil.nome}
          </Typography>
          <Typography
            variant="caption"
            color="primary"
            sx={{
              mb: 1,
              px: 2,
              py: 0.5,
              borderRadius: 2,
              bgcolor: "#e3f2fd",
              fontWeight: 600,
              fontSize: { xs: 13, sm: 15 },
            }}
          >
            {perfil.tipo === "comerciante" ? "Comerciante" : "Cliente"}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{
              mb: 2,
              fontSize: { xs: 15, sm: 17 },
              maxWidth: 420,
              wordBreak: "break-word",
            }}
          >
            {perfil.descricao || perfil.sobre || "Sem descrição cadastrada."}
          </Typography>
          {/* Botão Editar Perfil - só para o próprio usuário */}
          {usuarioLogado && String(usuarioLogado.id) === String(id) && (
            <Button
              variant="outlined"
              color="primary"
              sx={{
                mb: 2,
                borderRadius: 3,
                fontWeight: 600,
                px: 3,
                boxShadow: 1,
              }}
              startIcon={<ManageAccountsIcon />}
              onClick={() => setEditarOpen(true)}
            >
              Editar Perfil
            </Button>
          )}
          <EditarPerfilDialog
            open={editarOpen}
            onClose={() => setEditarOpen(false)}
            onSuccess={() => window.location.reload()}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{
              mb: 2,
              borderRadius: 3,
              fontWeight: 600,
              px: 3,
              boxShadow: 1,
              fontSize: { xs: 14, sm: 16 },
              background: "linear-gradient(90deg, #1565c0 0%, #43a047 100%)",
              color: "#fff",
              transition: "background 0.2s, box-shadow 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #43a047 0%, #1565c0 100%)",
                color: "#fff",
                boxShadow: 3,
              },
            }}
            onClick={compartilharPerfil}
          >
            Compartilhar perfil
          </Button>
          {/* Bloco de avaliações recebidas */}
          <Box sx={{ mt: 3, width: "100%" }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Avaliações recebidas
            </Typography>
            <Box sx={{ mt: 1 }}>
              {perfil.avaliacoes?.length ? (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* Adicione renderAvaliacaoEstrelas se necessário */}
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary"
                    >
                      {perfil.mediaAvaliacao} / 5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({perfil.totalAvaliacao} avaliações)
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    {perfil.avaliacoes.map((a) => (
                      <Card
                        key={a.id}
                        variant="outlined"
                        sx={{ mb: 1, p: 1, boxShadow: 0 }}
                      >
                        <CardContent
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Link
                            to={a.usuario ? `/perfil/${a.usuario.id}` : "#"}
                            style={{
                              textDecoration: "none",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginRight: 8,
                            }}
                          >
                            <Avatar
                              src={a.usuario?.imagem || undefined}
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "#e3f2fd",
                                cursor: "pointer",
                              }}
                            >
                              {a.usuario?.nome?.[0]}
                            </Avatar>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="primary"
                              sx={{ cursor: "pointer" }}
                            >
                              {a.usuario?.nome}
                            </Typography>
                          </Link>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              {a.comentario || "Sem comentário."}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(a.criadoEm).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box sx={{ ml: "auto" }}>
                            {/* Adicione renderAvaliacaoEstrelas(a.nota) se necessário */}
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Nenhuma avaliação recebida ainda.
                </Typography>
              )}
            </Box>
          </Box>
          {/* Bloco de estatísticas e galeria para comerciante */}
          {perfil.tipo === "comerciante" && (
            <Box sx={{ mt: 3, width: "100%" }}>
              {/* Estatísticas públicas */}
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    fontWeight={700}
                  >
                    Produtos
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {perfil.produtos?.length ?? 0}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    fontWeight={700}
                  >
                    Vendas
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {perfil.totalVendas ?? 0}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    fontWeight={700}
                  >
                    Avaliações
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {perfil.totalAvaliacao ?? 0}
                  </Typography>
                </Box>
              </Box>
              {/* Galeria de fotos do comércio */}
              {perfil.galeria?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Galeria de fotos
                  </Typography>
                  <Grid container columns={12} spacing={2}>
                    {perfil.galeria.map((img, idx) => (
                      <Grid
                        gridColumn={{ xs: "span 6", sm: "span 4" }}
                        key={idx}
                      >
                        <Card sx={{ boxShadow: 2 }}>
                          <CardContent sx={{ p: 1 }}>
                            <Avatar
                              src={
                                img.startsWith("/uploads")
                                  ? `${import.meta.env.VITE_API_URL || "http://localhost:3333"}${img}`
                                  : img
                              }
                              sx={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 2,
                              }}
                              variant="rounded"
                              imgProps={{ referrerPolicy: "no-referrer" }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              {/* Comércios vinculados */}
              <Typography variant="subtitle1" fontWeight={600}>
                Comércios vinculados
              </Typography>
              <Grid container columns={12} spacing={2} sx={{ mt: 1 }}>
                {perfil.comercios?.length ? (
                  perfil.comercios.map((comercio) => (
                    <Grid
                      gridColumn={{ xs: "span 12", sm: "span 6" }}
                      key={comercio.id}
                    >
                      <Card variant="outlined" sx={{ p: 1, boxShadow: 1 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Avatar
                            src={
                              comercio.imagem &&
                              comercio.imagem.startsWith("/uploads")
                                ? `${import.meta.env.VITE_API_URL || "http://localhost:3333"}${comercio.imagem}`
                                : comercio.imagem || undefined
                            }
                            sx={{
                              width: 48,
                              height: 48,
                              mx: "auto",
                              mb: 1,
                              bgcolor: comercio.imagem ? undefined : "#e3f2fd",
                              objectFit: "cover",
                            }}
                            imgProps={{ referrerPolicy: "no-referrer" }}
                          >
                            {!comercio.imagem && comercio.nome?.[0]}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {comercio.nome}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {comercio.categoria || "Sem categoria"}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1, minWidth: 100 }}
                            href={`/comercios/${comercio.id}`}
                          >
                            Ver comércio
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Nenhum comércio vinculado.
                  </Typography>
                )}
              </Grid>
            </Box>
          )}
          {/* Bloco de histórico de avaliações e badges para cliente */}
          {perfil.tipo === "cliente" && (
            <Box sx={{ mt: 3, width: "100%" }}>
              {/* Badges/conquistas */}
              {perfil.badges?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Conquistas
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {perfil.badges.map((badge, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          bgcolor: "#e0f7fa",
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          fontWeight: 600,
                          color: "#1565c0",
                        }}
                      >
                        {badge}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              {/* Histórico de avaliações feitas */}
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Histórico de avaliações
              </Typography>
              <Box sx={{ mb: 3 }}>
                {perfil.avaliacoesFeitas?.length ? (
                  perfil.avaliacoesFeitas.map((a) => (
                    <Card
                      key={a.id}
                      variant="outlined"
                      sx={{ mb: 1, p: 1, boxShadow: 0 }}
                    >
                      <CardContent
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Link
                          to={a.comercio ? `/comercios/${a.comercio.id}` : "#"}
                          style={{
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginRight: 8,
                          }}
                        >
                          <Avatar
                            src={a.comercio?.imagem || undefined}
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "#e3f2fd",
                              cursor: "pointer",
                            }}
                          >
                            {a.comercio?.nome?.[0]}
                          </Avatar>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="primary"
                            sx={{ cursor: "pointer" }}
                          >
                            {a.comercio?.nome}
                          </Typography>
                        </Link>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            {a.comentario || "Sem comentário."}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(a.criadoEm).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: "auto" }}>
                          {/* Adicione renderAvaliacaoEstrelas(a.nota) se necessário */}
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Nenhuma avaliação feita ainda.
                  </Typography>
                )}
              </Box>
              {/* Favoritos */}
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Favoritos
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {perfil.favoritos?.length ? (
                  perfil.favoritos.map((fav) => (
                    <Grid item xs={12} sm={6} key={fav.id}>
                      <Card variant="outlined" sx={{ p: 1, boxShadow: 1 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              mx: "auto",
                              mb: 1,
                              bgcolor: "#e3f2fd",
                            }}
                          >
                            {fav.nome?.[0]}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {fav.nome}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1, minWidth: 100 }}
                            href={
                              fav.tipo === "comercio"
                                ? `/comercios/${fav.id}`
                                : `/produtos/${fav.id}`
                            }
                          >
                            Ver
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Nenhum favorito cadastrado.
                  </Typography>
                )}
              </Grid>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default PerfilPublico;
