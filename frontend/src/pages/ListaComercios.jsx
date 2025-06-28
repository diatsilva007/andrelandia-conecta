import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ListaComercios() {
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchComercios = () => {
    setLoading(true);
    axios
      .get("http://localhost:3333/comercios")
      .then((res) => setComercios(res.data))
      .catch(() => setComercios([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComercios();
  }, [location]); // Atualiza sempre que a rota mudar

  // Exemplo: mostrar mensagem de sucesso ao voltar do cadastro
  useEffect(() => {
    if (location.state && location.state.sucesso) {
      setSnackbar({
        open: true,
        message: location.state.sucesso,
        severity: "success",
      });
      window.history.replaceState({}, document.title); // Limpa o state
    }
  }, [location]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3} align="center">
        Comércios Cadastrados
      </Typography>
      {token && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
          onClick={() => navigate("/comercios/novo")}
        >
          Novo Comércio
        </Button>
      )}
      <Grid container spacing={3} justifyContent="center">
        {comercios.length === 0 && (
          <Typography variant="body1" color="text.secondary">
            Nenhum comércio cadastrado.
          </Typography>
        )}
        {comercios.map((comercio) => (
          <Grid item xs={12} sm={6} md={4} key={comercio.id}>
            <Card
              component={Link}
              to={`/comercios/${comercio.id}`}
              sx={{ textDecoration: "none", cursor: "pointer" }}
            >
              <CardContent>
                <Typography variant="h6">{comercio.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {comercio.descricao}
                </Typography>
                <Typography variant="body2">{comercio.endereco}</Typography>
                <Typography variant="body2">{comercio.telefone}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
