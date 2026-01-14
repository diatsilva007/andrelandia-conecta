import React, { useState, useEffect } from "react";
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
import EditarPerfilDialog from "./EditarPerfilDialog.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import TrocaTipoUsuarioDialog from "./TrocaTipoUsuarioDialog.jsx";

function stringAvatar(name) {
  if (!name) return { children: <PersonIcon fontSize="large" /> };
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return { children: initials };
}

export default function MenuDrawer({ open, onClose, onLogout }) {
  const { usuario } = useUser();
  const [favoritosCount, setFavoritosCount] = useState(0);

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
  const location = useLocation();
  const [editarPerfilOpen, setEditarPerfilOpen] = useState(false);
  const [trocaTipoOpen, setTrocaTipoOpen] = useState(false);
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
    {
      text: "Favoritos",
      icon: (
        <Box sx={{ position: "relative", display: "flex" }}>
          <FavoriteBorderIcon sx={{ color: "#d32f2f" }} />
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
      ),
      to: "/favoritos",
    },
  ].filter(Boolean);

  // Ícone e cor para tipo de usuário
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

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 260, pt: 2 }} role="presentation" onClick={onClose}>
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
                sx={{
                  width: 56,
                  height: 56,
                  mb: 1,
                  bgcolor: "primary.main",
                  fontWeight: 700,
                  fontSize: 22,
                }}
                {...stringAvatar(usuario?.nome)}
              />
              <Typography
                sx={{ fontWeight: 700, fontSize: 16, mb: 0.5, textAlign: "center" }}
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
                    setEditarPerfilOpen(true);
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
                    setTrocaTipoOpen(true);
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
            {/* Só renderiza dialogs se usuario estiver definido */}
            <EditarPerfilDialog
              open={editarPerfilOpen}
              onClose={() => setEditarPerfilOpen(false)}
              onSuccess={() => setEditarPerfilOpen(false)}
            />
            <TrocaTipoUsuarioDialog
              open={trocaTipoOpen}
              onClose={() => setTrocaTipoOpen(false)}
              usuario={usuario}
              onTipoAtualizado={(novoTipo) => {
                // Atualiza localStorage
                const userStr = localStorage.getItem("usuario");
                if (userStr) {
                  const userObj = JSON.parse(userStr);
                  userObj.tipo = novoTipo;
                  localStorage.setItem("usuario", JSON.stringify(userObj));
                  setTrocaTipoOpen(false);
                  onClose && onClose(); // Fecha o Drawer
                  setTimeout(() => {
                    window.location.reload();
                  }, 250);
                }
              }}
            />
          </>
        ) : (
          <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Bem-vindo!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
              sx={{ mb: 2, minWidth: 120, fontWeight: 700 }}
              onClick={onClose}
            >
              Entrar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              component={Link}
              to="/registrar"
              sx={{ minWidth: 120, fontWeight: 700 }}
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
