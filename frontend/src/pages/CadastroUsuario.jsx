import { useState, useContext } from "react";
import LetterGlitch from "../components/LetterGlitch.jsx";
import {
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
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
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Exibe onboarding apenas na primeira visita
    return !localStorage.getItem("onboardingUsuario");
  });
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    senha2: "",
    tipo: "cliente", // padrão
    descricao: "",
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
      senha,
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
        descricao: form.descricao,
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
        position: "relative",
        overflow: "hidden",
        px: { xs: 1, sm: 2 },
        py: { xs: 2, sm: 4 },
        paddingTop: { xs: 8, sm: 10, md: 12 },
      }}
      role="main"
      aria-label="Cadastro de novo usuário"
    >
      {/* Background LetterGlitch */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      >
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </Box>
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 5 },
          maxWidth: { xs: 340, sm: 400, md: 420 },
          width: "100%",
          borderRadius: 4,
          boxShadow: 6,
          mx: "auto",
          transition: "box-shadow 0.2s",
          position: "relative",
          zIndex: 1,
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
        }}
        role="form"
        aria-label="Formulário de cadastro de usuário"
      >
        {erro && (
          <Alert severity="error" sx={{ mb: 2, fontSize: { xs: 14, sm: 15 } }}>
            {erro}
          </Alert>
        )}
        {sucesso && (
          <Alert
            severity="success"
            sx={{ mb: 2, fontSize: { xs: 14, sm: 15 } }}
          >
            {sucesso}
          </Alert>
        )}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          aria-label="Formulário de cadastro de usuário"
          tabIndex={0}
        >
          <Tooltip title="Selecione seu perfil: comerciante ou cliente" arrow>
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
              sx={{ fontSize: { xs: 15, sm: 16 } }}
            >
              <option value="cliente">Cliente</option>
              <option value="comerciante">Comerciante</option>
            </TextField>
          </Tooltip>
          <Tooltip title="Digite seu nome completo" arrow>
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
              sx={{ fontSize: { xs: 15, sm: 16 } }}
            />
            <Tooltip title="Conte um pouco sobre você ou seu negócio" arrow>
              <TextField
                label="Descrição/Sobre"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                minRows={2}
                maxRows={5}
                inputProps={{
                  maxLength: 280,
                  "aria-label": "Descrição do usuário",
                }}
                placeholder="Conte um pouco sobre você ou seu negócio (máx. 280 caracteres)"
                sx={{ fontSize: { xs: 15, sm: 16 } }}
              />
            </Tooltip>
          </Tooltip>
          <Tooltip title="Informe um e-mail válido para contato e login" arrow>
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
              sx={{ fontSize: { xs: 15, sm: 16 } }}
            />
          </Tooltip>
          <Tooltip title="Crie uma senha forte para proteger sua conta" arrow>
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={showSenha ? "Ocultar senha" : "Mostrar senha"}
                    >
                      <IconButton
                        aria-label={
                          showSenha ? "Ocultar senha" : "Mostrar senha"
                        }
                        onClick={() => setShowSenha((v) => !v)}
                        edge="end"
                        tabIndex={0}
                      >
                        {showSenha ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              helperText={
                senhaForte
                  ? requisitosSenha
                  : "A senha deve conter letra maiúscula, minúscula, número e símbolo."
              }
              sx={{ fontSize: { xs: 15, sm: 16 } }}
            />
          </Tooltip>
          <Tooltip title="Repita a senha para confirmação" arrow>
            <TextField
              label="Confirmar senha"
              name="senha2"
              type={showSenha2 ? "text" : "password"}
              value={form.senha2}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 40, "aria-label": "Confirmar senha" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={showSenha2 ? "Ocultar senha" : "Mostrar senha"}
                    >
                      <IconButton
                        aria-label={
                          showSenha2 ? "Ocultar senha" : "Mostrar senha"
                        }
                        onClick={() => setShowSenha2((v) => !v)}
                        edge="end"
                        tabIndex={0}
                      >
                        {showSenha2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{ fontSize: { xs: 15, sm: 16 } }}
            />
          </Tooltip>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              fontWeight: 700,
              fontSize: { xs: 15, sm: 17 },
              py: 1.2,
              borderRadius: 3,
              boxShadow: 3,
              letterSpacing: 0.5,
              transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
              "&:hover": {
                boxShadow: 6,
                backgroundColor: "primary.dark",
                color: "#fff",
              },
              "&:focus-visible": {
                outline: "2px solid #1976d2",
                outlineOffset: 2,
              },
            }}
            aria-label="Cadastrar usuário"
          >
            Cadastrar
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2" sx={{ fontSize: { xs: 14, sm: 15 } }}>
            Já tem conta?{" "}
            <Button
              color="primary"
              size="small"
              onClick={() => navigate("/login")}
              aria-label="Ir para login"
              sx={{ fontWeight: 600, fontSize: { xs: 14, sm: 15 } }}
            >
              Faça login
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
