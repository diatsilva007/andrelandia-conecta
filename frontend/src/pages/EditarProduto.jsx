import { useState, useEffect, useContext } from "react";
import { useSnackbar } from "../components/SnackbarContext.jsx";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import { LoadingContext } from "../App.jsx";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarProduto() {
  const { id } = useParams(); // id do produto
  const [form, setForm] = useState({ nome: "", preco: "", descricao: "" });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const { setSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { setOpen } = useContext(LoadingContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setOpen(true);
    axios
      .get(`http://localhost:3333/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm({
          nome: res.data.nome,
          preco: res.data.preco,
          descricao: res.data.descricao || "",
        });
      })
      .catch(() => setErro("Produto não encontrado."))
      .finally(() => setOpen(false));
  }, [id, navigate, setOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setOpen(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3333/produtos/${id}`,
        { ...form, preco: parseFloat(form.preco) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSucesso("Produto atualizado com sucesso!");
      setSnackbar({
        open: true,
        message: "Produto atualizado com sucesso!",
        severity: "success",
      });
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao atualizar produto";
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

  return (
    <Box bgcolor="background.default" minHeight="100vh" py={{ xs: 2, sm: 4 }}>
      <Box sx={{ maxWidth: 420, mx: "auto", mb: 3 }}>
        <BreadcrumbNav
          items={[{ label: "Início", to: "/" }, { label: "Editar Produto" }]}
        />
      </Box>
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: 420,
          mx: "auto",
          width: "100%",
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          mb={2}
          align="center"
          fontWeight={700}
          color="primary.main"
          sx={{ letterSpacing: 1 }}
        >
          Editar Produto
        </Typography>
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 60, "aria-label": "Nome do produto" }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Preço"
            name="preco"
            value={form.preco}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            type="number"
            inputProps={{
              min: 0,
              step: 0.01,
              "aria-label": "Preço do produto",
            }}
            sx={{ mb: 2 }}
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
              "aria-label": "Descrição do produto",
            }}
            sx={{ mb: 2 }}
          />
          {erro && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {erro}
            </Alert>
          )}
          {sucesso && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {sucesso}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: 0.5,
              borderRadius: 2,
            }}
            aria-label="Salvar alterações do produto"
          >
            Salvar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
