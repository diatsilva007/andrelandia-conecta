import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Tooltip,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AnimatedMenuIcon from "./AnimatedMenuIcon.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import TrocaTipoUsuarioDialog from "./TrocaTipoUsuarioDialog";
import MenuDrawer from "./MenuDrawer";

export default function Navbar() {
  const { usuario, logout, setUsuario } = useUser();
  const [favoritosCount, setFavoritosCount] = useState(0);
  const navigate = useNavigate();
  const [openTrocaTipo, setOpenTrocaTipo] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const updateCount = () => {
      const favStr = localStorage.getItem("favoritos");
      setFavoritosCount(favStr ? JSON.parse(favStr).length : 0);
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("favoritos-updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("favoritos-updated", updateCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTipoAtualizado = (novoTipo) => {
    // Atualiza contexto e localStorage
    setUsuario((prev) => ({ ...prev, tipo: novoTipo }));
  };

  return (
    <>
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
            {/* Logo + Título */}
            <Box
              display="flex"
              alignItems="center"
              gap={1.2}
              sx={{ minWidth: 0 }}
            >
              {isMobile && (
                <AnimatedMenuIcon
                  open={drawerOpen}
                  onClick={() => setDrawerOpen((open) => !open)}
                  sx={{
                    mr: 1,
                    minWidth: 48,
                    minHeight: 48,
                    p: 1.2,
                    borderRadius: 2,
                  }}
                  aria-label={
                    drawerOpen
                      ? "Fechar menu de navegação"
                      : "Abrir menu de navegação"
                  }
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setDrawerOpen((open) => !open);
                  }}
                />
              )}
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
            {/* Navegação: Drawer no mobile, links no desktop */}
            {!isMobile &&
              (usuario ? (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={{ xs: 1, md: 2.5 }}
                  sx={{ flexWrap: "wrap" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      borderRadius: 3,
                      fontWeight: 700,
                      minWidth: 48,
                      minHeight: 48,
                      px: 3,
                      py: 1.5,
                      fontSize: 16,
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
                  <IconButton
                    component={Link}
                    to="/favoritos"
                    color="error"
                    sx={{
                      ml: 1,
                      fontSize: 28,
                      transition: "color 0.2s",
                      position: "relative",
                      "&:hover": {
                        color: "#ad1457",
                        transform: "scale(1.12)",
                      },
                    }}
                    aria-label="Ver favoritos"
                  >
                    <Tooltip title="Meus Favoritos" arrow>
                      <Box sx={{ position: "relative", display: "flex" }}>
                        <FavoriteIcon />
                        {favoritosCount > 0 && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: -6,
                              right: -8,
                              bgcolor: "#d32f2f",
                              color: "#fff",
                              borderRadius: "50%",
                              minWidth: 20,
                              height: 20,
                              fontSize: 13,
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: 2,
                              zIndex: 2,
                              px: 0.7,
                            }}
                          >
                            {favoritosCount}
                          </Box>
                        )}
                      </Box>
                    </Tooltip>
                  </IconButton>
                  <Box display="flex" alignItems="center" gap={1.2}>
                    <Tooltip title="Meu perfil" arrow>
                      <Box
                        component={Link}
                        to={`/perfil/${usuario.id}`}
                        sx={{
                          textDecoration: "none",
                          mr: 1,
                          cursor: "pointer",
                        }}
                      >
                        <Avatar
                          src={
                            usuario.imagem
                              ? `http://localhost:3333${usuario.imagem}`
                              : undefined
                          }
                          alt={usuario.nome}
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: "#1976d2",
                            fontWeight: 700,
                            fontSize: 22,
                            transition: "box-shadow 0.2s",
                            boxShadow: 2,
                            "&:hover": { boxShadow: 4 },
                          }}
                        >
                          {!usuario.imagem &&
                            usuario.nome?.charAt(0).toUpperCase()}
                        </Avatar>
                      </Box>
                    </Tooltip>
                    <Typography
                      sx={{
                        color:
                          usuario.tipo === "comerciante" ? "#fff" : "#e0f2f1",
                        fontWeight: 500,
                        fontSize: 16,
                        background:
                          usuario.tipo === "comerciante"
                            ? "#43a047"
                            : "#1976d2",
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.5,
                        boxShadow: 1,
                      }}
                    >
                      Olá, {usuario.nome}
                      {usuario.tipo === "comerciante"
                        ? " (Comerciante)"
                        : " (Cliente)"}
                    </Typography>
                  </Box>
                  {usuario.tipo === "comerciante" && (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      sx={{
                        borderRadius: 3,
                        fontWeight: 700,
                        minWidth: 48,
                        minHeight: 48,
                        px: 3,
                        py: 1.5,
                        fontSize: 16,
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
                  )}
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    sx={{
                      borderRadius: 3,
                      fontWeight: 600,
                      minWidth: 48,
                      minHeight: 48,
                      px: 3,
                      py: 1.5,
                      fontSize: 15,
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
                    size="large"
                    sx={{
                      borderRadius: 3,
                      fontWeight: 700,
                      minWidth: 48,
                      minHeight: 48,
                      px: 3,
                      py: 1.5,
                      fontSize: 16,
                      boxShadow: "0 2px 8px #43a04733",
                      transition: "all 0.2s",
                      "&:hover": { background: "#388e3c", color: "#fff" },
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
                    size="large"
                    sx={{
                      borderRadius: 3,
                      fontWeight: 600,
                      minWidth: 48,
                      minHeight: 48,
                      px: 3,
                      py: 1.5,
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
                    size="large"
                    sx={{
                      borderRadius: 3,
                      fontWeight: 700,
                      minWidth: 48,
                      minHeight: 48,
                      px: 3,
                      py: 1.5,
                      fontSize: 15,
                      boxShadow: "0 2px 8px #43a04733",
                      transition: "all 0.2s",
                      "&:hover": { background: "#388e3c", color: "#fff" },
                    }}
                  >
                    Registrar
                  </Button>
                </Box>
              ))}
          </Box>
        </Toolbar>
      </AppBar>
      {/* Drawer lateral para mobile */}
      {isMobile && (
        <MenuDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          usuario={usuario}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
