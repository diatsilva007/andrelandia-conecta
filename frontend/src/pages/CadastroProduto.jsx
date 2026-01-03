import { useState, useEffect } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
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
      setTimeout(() => navigate(`/comercios/${id}`), 1200);
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao cadastrar produto");
    }
  };

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
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" mb={2} align="center">
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
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
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
          />
          <TextField
            label="Descrição"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Cadastrar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
