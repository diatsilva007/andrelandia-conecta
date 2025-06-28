import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Alert, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CadastroComercio() {
  const [form, setForm] = useState({ nome: "", descricao: "", endereco: "", telefone: "" });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3333/comercios", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSucesso("Comércio cadastrado com sucesso!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao cadastrar comércio");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" mb={2} align="center">Cadastrar Novo Comércio</Typography>
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Nome" name="nome" value={form.nome} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Descrição" name="descricao" value={form.descricao} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Endereço" name="endereco" value={form.endereco} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} fullWidth margin="normal" />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Cadastrar</Button>
        </form>
      </Paper>
    </Box>
  );
}
