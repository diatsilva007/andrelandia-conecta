import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Avatar, Typography, Card, CardContent, Grid, Button } from "@mui/material";
import axios from "axios";
import LoadingBackdrop from "../components/LoadingBackdrop";
import GlobalSnackbar from "../components/GlobalSnackbar";

const PerfilPublico = () => {
  const { id } = useParams();
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
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar
            src={perfil.imagem || undefined}
            sx={{ width: 96, height: 96, mb: 2, bgcolor: "#e3f2fd" }}
          >
            {!perfil.imagem && perfil.nome?.[0]}
          </Avatar>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {perfil.nome}
          </Typography>
          <Typography
            variant="caption"
            color="primary"
            sx={{ mb: 1, px: 2, py: 0.5, borderRadius: 2, bgcolor: "#e3f2fd" }}
          >
            {perfil.tipo === "comerciante" ? "Comerciante" : "Cliente"}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 2 }}
          >
            {perfil.descricao || perfil.sobre || "Sem descrição cadastrada."}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2, borderRadius: 3, fontWeight: 600 }}
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
                    <Typography variant="body2" fontWeight={600} color="primary">
                      {perfil.mediaAvaliacao} / 5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({perfil.totalAvaliacao} avaliações)
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    {perfil.avaliacoes.map((a) => (
                      <Card key={a.id} variant="outlined" sx={{ mb: 1, p: 1, boxShadow: 0 }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar src={a.usuario?.imagem || undefined} sx={{ width: 32, height: 32, bgcolor: "#e3f2fd" }}>
                            {a.usuario?.nome?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{a.usuario?.nome}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                              {a.comentario || "Sem comentário."}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(a.createdAt).toLocaleDateString()}
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
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Nenhuma avaliação recebida ainda.
                </Typography>
              )}
            </Box>
          </Box>
          {/* Bloco de comércios vinculados */}
          {perfil.tipo === "comerciante" && (
            <Box sx={{ mt: 3, width: "100%" }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Comércios vinculados
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {perfil.comercios?.length ? (
                  perfil.comercios.map((comercio) => (
                    <Grid item xs={12} sm={6} key={comercio.id}>
                      <Card variant="outlined" sx={{ p: 1, boxShadow: 1 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Avatar src={comercio.imagem || undefined} sx={{ width: 48, height: 48, mx: "auto", mb: 1, bgcolor: "#e3f2fd" }}>
                            {!comercio.imagem && comercio.nome?.[0]}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={600}>{comercio.nome}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {comercio.categoria || "Sem categoria"}
                          </Typography>
                          <Button variant="outlined" size="small" sx={{ mt: 1, minWidth: 100 }} href={`/comercios/${comercio.id}`}>
                            Ver comércio
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Nenhum comércio vinculado.
                  </Typography>
                )}
              </Grid>
            </Box>
          )}
          {/* Bloco de favoritos para cliente */}
          {perfil.tipo === "cliente" && (
            <Box sx={{ mt: 3, width: "100%" }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Favoritos
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {perfil.favoritos?.length ? (
                  perfil.favoritos.map((fav) => (
                    <Grid item xs={12} sm={6} key={fav.id}>
                      <Card variant="outlined" sx={{ p: 1, boxShadow: 1 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Avatar sx={{ width: 40, height: 40, mx: "auto", mb: 1, bgcolor: "#e3f2fd" }}>
                            {fav.nome?.[0]}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={600}>{fav.nome}</Typography>
                          <Button variant="outlined" size="small" sx={{ mt: 1, minWidth: 100 }} href={fav.tipo === "comercio" ? `/comercios/${fav.id}` : `/produtos/${fav.id}`}>
                            Ver
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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