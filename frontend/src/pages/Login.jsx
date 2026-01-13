import VoltarButton from "../components/VoltarButton.jsx";
import React, { useState, useContext } from "react";
import { useSnackbar } from "../components/SnackbarContext.jsx";
import { LoadingContext } from "../App.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  const [showSenha, setShowSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setSnackbar } = useSnackbar();

  // Redireciona se já estiver logado
  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setOpen(true);
    try {
      const res = await axios.post("http://localhost:3333/auth/login", {
        email,
        senha,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
      setSnackbar({
        open: true,
        message: "Login realizado com sucesso!",
        severity: "success",
      });
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao fazer login";
      setErro(msg);
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      width="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
      px={{ xs: 1, sm: 2 }}
      py={{ xs: 2, sm: 4 }}
      // Espaçamento padrão para separar da navbar
      paddingTop={{ xs: 8, sm: 10, md: 12 }} // 64px, 80px, 96px
    >
      <Box
        maxWidth={{ xs: 340, sm: 400, md: 420 }}
        width="100%"
        p={{ xs: 2, sm: 3, md: 4 }}
        boxShadow={3}
        borderRadius={3}
        bgcolor="#fff"
        mx="auto"
        sx={{ transition: "box-shadow 0.2s" }}
      >
        <Typography
          variant="h5"
          mb={{ xs: 2, sm: 3 }}
          align="center"
          fontWeight={700}
        >
          Login
        </Typography>
        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
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
            inputProps={{ "aria-label": "E-mail" }}
            sx={{ mb: 2, fontSize: { xs: 15, sm: 16 } }}
          />
          <TextField
            label="Senha"
            type={showSenha ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ "aria-label": "Senha" }}
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
            sx={{ fontSize: { xs: 15, sm: 16 } }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              py: 1.2,
              fontWeight: 700,
              fontSize: { xs: 15, sm: 16 },
              borderRadius: 3,
              boxShadow: 3,
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
            aria-label="Entrar"
          >
            Entrar
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2" sx={{ mb: 1 }}>
            Não tem conta?{" "}
            <Button
              color="primary"
              size="small"
              onClick={() => navigate("/registrar")}
              aria-label="Ir para cadastro"
              sx={{ fontWeight: 600 }}
            >
              Cadastre-se
            </Button>
          </Typography>
          <Button
            color="primary"
            size="small"
            sx={{ mt: 1, mr: 1, fontWeight: 600, fontSize: { xs: 14, sm: 15 } }}
            onClick={() => navigate("/esqueci-senha")}
            aria-label="Ir para recuperação de senha"
          >
            Esqueci minha senha
          </Button>
          <VoltarButton
            label="Voltar para página principal"
            onClick={() => navigate("/")}
            startIcon={<span style={{ fontSize: 18 }}>🏠</span>}
            sx={{
              mt: 2,
              px: { xs: 2, sm: 3 },
              py: 1.2,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: { xs: 15, sm: 16 },
              letterSpacing: 0.5,
              boxShadow: "0 2px 8px #1976d222",
              background: "#fff",
              borderColor: "#1976d2",
              color: "#1976d2",
              transition: "all 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #e3f2fd 0%, #fff 100%)",
                boxShadow: "0 4px 16px #1976d222",
                borderColor: "#1565c0",
                color: "#1565c0",
              },
            }}
            aria-label="Voltar para página principal"
          />
        </Box>
      </Box>
    </Box>
  );
}
