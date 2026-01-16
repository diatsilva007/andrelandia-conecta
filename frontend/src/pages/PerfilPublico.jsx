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
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import LoadingBackdrop from "../components/LoadingBackdrop";
import GlobalSnackbar from "../components/GlobalSnackbar";

// Página de perfil público de comerciante ou cliente
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
      .catch((err) => {
        setError("Não foi possível carregar o perfil público.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingBackdrop open={true} />;
  if (error)
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          bgcolor: "transparent",
        }}
      >
        <Card
          sx={{
            p: 3,
            boxShadow: 3,
            minWidth: 320,
            maxWidth: 400,
            width: "100%",
            mx: "auto",
          }}
        >
          <Typography variant="h6" color="error" align="center">
            {error}
          </Typography>
        </Card>
      </Box>
    );
  if (!perfil || !perfil.nome) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          bgcolor: "transparent",
        }}
      >
        <Card
          sx={{
            p: 3,
            boxShadow: 3,
            minWidth: 320,
            maxWidth: 400,
            width: "100%",
            mx: "auto",
          }}
        >
          <Typography variant="h6" color="text.secondary" align="center">
            Perfil não encontrado ou sem informações públicas.
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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
          {perfil.tipo === "comerciante" && (
            <>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
                Comércios vinculados
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {perfil.comercios?.length ? (
                  perfil.comercios.map((comercio) => (
                    <Grid item xs={12} sm={6} key={comercio.id}>
                      <Card variant="outlined" sx={{ p: 1, boxShadow: 1 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Avatar
                            src={comercio.imagem || undefined}
                            sx={{
                              width: 48,
                              height: 48,
                              mx: "auto",
                              mb: 1,
                              bgcolor: "#e3f2fd",
                            }}
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
            </>
          )}
          {perfil.tipo === "cliente" && (
            <>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
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
            </>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default PerfilPublico;
