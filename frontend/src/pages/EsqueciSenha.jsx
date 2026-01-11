import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VoltarButton from "../components/VoltarButton.jsx";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setEnviando(true);
    try {
      // Endpoint fictício, ajuste conforme backend
      await axios.post("http://localhost:3333/auth/esqueci-senha", { email });
      setSucesso(
        "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha."
      );
    } catch (err) {
      setErro(
        err.response?.data?.error || "Erro ao solicitar redefinição de senha"
      );
    } finally {
      setEnviando(false);
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
          Esqueci minha senha
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
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            autoFocus
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={enviando}
            endIcon={enviando && <CircularProgress size={18} color="inherit" />}
          >
            {enviando ? "Enviando..." : "Enviar"}
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <VoltarButton
            label="Voltar para login"
            onClick={() => navigate("/login")}
            sx={{ mx: "auto" }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
