import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Alert,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { LoadingContext } from "../App.jsx";
import { useSnackbar } from "../components/SnackbarContext.jsx";

export default function CadastroComercioDialog({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    endereco: "",
    telefone: "",
    categoria: "",
  });
  const [erro, setErro] = useState("");
  const { setSnackbar } = useSnackbar();
  const { setOpen } = useContext(LoadingContext);

  const categorias = [
    "Alimentação",
    "Vestuário",
    "Serviços",
    "Saúde",
    "Educação",
    "Beleza",
    "Tecnologia",
    "Outros",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setOpen(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3333/comercios", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: "Comércio cadastrado com sucesso!",
        severity: "success",
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao cadastrar comércio";
      setErro(msg);
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cadastrar Comércio</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Descrição"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Endereço"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Telefone"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Categoria"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Tooltip title="Cancelar cadastro" arrow>
          <span>
            <Button
              onClick={onClose}
              color="inherit"
              sx={{
                minWidth: 48,
                minHeight: 48,
                px: 2.5,
                py: 1.5,
                borderRadius: 3,
              }}
            >
              Cancelar
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Confirmar cadastro de comércio" arrow>
          <span>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              sx={{
                minWidth: 48,
                minHeight: 48,
                px: 2.5,
                py: 1.5,
                borderRadius: 3,
              }}
            >
              Cadastrar
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
