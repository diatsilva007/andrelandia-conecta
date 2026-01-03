import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("usuario");
    if (token && userStr) {
      setUsuario(JSON.parse(userStr));
    } else {
      setUsuario(null);
    }
  }, [window.location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            transition: "color 0.2s, text-shadow 0.2s",
            "&:hover": {
              color: "#e0f2f1",
              textShadow: "0 2px 8px #1976d222",
              textDecoration: "underline",
            },
          }}
        >
          Andrelândia Conecta
        </Typography>
        {usuario ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography sx={{ color: "#fff", fontWeight: 500 }}>
              Olá, {usuario.nome}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Sair
            </Button>
          </Box>
        ) : (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={{
                textTransform: "none",
                fontWeight: 500,
                transition: "background 0.2s, color 0.2s",
                "&:hover": {
                  background: "#e3f2fd",
                  color: "#1976d2",
                },
              }}
            >
              Entrar
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/registrar"
              sx={{
                textTransform: "none",
                fontWeight: 500,
                transition: "background 0.2s, color 0.2s",
                "&:hover": {
                  background: "#e8f5e9",
                  color: "#43a047",
                },
              }}
            >
              Registrar
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
