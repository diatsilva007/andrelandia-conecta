import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Alert, Paper } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

export default function CadastroComercio() {
  const [form, setForm] = useState({ nome: "", descricao: "", endereco: "", telefone: "" });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3333/comercios", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSucesso("Comércio cadastrado com sucesso!");
      setTimeout(() => navigate("/", { state: { sucesso: "Comércio cadastrado com sucesso!" } }), 1200);
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao cadastrar comércio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" mb={2} align="center" fontWeight={700} color="primary.main">
          Cadastrar Novo Comércio
        </Typography>
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField label="Nome" name="nome" value={form.nome} onChange={handleChange} fullWidth required margin="normal" inputProps={{ maxLength: 60 }} helperText="Máx. 60 caracteres" />
          <TextField label="Descrição" name="descricao" value={form.descricao} onChange={handleChange} fullWidth margin="normal" inputProps={{ maxLength: 120 }} helperText="Máx. 120 caracteres" />
          <TextField label="Endereço" name="endereco" value={form.endereco} onChange={handleChange} fullWidth margin="normal" inputProps={{ maxLength: 80 }} helperText="Máx. 80 caracteres" />
          <TextField label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} fullWidth margin="normal" inputProps={{ maxLength: 20 }} helperText="Ex: (35) 99999-9999" />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading} endIcon={loading && <CircularProgress size={18} color="inherit" />}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
