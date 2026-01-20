import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeMode } from "../contexts/ThemeContext.jsx";

export default function ThemeToggleButton() {
  const { mode, toggleTheme } = useThemeMode();
  return (
    <Tooltip title={mode === "dark" ? "Modo claro" : "Modo escuro"}>
      <IconButton
        color="inherit"
        onClick={toggleTheme}
        size="large"
        aria-label="Alternar tema"
      >
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}
