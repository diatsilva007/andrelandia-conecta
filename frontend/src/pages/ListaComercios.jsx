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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

export default function ListaComercios() {
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comercioExcluir, setComercioExcluir] = useState(null);
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3333/comercios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: "Comércio excluído com sucesso!",
        severity: "success",
      });
      fetchComercios();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Erro ao excluir comércio.",
        severity: "error",
      });
    }
    setDialogOpen(false);
    setComercioExcluir(null);
  };

  if (loading)
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="background.default"
        zIndex={1}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
      zIndex={1}
    >
      <Box width="100%" maxWidth={1200} p={3}>
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
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          {comercios.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                Nenhum comércio cadastrado.
              </Typography>
            </Grid>
          )}
          {comercios.map((comercio) => (
            <Grid item xs={12} sm={6} md={4} key={comercio.id}>
              <Card
                sx={{
                  position: "relative",
                  textDecoration: "none",
                  cursor: "pointer",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": { boxShadow: 8, transform: "translateY(-4px)" },
                  bgcolor: "#fff",
                  minHeight: 180,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => navigate(`/comercios/${comercio.id}`)}
              >
                <CardContent sx={{ pb: 1 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Avatar sx={{ bgcolor: "primary.main", fontWeight: 700 }}>
                      {comercio.nome?.[0]?.toUpperCase() || "?"}
                    </Avatar>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="primary.main"
                    >
                      {comercio.nome}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={0.5}>
                    {comercio.descricao}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {comercio.endereco}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {comercio.telefone}
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
                    <Tooltip title="Editar">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        sx={{ borderRadius: 2, minWidth: 0, px: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/comercios/${comercio.id}/editar`);
                        }}
                      >
                        Editar
                      </Button>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        sx={{ borderRadius: 2, minWidth: 0, px: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setComercioExcluir(comercio);
                          setDialogOpen(true);
                        }}
                      >
                        Excluir
                      </Button>
                    </Tooltip>
                  </Box>
                )}
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
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir o comércio "{comercioExcluir?.nome}
              "?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={() => handleDelete(comercioExcluir.id)}
              color="error"
              autoFocus
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
