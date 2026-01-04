import React, { useState, useContext } from "react";
import { useSnackbar } from "../components/SnackbarContext.jsx";
import { LoadingContext } from "../App.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { setSnackbar } = useSnackbar();
  const { setOpen } = useContext(LoadingContext);
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
  </Button>;
  const [showSenha, setShowSenha] = useState(false);
  const navigate = useNavigate();

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
      <Box
        maxWidth={400}
        width="100%"
        p={3}
        boxShadow={2}
        borderRadius={2}
        bgcolor="#fff"
      >
        <Typography variant="h5" mb={2} align="center">
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
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            aria-label="Entrar"
          >
            Entrar
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Não tem conta?{" "}
            <Button
              color="primary"
              size="small"
              onClick={() => navigate("/registrar")}
              aria-label="Ir para cadastro"
            >
              Cadastre-se
            </Button>
          </Typography>
          <Button
            color="primary"
            size="small"
            sx={{ mt: 1, mr: 1 }}
            onClick={() => navigate("/esqueci-senha")}
            aria-label="Ir para recuperação de senha"
          >
            Esqueci minha senha
          </Button>
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
      </Box>
    </Box>
  );
}
