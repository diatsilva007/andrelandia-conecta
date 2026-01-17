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
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 6, px: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Meu histórico
      </Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Compras" />
        <Tab label="Avaliações" />
        <Tab label="Ações" />
      </Tabs>
      {tab === 0 && (
        <Box>
          <Typography variant="h6" mb={2}>
            Compras realizadas
          </Typography>
          <Grid container spacing={2}>
            {historico.compras?.length ? (
              historico.compras.map((compra) => (
                <Grid item xs={12} sm={6} key={compra.id}>
                  <Card variant="outlined" sx={{ p: 1 }}>
                    <CardContent>
                      <Typography fontWeight={600}>
                        {compra.produtoNome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(compra.data).toLocaleDateString()} -{" "}
                        {compra.valor} R$
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {compra.comercioNome}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma compra realizada.
              </Typography>
            )}
          </Grid>
        </Box>
      )}
      {tab === 1 && (
        <Box>
          <Typography variant="h6" mb={2}>
            Avaliações feitas
          </Typography>
          <Grid container spacing={2}>
            {historico.avaliacoes?.length ? (
              historico.avaliacoes.map((a) => (
                <Grid item xs={12} sm={6} key={a.id}>
                  <Card variant="outlined" sx={{ p: 1 }}>
                    <CardContent>
                      <Typography fontWeight={600}>{a.comercioNome}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(a.data).toLocaleDateString()} - Nota: {a.nota}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {a.comentario || "Sem comentário."}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma avaliação feita.
              </Typography>
            )}
          </Grid>
        </Box>
      )}
      {tab === 2 && (
        <Box>
          <Typography variant="h6" mb={2}>
            Ações recentes
          </Typography>
          <Grid container spacing={2}>
            {historico.acoes?.length ? (
              historico.acoes.map((acao, idx) => (
                <Grid item xs={12} key={idx}>
                  <Card variant="outlined" sx={{ p: 1 }}>
                    <CardContent>
                      <Typography fontWeight={600}>{acao.tipo}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(acao.data).toLocaleDateString()} -{" "}
                        {acao.descricao}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma ação registrada.
              </Typography>
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default HistoricoUsuario;
