import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

export default function RedefinirSenha() {
  const { token } = useParams();
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showSenha2, setShowSenha2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  const requisitosSenha =
    "Mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo";

  function validarSenha(s) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
      s
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    if (!validarSenha(senha)) {
      setErro("A senha não atende aos requisitos de segurança.");
      return;
    }
    if (senha !== senha2) {
      setErro("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      // Endpoint fictício, ajuste conforme backend
      await axios.post(`http://localhost:3333/auth/redefinir-senha/${token}`, {
        senha,
      });
      setSucesso("Senha redefinida com sucesso! Faça login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao redefinir senha");
    } finally {
      setLoading(false);
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
          Redefinir Senha
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
            label="Nova Senha"
            type={showSenha ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            fullWidth
            margin="normal"
            required
            helperText={requisitosSenha}
            inputProps={{ "aria-label": "Nova Senha" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowSenha((s) => !s)}
                    edge="end"
                  >
                    {showSenha ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirmar Nova Senha"
            type={showSenha2 ? "text" : "password"}
            value={senha2}
            onChange={(e) => setSenha2(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ "aria-label": "Confirmar Nova Senha" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showSenha2 ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowSenha2((s) => !s)}
                    edge="end"
                  >
                    {showSenha2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
            endIcon={loading && <CircularProgress size={18} color="inherit" />}
          >
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Button
            color="primary"
            size="small"
            onClick={() => navigate("/login")}
          >
            Voltar para login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
