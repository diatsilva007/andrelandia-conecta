import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import TrocaTipoUsuarioDialog from "./TrocaTipoUsuarioDialog";

export default function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [openTrocaTipo, setOpenTrocaTipo] = useState(false);

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

  const handleTipoAtualizado = (novoTipo) => {
    // Atualiza localStorage e estado
    const userStr = localStorage.getItem("usuario");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      userObj.tipo = novoTipo;
      localStorage.setItem("usuario", JSON.stringify(userObj));
      setUsuario({ ...userObj });
      // Força reload para atualizar menus e permissões
      window.location.reload();
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      role="navigation"
      aria-label="Barra de navegação principal"
      sx={{
        background: "linear-gradient(90deg, #1976d2 0%, #43a047 100%)",
        boxShadow: "0 4px 24px #1976d222",
        borderRadius: 0,
        px: { xs: 2, md: 6 },
        py: 0.5,
        zIndex: 1201,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          display: "flex",
          justifyContent: "space-between",
          px: 0,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              bgcolor: "secondary.main",
              width: 40,
              height: 40,
              fontSize: 24,
              boxShadow: 2,
            }}
            aria-label="Logo do projeto"
            tabIndex={0}
          >
            🏪
          </Avatar>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            aria-label="Ir para página inicial"
            sx={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: 800,
              letterSpacing: 1.2,
              textShadow: "0 2px 8px #0002",
              transition: "color 0.2s, text-shadow 0.2s",
              outline: "none",
              "&:focus": {
                boxShadow: "0 0 0 3px #1565c055",
              },
              "&:hover": {
                color: "#e0f2f1",
                textShadow: "0 2px 8px #1976d222",
                textDecoration: "none",
              },
            }}
            tabIndex={0}
          >
            Andrelândia Conecta
          </Typography>
        </Box>
        {usuario ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                px: 2,
                py: 1,
                fontSize: 15,
                boxShadow: "0 2px 8px #1565c033",
                transition: "all 0.2s",
                background: "#1565c0",
                color: "#fff",
                "&:hover": {
                  background: "#1976d2",
                  color: "#fff",
                },
              }}
              component={Link}
              to="/dashboard"
            >
              Dashboard
            </Button>
            <Typography
              sx={{
                color: usuario.tipo === "comerciante" ? "#fff" : "#e0f2f1",
                fontWeight: 500,
                fontSize: 16,
                background:
                  usuario.tipo === "comerciante" ? "#43a047" : "#1976d2",
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                boxShadow: 1,
              }}
            >
              Olá, {usuario.nome}
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  marginLeft: 8,
                  textTransform: "uppercase",
                }}
              >
                [{usuario.tipo}]
              </span>
            </Typography>
            {usuario.tipo === "comerciante" && (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{
                    borderRadius: 3,
                    fontWeight: 700,
                    px: 2,
                    py: 1,
                    fontSize: 15,
                    boxShadow: "0 2px 8px #43a04733",
                    transition: "all 0.2s",
                  }}
                  component={Link}
                  to="/comercios/novo"
                >
                  Cadastrar Comércio
                </Button>
                {/* O botão de cadastrar produto precisa do id do comércio. Recomenda-se mover para dentro da página de detalhes do comércio. */}
              </>
            )}
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                px: 2,
                py: 0.7,
                fontSize: 14,
                borderColor: "#fff",
                color: "#fff",
                background: "rgba(255,255,255,0.08)",
                transition: "all 0.2s",
                "&:hover": {
                  background: "#e3f2fd",
                  color: "#1976d2",
                  borderColor: "#1976d2",
                },
              }}
              onClick={() => setOpenTrocaTipo(true)}
            >
              Trocar tipo
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                px: 2.5,
                py: 1,
                fontSize: 15,
                boxShadow: "0 2px 8px #43a04733",
                transition: "all 0.2s",
                "&:hover": {
                  background: "#388e3c",
                  color: "#fff",
                },
              }}
              onClick={handleLogout}
            >
              Sair
            </Button>
            <TrocaTipoUsuarioDialog
              open={openTrocaTipo}
              onClose={() => setOpenTrocaTipo(false)}
              usuario={usuario}
              onTipoAtualizado={handleTipoAtualizado}
            />
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={1.5}>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/login"
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                px: 2.5,
                py: 1,
                fontSize: 15,
                letterSpacing: 0.5,
                boxShadow: "0 2px 8px #1976d222",
                background: "rgba(255,255,255,0.08)",
                borderColor: "#fff",
                color: "#fff",
                transition: "all 0.2s",
                "&:hover": {
                  background: "#e3f2fd",
                  color: "#1976d2",
                  borderColor: "#1976d2",
                },
              }}
            >
              Entrar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/registrar"
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                px: 2.5,
                py: 1,
                fontSize: 15,
                boxShadow: "0 2px 8px #43a04733",
                transition: "all 0.2s",
                "&:hover": {
                  background: "#388e3c",
                  color: "#fff",
                },
              }}
            >
              Registrar
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
