import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Alert,
  Button,
  MenuItem,
} from "@mui/material";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import { LoadingContext } from "../App.jsx";
import { useSnackbar } from "../components/SnackbarContext.jsx";

export default function CadastroComercio() {
  const [usuario] = useState(() => {
    const userStr = localStorage.getItem("usuario");
    return userStr ? JSON.parse(userStr) : null;
  });
  // Estado do formulário
  const [form, setForm] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    endereco: "",
    telefone: "",
  });
  // Estado de feedback visual
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const { setSnackbar } = useSnackbar();
  const { setOpen } = useContext(LoadingContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || usuario?.tipo !== "comerciante") {
      navigate("/login");
    }
  }, [navigate, usuario]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Categorias sugeridas (pode ser expandido futuramente)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setOpen(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3333/comercios", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSucesso("Comércio cadastrado com sucesso!");
      setSnackbar({
        open: true,
        message: "Comércio cadastrado com sucesso!",
        severity: "success",
      });
      setTimeout(
        () =>
          navigate("/", {
            state: { sucesso: "Comércio cadastrado com sucesso!" },
          }),
        1200
      );
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao cadastrar comércio";
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
      aria-label="Cadastro de novo comércio"
    >
      <Box sx={{ width: "100%", maxWidth: 440 }}>
        <Box sx={{ mb: 3 }}>
          <BreadcrumbNav
            items={[
              { label: "Início", to: "/" },
              { label: "Cadastrar Comércio" },
            ]}
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
          aria-label="Formulário de cadastro de comércio"
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
            Cadastrar Novo Comércio
          </Typography>
          {erro && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {erro}
            </Alert>
          )}
          {sucesso && (
            <Alert severity="success" sx={{ mb: 2, width: "100%" }}>
              {sucesso}
            </Alert>
          )}
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            style={{ width: "100%" }}
            aria-label="Formulário de cadastro de comércio"
            tabIndex={0}
          >
            <TextField
              label="Nome do comércio"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              inputProps={{ maxLength: 60 }}
              helperText="Máx. 60 caracteres"
              sx={{ mb: 2, background: "#f7fafd", borderRadius: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                label="Categoria"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                fullWidth
                required={false}
                sx={{ background: "#f7fafd", borderRadius: 2 }}
                helperText="Escolha a categoria principal do comércio"
              >
                <MenuItem value="">
                  <em>Selecione</em>
                </MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <TextField
              label="Descrição"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{ maxLength: 120 }}
              helperText="Máx. 120 caracteres"
              sx={{ mb: 2, background: "#f7fafd", borderRadius: 2 }}
            />
            <TextField
              label="Endereço"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{ maxLength: 80 }}
              helperText="Máx. 80 caracteres"
              sx={{ mb: 2, background: "#f7fafd", borderRadius: 2 }}
            />
            <TextField
              label="Telefone"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{ maxLength: 20 }}
              helperText="Ex: (35) 99999-9999"
              sx={{ mb: 2, background: "#f7fafd", borderRadius: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: 0.5,
                borderRadius: 3,
                py: 1.5,
                boxShadow: "0 2px 8px #1976d222",
                textTransform: "none",
              }}
            >
              Cadastrar
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
