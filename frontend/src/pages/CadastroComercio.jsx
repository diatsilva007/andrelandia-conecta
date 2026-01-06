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
} from "@mui/material";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import { LoadingContext } from "../App.jsx";
import { useSnackbar } from "../components/SnackbarContext.jsx";

export default function CadastroComercio() {
  const [usuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  });
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    endereco: "",
    telefone: "",
  });
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
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
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
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: 3, sm: 4 },
            boxShadow: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            mb={3}
            align="center"
            fontWeight={700}
            color="primary.main"
            sx={{ letterSpacing: 1 }}
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
          >
            <TextField
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              inputProps={{ maxLength: 60 }}
              helperText="Máx. 60 caracteres"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Descrição"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{ maxLength: 120 }}
              helperText="Máx. 120 caracteres"
              sx={{ mb: 2 }}
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
              sx={{ mb: 2 }}
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
