import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Tabs,
  Tab,
  Container,
} from "@mui/material";
import axios from "axios";
import LoadingBackdrop from "../components/LoadingBackdrop";
import GlobalSnackbar from "../components/GlobalSnackbar";

const HistoricoUsuario = () => {
  const [historico, setHistorico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3333/usuarios/me/historico", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setHistorico(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Não foi possível carregar o histórico.");
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingBackdrop open />;
  if (error) return <GlobalSnackbar message={error} severity="error" open />;
  if (!historico) return null;

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        justifyContent: "center",
        alignItems: "center",
        m: 0,
        p: 0,
      }}
    >
      <Grid item sx={{ width: "100%", maxWidth: 700 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          mb={3}
          align="center"
          color="primary"
          sx={{ width: "100%" }}
        >
          Meu histórico
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: 1,
            bgcolor: "background.paper",
            width: "100%",
            justifyContent: "center",
          }}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Compras" sx={{ fontWeight: 600 }} />
          <Tab label="Avaliações" sx={{ fontWeight: 600 }} />
          <Tab label="Ações" sx={{ fontWeight: 600 }} />
        </Tabs>
        {tab === 0 && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              mb={2}
              color="secondary"
              fontWeight={700}
              align="center"
              sx={{ width: "100%" }}
            >
              Compras realizadas
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {historico.compras?.length ? (
                historico.compras.map((compra) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    key={compra.id}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        boxShadow: 2,
                        minWidth: 250,
                        minHeight: 120,
                        mx: "auto",
                      }}
                    >
                      <CardContent>
                        <Typography
                          fontWeight={700}
                          color="primary.main"
                          mb={1}
                          align="center"
                        >
                          {compra.produtoNome}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                          align="center"
                        >
                          {new Date(compra.data).toLocaleDateString()} •{" "}
                          {compra.valor} R$
                        </Typography>
                        <Typography
                          variant="body2"
                          color="secondary"
                          align="center"
                        >
                          {compra.comercioNome}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Nenhuma compra realizada.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
        {tab === 1 && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              mb={2}
              color="secondary"
              fontWeight={700}
              align="center"
              sx={{ width: "100%" }}
            >
              Avaliações feitas
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {historico.avaliacoes?.length ? (
                historico.avaliacoes.map((a) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    key={a.id}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        boxShadow: 2,
                        minWidth: 250,
                        minHeight: 120,
                        mx: "auto",
                      }}
                    >
                      <CardContent>
                        <Typography
                          fontWeight={700}
                          color="primary.main"
                          mb={1}
                          align="center"
                        >
                          {a.comercioNome}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                          align="center"
                        >
                          {new Date(a.data).toLocaleDateString()} • Nota:{" "}
                          {a.nota}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="secondary"
                          align="center"
                        >
                          {a.comentario || "Sem comentário."}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Nenhuma avaliação feita.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
        {tab === 2 && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              mb={2}
              color="secondary"
              fontWeight={700}
              align="center"
              sx={{ width: "100%" }}
            >
              Ações recentes
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {historico.acoes?.length ? (
                historico.acoes.map((acao, idx) => (
                  <Grid
                    item
                    xs={12}
                    key={idx}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        boxShadow: 2,
                        minWidth: 250,
                        minHeight: 100,
                        mx: "auto",
                      }}
                    >
                      <CardContent>
                        <Typography
                          fontWeight={700}
                          color="primary.main"
                          mb={1}
                          align="center"
                        >
                          {acao.tipo}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                        >
                          {new Date(acao.data).toLocaleDateString()} •{" "}
                          {acao.descricao}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Nenhuma ação registrada.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default HistoricoUsuario;
