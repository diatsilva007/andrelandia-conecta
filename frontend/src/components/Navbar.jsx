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
import ThemeToggleButton from "./ThemeToggleButton.jsx";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import EditarPerfilDialog from "./EditarPerfilDialog.jsx";
import TrocaTipoUsuarioDialog from "./TrocaTipoUsuarioDialog";
import MenuDrawer from "./MenuDrawer";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";

export default function Navbar() {
  const { usuario, logout, setUsuario } = useUser();
  const [favoritosCount, setFavoritosCount] = useState(0);
  const navigate = useNavigate();
  const [openTrocaTipo, setOpenTrocaTipo] = useState(false);
  const [openEditarPerfil, setOpenEditarPerfil] = useState(false);
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
            "linear-gradient(90deg, rgba(25,118,210,0.85) 0%, rgba(67,160,71,0.85) 100%)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 2px 8px #1976d222",
          borderRadius: 0,
          px: { xs: 1, md: 3 },
          py: 0,
          minHeight: 56,
          zIndex: 1201,
        }}
      >
        <Toolbar
          sx={{
            minHeight: 56,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 0,
            width: "100%",
          }}
        >
          {/* Bloco esquerdo: logo, título, toggle */}
          <Box display="flex" alignItems="center" gap={2} sx={{ minWidth: 0 }}>
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
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.paper",
                borderRadius: "50%",
                boxShadow: 2,
                border: "2px solid #2563eb",
                overflow: "hidden",
                mr: { xs: 1, md: 0 },
                flexShrink: 0,
              }}
              aria-label="Logo Andrelândia Conecta"
              tabIndex={0}
            >
              <img
                src="/andrelandia-conecta-logo.png"
                alt="Logo Andrelândia Conecta"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
            <Typography
              variant="h5"
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
                fontSize: { xs: 15, sm: 18, md: 24 },
                ml: 1,
                display: "block",
                alignSelf: "center",
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
              <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                Andrelândia Conecta
              </span>
            </Typography>
            <Box sx={{ ml: { xs: 0.5, md: 2 } }}>
              <ThemeToggleButton />
            </Box>
          </Box>
          {/* Bloco direito: ações e perfil */}
          <Box
            display={{ xs: "none", sm: "flex" }}
            alignItems="center"
            gap={{ xs: 0.5, md: 1.5 }}
          >
            {usuario ? (
              <>
                {/* Dashboard sempre primeiro */}
                <Button
                  color="primary"
                  component={Link}
                  to="/dashboard"
                  startIcon={
                    <span style={{ fontWeight: 700, fontSize: 18 }}>📊</span>
                  }
                  sx={{
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    borderRadius: 2.5,
                    background: "#fff",
                    color: "#1976d2",
                    boxShadow: "0 2px 8px #1976d222",
                    textTransform: "none",
                    fontSize: 16,
                    letterSpacing: 0.5,
                    ml: 1,
                    border: "2px solid #1976d2",
                    minHeight: 44,
                    transition: "background 0.2s, color 0.2s, border 0.2s",
                    "&:hover": {
                      background: "#1976d2",
                      color: "#fff",
                      border: "2px solid #1565c0",
                    },
                  }}
                >
                  Dashboard
                </Button>
                {/* Cadastrar (comerciante) */}
                {usuario?.tipo === "comerciante" && (
                  <Button
                    variant="contained"
                    size="medium"
                    startIcon={<AddBusinessIcon />}
                    sx={{
                      borderRadius: 2.5,
                      fontWeight: 700,
                      px: 3,
                      py: 1.2,
                      fontSize: 16,
                      background: "#fff",
                      color: "#1976d2",
                      boxShadow: "0 2px 8px #1976d222",
                      textTransform: "none",
                      letterSpacing: 0.5,
                      ml: 1,
                      border: "2px solid #1976d2",
                      minHeight: 44,
                      transition: "background 0.2s, color 0.2s, border 0.2s",
                      "&:hover": {
                        background: "#1976d2",
                        color: "#fff",
                        border: "2px solid #1565c0",
                      },
                    }}
                    component={Link}
                    to="/comercios/novo"
                  >
                    Cadastrar
                  </Button>
                )}
                {/* Trocar tipo */}
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<SwapHorizIcon />}
                  sx={{
                    borderRadius: 2.5,
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                    fontSize: 16,
                    border: "2px solid #1976d2",
                    color: "#1976d2",
                    background: "#fff",
                    textTransform: "none",
                    letterSpacing: 0.5,
                    ml: 1,
                    minHeight: 44,
                    transition: "background 0.2s, color 0.2s, border 0.2s",
                    "&:hover": {
                      background: "#1976d2",
                      color: "#fff",
                      border: "2px solid #1565c0",
                    },
                  }}
                  onClick={() => setOpenTrocaTipo(true)}
                >
                  Trocar tipo
                </Button>
                {/* Botão de favoritos */}
                <Tooltip title="Meus favoritos" arrow>
                  <IconButton
                    component={Link}
                    to="/favoritos"
                    sx={{
                      position: "relative",
                      mx: 0.5,
                      color: "#e53935",
                      transition: "color 0.2s, background 0.2s",
                      background:
                        favoritosCount > 0
                          ? "rgba(229,57,53,0.08)"
                          : "transparent",
                      "&:hover": {
                        background: "#fff",
                      },
                    }}
                    aria-label="Favoritos"
                  >
                    <FavoriteIcon fontSize="medium" />
                    {favoritosCount > 0 && (
                      <Box
                        sx={{
                          minWidth: 18,
                          height: 18,
                          bgcolor: "#e53935",
                          color: "#fff",
                          borderRadius: "50%",
                          fontSize: 11,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          px: 0.5,
                          position: "absolute",
                          top: 2,
                          right: 2,
                          border: "2px solid #fff",
                        }}
                      >
                        {favoritosCount}
                      </Box>
                    )}
                  </IconButton>
                </Tooltip>
                {/* Botão de histórico */}
                <Tooltip title="Histórico" arrow>
                  <IconButton
                    component={Link}
                    to="/historico"
                    sx={{
                      position: "relative",
                      mx: 0.5,
                      color: "#222",
                      transition: "color 0.2s, background 0.2s",
                      background: "transparent",
                      borderRadius: 2,
                      "&:hover": {
                        background: "#f5f5f5",
                      },
                    }}
                    aria-label="Histórico"
                  >
                    <HistoryIcon fontSize="medium" />
                  </IconButton>
                </Tooltip>
                {/* Sair */}
                <Button
                  variant="contained"
                  color="error"
                  size="medium"
                  startIcon={<LogoutIcon />}
                  sx={{
                    borderRadius: 2.5,
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    fontSize: 16,
                    background: "#e53935",
                    color: "#fff",
                    textTransform: "none",
                    letterSpacing: 0.5,
                    ml: 1,
                    minHeight: 44,
                    transition: "background 0.2s",
                    "&:hover": {
                      background: "#b71c1c",
                    },
                  }}
                  onClick={handleLogout}
                >
                  Sair
                </Button>
                {/* Avatar + tipo de usuário */}
                <Tooltip title={usuario?.nome || "Usuário"} arrow>
                  <Box
                    component={Link}
                    to={usuario?.id ? `/perfil/${usuario.id}` : "#"}
                    sx={{
                      textDecoration: "none",
                      ml: 1.5,
                      mr: 0.5,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      src={
                        usuario?.imagem
                          ? `http://localhost:3333${usuario.imagem}`
                          : undefined
                      }
                      alt={usuario?.nome || "Usuário"}
                      sx={{
                        width: 38,
                        height: 38,
                        bgcolor: "#1976d2",
                        fontWeight: 700,
                        fontSize: 20,
                        boxShadow: 2,
                        border: "2px solid #fff",
                        transition: "box-shadow 0.2s",
                        "&:hover": { boxShadow: 4 },
                      }}
                    >
                      {!usuario?.imagem &&
                        usuario?.nome?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box
                      sx={{
                        ml: 1,
                        display: { xs: "none", sm: "flex" },
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color:
                            usuario?.tipo === "comerciante" ? "#fff" : "#fff",
                          fontWeight: 700,
                          fontSize: 14,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          background:
                            usuario?.tipo === "comerciante"
                              ? "linear-gradient(90deg, #43a047 60%, #1976d2 100%)"
                              : "linear-gradient(90deg, #1976d2 60%, #43a047 100%)",
                          boxShadow: 2,
                          border:
                            usuario?.tipo === "comerciante"
                              ? "2px solid #43a047"
                              : "2px solid #1976d2",
                          letterSpacing: 0.5,
                          textShadow: "0 2px 8px #0002",
                        }}
                      >
                        {usuario?.tipo === "comerciante"
                          ? "Comerciante"
                          : "Cliente"}
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>
                <TrocaTipoUsuarioDialog
                  open={openTrocaTipo}
                  onClose={() => setOpenTrocaTipo(false)}
                  usuario={usuario}
                  onTipoAtualizado={handleTipoAtualizado}
                />
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/login")}
                  sx={{
                    fontWeight: 800,
                    ml: 1.5,
                    px: 3,
                    py: 1.2,
                    borderRadius: 2.5,
                    fontSize: 16,
                    letterSpacing: 0.5,
                    boxShadow: "0 2px 8px #1976d222",
                    background:
                      "linear-gradient(90deg, #1976d2 60%, #43a047 100%)",
                    color: "#fff",
                    textTransform: "none",
                    minHeight: 44,
                    transition: "background 0.2s, color 0.2s",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #43a047 60%, #1976d2 100%)",
                      color: "#fff",
                    },
                  }}
                >
                  Entrar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/registrar")}
                  sx={{
                    fontWeight: 800,
                    ml: 1.5,
                    px: 3,
                    py: 1.2,
                    borderRadius: 2.5,
                    fontSize: 16,
                    letterSpacing: 0.5,
                    border: "2px solid #43a047",
                    color: "#43a047",
                    background: "#fff",
                    textTransform: "none",
                    minHeight: 44,
                    transition: "background 0.2s, color 0.2s, border 0.2s",
                    "&:hover": {
                      background: "#43a047",
                      color: "#fff",
                      border: "2px solid #1976d2",
                    },
                  }}
                >
                  Registrar
                </Button>
              </>
            )}
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
          onEditarPerfil={() => setOpenEditarPerfil(true)}
          onTrocaTipo={() => setOpenTrocaTipo(true)}
        />
      )}
      {/* Diálogos globais controlados pelo Navbar */}
      <EditarPerfilDialog
        open={openEditarPerfil}
        onClose={() => setOpenEditarPerfil(false)}
        onSuccess={() => setOpenEditarPerfil(false)}
      />
      <TrocaTipoUsuarioDialog
        open={openTrocaTipo}
        onClose={() => setOpenTrocaTipo(false)}
        usuario={usuario}
        onTipoAtualizado={handleTipoAtualizado}
      />
    </>
  );
}
