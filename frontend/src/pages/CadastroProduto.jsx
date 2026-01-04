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

export default function CadastroProduto() {
  const { id } = useParams(); // id do comércio
  const [form, setForm] = useState({ nome: "", preco: "", descricao: "" });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const { setSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { setOpen } = useContext(LoadingContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setOpen(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3333/produtos`,
        { ...form, preco: parseFloat(form.preco), comercioId: Number(id) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSucesso("Produto cadastrado com sucesso!");
      setSnackbar({
        open: true,
        message: "Produto cadastrado com sucesso!",
        severity: "success",
      });
      setTimeout(() => navigate(`/comercios/${id}`), 1200);
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao cadastrar produto";
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
            items={[{ label: "Início", to: "/" }, { label: "Novo Produto" }]}
          />
        </Box>
      </Box>
      <Paper
        sx={{
          p: { xs: 3, md: 5 },
          maxWidth: 420,
          width: "100%",
          borderRadius: 4,
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
          Cadastrar Novo Produto
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
            required
            margin="normal"
            inputProps={{ maxLength: 60, "aria-label": "Nome do produto" }}
          />
          <TextField
            label="Preço"
            name="preco"
            value={form.preco}
            onChange={handleChange}
            type="number"
            fullWidth
            required
            margin="normal"
            inputProps={{
              min: 0,
              step: 0.01,
              "aria-label": "Preço do produto",
            }}
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
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, fontWeight: 600, fontSize: 16, borderRadius: 3 }}
            aria-label="Cadastrar produto"
          >
            Cadastrar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
