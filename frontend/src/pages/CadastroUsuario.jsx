import { useState } from "react";
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
import { useNavigate } from "react-router-dom";

export default function CadastroUsuario() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    senha2: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showSenha2, setShowSenha2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [senhaForte, setSenhaForte] = useState(true);
  const navigate = useNavigate();

  const requisitosSenha =
    "Mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo";

  function validarSenha(senha) {
    // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
      senha
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "senha") {
      setSenhaForte(validarSenha(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    if (!senhaForte) {
      setErro("A senha não atende aos requisitos de segurança.");
      return;
    }
    if (form.senha !== form.senha2) {
      setErro("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:3333/usuarios", {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
      });
      setSucesso("Usuário cadastrado com sucesso! Faça login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao cadastrar usuário");
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
          Criar Conta
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
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            autoFocus
          />
          <TextField
            label="E-mail"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ "aria-label": "E-mail" }}
          />
          <TextField
            label="Senha"
            name="senha"
            type={showSenha ? "text" : "password"}
            value={form.senha}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ "aria-label": "Senha" }}
            helperText={requisitosSenha}
            error={!senhaForte && form.senha.length > 0}
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
            label="Confirmar Senha"
            name="senha2"
            type={showSenha2 ? "text" : "password"}
            value={form.senha2}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ "aria-label": "Confirmar Senha" }}
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
            aria-label="Registrar"
            endIcon={loading && <CircularProgress size={18} color="inherit" />}
          >
            {loading ? "Registrando..." : "Registrar"}
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Já tem conta?{" "}
            <Button
              color="primary"
              size="small"
              onClick={() => navigate("/login")}
              aria-label="Ir para login"
            >
              Faça login
            </Button>
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            startIcon={<span style={{ fontSize: 18 }}>🏠</span>}
            sx={{
              mt: 2,
              px: 3,
              py: 1.2,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: 0.5,
              boxShadow: "0 2px 8px #1976d222",
              background: "#fff",
              borderColor: "#1976d2",
              color: "#1976d2",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              "&:hover": {
                background: "linear-gradient(90deg, #e3f2fd 0%, #fff 100%)",
                boxShadow: "0 4px 16px #1976d222",
                borderColor: "#1565c0",
                color: "#1565c0",
              },
            }}
            onClick={() => navigate("/")}
            aria-label="Voltar para página principal"
          >
            Voltar para página principal
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
