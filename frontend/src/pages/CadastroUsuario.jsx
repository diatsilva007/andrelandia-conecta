import { useState, useContext } from "react";
import { useSnackbar } from "../components/SnackbarContext.jsx";
import { LoadingContext } from "../App.jsx";
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
    tipo: "cliente", // padrão
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const { setSnackbar } = useSnackbar();
  const [showSenha, setShowSenha] = useState(false);
  const [showSenha2, setShowSenha2] = useState(false);
  const { setOpen } = useContext(LoadingContext);
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
      const msg = "A senha não atende aos requisitos de segurança.";
      setErro(msg);
      setSnackbar({ open: true, message: msg, severity: "error" });
      return;
    }
    if (form.senha !== form.senha2) {
      const msg = "As senhas não coincidem.";
      setErro(msg);
      setSnackbar({ open: true, message: msg, severity: "error" });
      return;
    }
    setOpen(true);
    try {
      await axios.post("http://localhost:3333/usuarios", {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        tipo: form.tipo,
      });
      setSucesso("Usuário cadastrado com sucesso! Faça login.");
      setSnackbar({
        open: true,
        message: "Usuário cadastrado com sucesso! Faça login.",
        severity: "success",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao cadastrar usuário";
      setErro(msg);
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        py: 4,
      }}
      role="main"
      aria-label="Cadastro de novo usuário"
    >
      <Paper
        sx={{
          p: { xs: 3, md: 5 },
          maxWidth: 420,
          width: "100%",
          borderRadius: 4,
          boxShadow: 6,
        }}
        role="form"
        aria-label="Formulário de cadastro de usuário"
      >
        <Typography
          variant="h5"
          mb={2.5}
          align="center"
          fontWeight={700}
          letterSpacing={0.5}
          tabIndex={0}
          sx={{ outline: "none" }}
        >
          Criar Conta
        </Typography>
        {erro && (
          <Alert severity="error" sx={{ mb: 2, fontSize: 15 }}>
            {erro}
          </Alert>
        )}
        {sucesso && (
          <Alert severity="success" sx={{ mb: 2, fontSize: 15 }}>
            {sucesso}
          </Alert>
        )}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          aria-label="Formulário de cadastro de usuário"
          tabIndex={0}
        >
          <TextField
            select
            label="Tipo de usuário"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            SelectProps={{ native: true }}
            inputProps={{ "aria-label": "Tipo de usuário" }}
          >
            <option value="cliente">Cliente</option>
            <option value="comerciante">Comerciante</option>
          </TextField>
          <TextField
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            autoFocus
            inputProps={{ maxLength: 60, "aria-label": "Nome do usuário" }}
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
            inputProps={{ maxLength: 80, "aria-label": "E-mail" }}
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
            inputProps={{ maxLength: 40, "aria-label": "Senha" }}
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
            inputProps={{ maxLength: 40, "aria-label": "Confirmar Senha" }}
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
            sx={{ mt: 2, fontWeight: 600, fontSize: 16, borderRadius: 3 }}
            aria-label="Registrar"
          >
            Registrar
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
              sx={{ fontWeight: 500, fontSize: 15 }}
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
