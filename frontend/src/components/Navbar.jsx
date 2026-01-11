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
        background:
          "linear-gradient(90deg, rgba(25,118,210,0.75) 0%, rgba(67,160,71,0.75) 100%)",
        backdropFilter: "blur(8px)",
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
          justifyContent: "center",
          alignItems: "center",
          px: 0,
          width: "100%",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={{ xs: 2.5, md: 6 }}
          sx={{
            width: "100%",
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: 1400,
          }}
        >
          {/* Logo + Título + Links/Botões juntos para garantir fechamento correto */}
          <Box
            display="flex"
            alignItems="center"
            gap={{ xs: 2.5, md: 6 }}
            sx={{ flexWrap: "wrap" }}
          >
            {/* Logo + Título */}
            <Box
              display="flex"
              alignItems="center"
              gap={1.2}
              sx={{ minWidth: 0 }}
            >
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                  borderRadius: "50%",
                  boxShadow: 2,
                  border: "2px solid #2563eb",
                  overflow: "hidden",
                }}
                aria-label="Logo Andrelândia Conecta"
                tabIndex={0}
              >
                <img
                  src="/andrelandia-conecta-logo.png"
                  alt="Logo Andrelândia Conecta"
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Box>
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
                  whiteSpace: "nowrap",
                  fontSize: { xs: 18, md: 24 },
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
            {/* Links e Botões */}
            {usuario ? (
              <Box
                display="flex"
                alignItems="center"
                gap={{ xs: 1, md: 2.5 }}
                sx={{ flexWrap: "wrap" }}
              >
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
                    transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                    background: "#1565c0",
                    color: "#fff",
                    transform: "scale(1)",
                    "&:hover": {
                      background: "#1976d2",
                      color: "#fff",
                      transform: "scale(1.07)",
                      boxShadow: "0 4px 16px #1565c044",
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
                        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                        transform: "scale(1)",
                        "&:hover": {
                          background: "#388e3c",
                          color: "#fff",
                          transform: "scale(1.07)",
                          boxShadow: "0 4px 16px #43a04744",
                        },
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
                    transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                    transform: "scale(1)",
                    "&:hover": {
                      background: "#e3f2fd",
                      color: "#1976d2",
                      borderColor: "#1976d2",
                      transform: "scale(1.07)",
                      boxShadow: "0 4px 16px #1976d244",
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
              <Box
                display="flex"
                alignItems="center"
                gap={{ xs: 1, md: 2.5 }}
                sx={{ flexWrap: "wrap" }}
              >
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
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
