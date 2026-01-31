import { useState, useEffect, useContext } from "react";
import ImageUpload from "../components/ImageUpload.jsx";
import { useSnackbar } from "../components/SnackbarContext.jsx";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import { LoadingContext } from "../App.jsx";
import VoltarButton from "../components/VoltarButton.jsx";
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
  const [imagem, setImagem] = useState(null);
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
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (imagem) {
        formData.append("imagem", imagem, "produto.jpg");
      }
      await axios.post(
        `http://localhost:3333/produtos?comercioId=${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
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
      bgcolor="background.default"
      minHeight="100vh"
      width="100vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ p: { xs: 1, sm: 2 } }}
      role="main"
      aria-label="Cadastro de novo produto"
    >
      <Box sx={{ width: "100%", maxWidth: 440 }}>
        <Box sx={{ mb: 3 }}>
          <BreadcrumbNav
            items={[{ label: "Início", to: "/" }, { label: "Novo Produto" }]}
          />
        </Box>
        <Paper
          sx={{
            p: { xs: 4, sm: 5, md: 6 },
            borderRadius: 4,
            boxShadow: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#fff",
            gap: 2,
          }}
          role="form"
          aria-label="Formulário de cadastro de produto"
        >
          <Typography
            variant="h4"
            mb={2.5}
            align="center"
            fontWeight={800}
            color="primary.main"
            sx={{
              letterSpacing: 1.5,
              textShadow: "0 2px 8px #1976d222",
              outline: "none",
            }}
            tabIndex={0}
          >
            Cadastrar Novo Produto
          </Typography>
          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}
          {sucesso && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {sucesso}
            </Alert>
          )}
          <form onSubmit={handleSubmit} autoComplete="off">
            <ImageUpload
              label="Imagem do produto"
              onChange={setImagem}
              value={null}
            />
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
                transition: "background 0.2s",
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  color: "#fff",
                  boxShadow: 4,
                },
              }}
              aria-label="Cadastrar produto"
            >
              Cadastrar
            </Button>
          </form>
          <VoltarButton
            label="Cancelar"
            onClick={() => navigate(-1)}
            sx={{ width: "100%", mt: 1 }}
          />
        </Paper>
      </Box>
    </Box>
  );
}
