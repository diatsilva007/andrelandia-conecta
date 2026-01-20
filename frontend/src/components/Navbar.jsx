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
              Andrelândia Conecta
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
            {usuario && (
              <Button
                color="inherit"
                component={Link}
                to="/dashboard"
                sx={{
                  fontWeight: 600,
                  px: 2,
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                Dashboard
              </Button>
            )}
            <IconButton
              color="inherit"
              component={Link}
              to="/favoritos"
              sx={{ position: "relative", mx: 0.5 }}
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
            {usuario ? (
              <>
                {usuario.tipo === "comerciante" && (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      px: 2.5,
                      py: 1,
                      fontSize: 15,
                      boxShadow: "0 2px 8px #43a04733",
                      transition: "all 0.2s",
                      ml: 0.5,
                      display: { xs: "none", md: "inline-flex" },
                    }}
                    component={Link}
                    to="/comercios/novo"
                  >
                    Cadastrar
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="inherit"
                  size="medium"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    px: 2,
                    fontSize: 15,
                    borderColor: "#fff",
                    color: "#fff",
                    background: "rgba(255,255,255,0.08)",
                    transition: "all 0.2s",
                    ml: 0.5,
                    display: { xs: "none", sm: "inline-flex" },
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
                  size="medium"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    px: 2.5,
                    fontSize: 15,
                    boxShadow: "0 2px 8px #43a04733",
                    transition: "all 0.2s",
                    ml: 0.5,
                  }}
                  onClick={handleLogout}
                >
                  Sair
                </Button>
                <Tooltip title={usuario.nome} arrow>
                  <Box
                    component={Link}
                    to={`/perfil/${usuario.id}`}
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
                        usuario.imagem
                          ? `http://localhost:3333${usuario.imagem}`
                          : undefined
                      }
                      alt={usuario.nome}
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
                      {!usuario.imagem && usuario.nome?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: 15,
                        ml: 1,
                        display: { xs: "none", md: "block" },
                        background:
                          usuario.tipo === "comerciante"
                            ? "#43a047"
                            : "#1976d2",
                        borderRadius: 2,
                        px: 1.2,
                        py: 0.3,
                        boxShadow: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {usuario.tipo === "comerciante"
                        ? "Comerciante"
                        : "Cliente"}
                    </Typography>
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
              <Box display="flex" alignItems="center" gap={1}>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  to="/login"
                  size="medium"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    px: 2,
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
                  size="medium"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    px: 2.5,
                    fontSize: 15,
                    boxShadow: "0 2px 8px #43a04733",
                    transition: "all 0.2s",
                    ml: 0.5,
                  }}
                >
                  Registrar
                </Button>
              </Box>
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
        />
      )}
    </>
  );
}
