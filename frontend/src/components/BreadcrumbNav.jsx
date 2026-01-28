import React, { useState } from "react";
import {
  Breadcrumbs,
  Link,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function BreadcrumbNav({ items }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  if (isMobile && items.length > 1) {
    // Mobile: mostra só o último, menu para expandir
    return (
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <IconButton
          size="small"
          onClick={handleOpen}
          aria-label="Mostrar caminho completo"
          sx={{ mr: 1 }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Typography color="text.primary" fontWeight={600} fontSize={15}>
          {items[items.length - 1].label}
        </Typography>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {items.map((item, idx) => (
            <MenuItem
              key={item.label}
              onClick={() => {
                handleClose();
                if (item.to) navigate(item.to);
              }}
              selected={idx === items.length - 1}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  // Desktop: breadcrumbs completos
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, fontSize: 15 }}>
      {items.map((item, idx) =>
        item.to ? (
          <Link
            key={item.label}
            underline="hover"
            color="inherit"
            onClick={() => navigate(item.to)}
            sx={{ cursor: "pointer", fontWeight: 500 }}
            tabIndex={0}
            aria-label={`Ir para ${item.label}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate(item.to);
            }}
            onFocus={(e) => (e.target.style.outline = "2px solid #1976d2")}
            onBlur={(e) => (e.target.style.outline = "none")}
            role="link"
          >
            {item.label}
          </Link>
        ) : (
          <Typography key={item.label} color="text.primary" fontWeight={600}>
            {item.label}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
}
