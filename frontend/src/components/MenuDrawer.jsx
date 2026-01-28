import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Avatar,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import BusinessIcon from "@mui/icons-material/Business";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";
import { Skeleton } from "@mui/material";

//

export default function MenuDrawer({
  open,
  onClose,
  onLogout,
  usuario: usuarioProp,
}) {
  const { usuario: usuarioCtx, loadingUser } = useUser();
  const usuario = usuarioProp || usuarioCtx;
  const location = useLocation();

  // Enquanto restaura usuário, não renderiza nada (ou pode exibir um skeleton se quiser)
  if (loadingUser) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{ zIndex: 1400 }}
        PaperProps={{ sx: { zIndex: 1400 } }}
      >
        <Box sx={{ width: 260, pt: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Skeleton
              variant="circular"
              width={56}
              height={56}
              sx={{ mb: 1 }}
            />
            <Skeleton variant="text" width={120} height={28} sx={{ mb: 1 }} />
            <Skeleton
              variant="rectangular"
              width={80}
              height={24}
              sx={{ mb: 2, borderRadius: 2 }}
            />
          </Box>
          <Divider />
          <List>
            {[1, 2, 3, 4].map((i) => (
              <ListItem key={i} disablePadding>
                <ListItemButton disabled>
                  <ListItemIcon>
                    <Skeleton variant="circular" width={24} height={24} />
                  </ListItemIcon>
                  <Skeleton variant="text" width={90} height={24} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    );
  }
  // Estados de diálogo agora controlados pelo componente pai
  const tipoChip =
    usuario?.tipo === "comerciante"
      ? {
          label: "Comerciante",
          color: "success",
          icon: <BusinessIcon fontSize="small" />,
        }
      : {
          label: "Cliente",
          color: "primary",
          icon: <PersonIcon fontSize="small" />,
        };
  const menuItems = [
    { text: "Início", icon: <HomeIcon />, to: "/" },
    usuario?.tipo === "comerciante"
      ? {
          text: "Cadastrar Comércio",
          icon: <StoreIcon />,
          to: "/comercios/novo",
        }
      : null,
    { text: "Dashboard", icon: <ShoppingCartIcon />, to: "/dashboard" },
    { text: "Histórico", icon: <ShoppingCartIcon />, to: "/historico" },
    { text: "Favoritos", icon: <FavoriteBorderIcon />, to: "/favoritos" },
  ];
  // Funções para acionar diálogos via props
  const { onEditarPerfil, onTrocaTipo } = arguments[0] || {};
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      PaperProps={{ sx: { zIndex: 1400 } }}
      ModalProps={{
        onRendered: () => {
          // Foca no Drawer ao abrir para acessibilidade
          const drawer = document.querySelector('[role="presentation"]');
          if (drawer) drawer.focus();
        },
      }}
    >
      <Box
        sx={{ width: 260, pt: 4 }}
        role="presentation"
        tabIndex={-1}
        onClick={onClose}
      >
        {usuario ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
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
                  width: 56,
                  height: 56,
                  mb: 1,
                  bgcolor: "primary.main",
                  fontWeight: 700,
                  fontSize: 22,
                }}
              >
                {!usuario.imagem && usuario.nome?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  mb: 0.5,
                  textAlign: "center",
                }}
              >
                {usuario?.nome || "Usuário"}
              </Typography>
              <Chip
                label={tipoChip.label}
                color={tipoChip.color}
                icon={tipoChip.icon}
                size="small"
                sx={{ fontWeight: 600, fontSize: 13, mb: 1 }}
                aria-label={`Tipo de usuário: ${tipoChip.label}`}
              />
            </Box>
            <Divider />
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.to}
                    selected={location.pathname === item.to}
                    aria-current={
                      location.pathname === item.to ? "page" : undefined
                    }
                    sx={
                      location.pathname === item.to
                        ? { bgcolor: "action.selected" }
                        : {}
                    }
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose && onClose();
                    onEditarPerfil && onEditarPerfil();
                  }}
                  aria-label="Editar Perfil"
                  selected={false}
                >
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText primary="Editar Perfil" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose && onClose();
                    onTrocaTipo && onTrocaTipo();
                  }}
                  aria-label="Trocar tipo de usuário"
                  selected={false}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Trocar tipo" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider sx={{ my: 1 }} />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={onLogout} aria-label="Sair da conta">
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sair" />
                </ListItemButton>
              </ListItem>
            </List>
            {/* Diálogos agora são controlados e renderizados pelo componente pai */}
          </>
        ) : (
          <Box
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Bem-vindo!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
              sx={{
                mb: 2,
                minWidth: 140,
                fontWeight: 800,
                px: 3,
                py: 1.3,
                borderRadius: 2.5,
                fontSize: 17,
                letterSpacing: 0.5,
                boxShadow: "0 2px 8px #1976d222",
                background: "linear-gradient(90deg, #1976d2 60%, #43a047 100%)",
                color: "#fff",
                textTransform: "none",
                transition: "background 0.2s, color 0.2s",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #43a047 60%, #1976d2 100%)",
                  color: "#fff",
                },
              }}
              onClick={onClose}
            >
              Entrar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              component={Link}
              to="/registrar"
              sx={{
                minWidth: 140,
                fontWeight: 800,
                px: 3,
                py: 1.3,
                borderRadius: 2.5,
                fontSize: 17,
                letterSpacing: 0.5,
                border: "2px solid #43a047",
                color: "#43a047",
                background: "#fff",
                textTransform: "none",
                transition: "background 0.2s, color 0.2s, border 0.2s",
                "&:hover": {
                  background: "#43a047",
                  color: "#fff",
                  border: "2px solid #1976d2",
                },
              }}
              onClick={onClose}
            >
              Registrar
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
