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
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "react-router-dom";

export default function MenuDrawer({ open, onClose, usuario, onLogout }) {
  const navigate = useNavigate();
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
  ].filter(Boolean);

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 250, pt: 2 }} role="presentation" onClick={onClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Avatar sx={{ width: 56, height: 56, mb: 1 }}>
            <PersonIcon />
          </Avatar>
          <Box sx={{ fontWeight: 700, fontSize: 16, mb: 0.5 }}>
            {usuario?.nome || "Usuário"}
          </Box>
          <Box sx={{ fontSize: 13, color: "text.secondary" }}>
            {usuario?.tipo?.toUpperCase() || "CLIENTE"}
          </Box>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.to}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={onLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
