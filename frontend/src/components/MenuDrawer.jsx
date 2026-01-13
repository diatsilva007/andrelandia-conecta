import React, { useState } from "react";
<List>
  {menuItems.map((item) => (
    <ListItem key={item.text} disablePadding>
      <ListItemButton
        component={Link}
        to={item.to}
        selected={location.pathname === item.to}
        aria-current={location.pathname === item.to ? "page" : undefined}
        aria-label={`Ir para ${item.text}`}
        sx={{
          minHeight: 56,
          minWidth: 48,
          px: 2,
          py: 1.5,
          borderRadius: 2,
          ...(location.pathname === item.to
            ? { bgcolor: "action.selected" }
            : {}),
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
        <ListItemText
          primary={item.text}
          primaryTypographyProps={{ fontSize: 16 }}
        />
      </ListItemButton>
    </ListItem>
  ))}
</List>;
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

export default function MenuDrawer({ open, onClose, usuario, onLogout }) {
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
      </Box>
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
    </Drawer>
  );
}
