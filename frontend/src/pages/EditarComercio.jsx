import { useEffect, useState, useContext } from "react";
import { useSnackbar } from "../components/SnackbarContext.jsx";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import { LoadingContext } from "../App.jsx";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarComercio() {
  const { id } = useParams();
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    endereco: "",
    telefone: "",
  });
  const [loading, setLoading] = useState(true);
  const { setOpen } = useContext(LoadingContext);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const { setSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    setOpen(true);
    axios
      .get(`http://localhost:3333/comercios/${id}`)
      .then((res) => setForm(res.data))
      .catch(() => setErro("Erro ao carregar dados do comércio."))
      .finally(() => {
        setLoading(false);
        setOpen(false);
      });
  }, [id, setOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setOpen(true);
    try {
      await axios.put(`http://localhost:3333/comercios/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSucesso("Comércio atualizado com sucesso!");
      setSnackbar({
        open: true,
        message: "Comércio atualizado com sucesso!",
        severity: "success",
      });
      setTimeout(
        () =>
          navigate("/", {
            state: { sucesso: "Comércio atualizado com sucesso!" },
          }),
        1200
      );
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao atualizar comércio";
      setErro(msg);
      setSnackbar({
        open: true,
        message: msg,
        severity: "error",
      });
    } finally {
      setOpen(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 24,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ maxWidth: 420, width: "100%" }}>
          <BreadcrumbNav
            items={[{ label: "Início", to: "/" }, { label: "Editar Comércio" }]}
          />
        </Box>
      </Box>
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: { xs: 320, sm: 400 },
          width: "100%",
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: 6,
        }}
      >
        <Typography
          variant="h5"
          mb={2.5}
          align="center"
          fontWeight={700}
          letterSpacing={0.5}
        >
          Editar Comércio
        </Typography>
        {erro && (
          <Alert severity="error" sx={{ mb: 2, fontSize: 15 }}>
            {erro}
          </Alert>
        )}
        {sucesso && (
          <Alert severity="success" sx={{ mb: 2, fontSize: 15 }}>
            {sucesso}
          </Alert>
        )}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          style={{ width: "100%" }}
        >
          <TextField
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ maxLength: 60, "aria-label": "Nome do comércio" }}
          />
          <TextField
            label="Descrição"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            inputProps={{
              maxLength: 200,
              "aria-label": "Descrição do comércio",
            }}
          />
          <TextField
            label="Endereço"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{
              maxLength: 120,
              "aria-label": "Endereço do comércio",
            }}
          />
          <TextField
            label="Telefone"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            inputProps={{ maxLength: 20, "aria-label": "Telefone do comércio" }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, fontWeight: 600, fontSize: 16, borderRadius: 3 }}
            aria-label="Salvar alterações do comércio"
          >
            Salvar
          </Button>
        </form>
        <Button
          color="primary"
          fullWidth
          sx={{ mt: 1, fontWeight: 500, fontSize: 15, borderRadius: 3 }}
          onClick={() => navigate(-1)}
          aria-label="Cancelar edição"
        >
          Cancelar
        </Button>
      </Paper>
    </Box>
  );
}
