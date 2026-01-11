import React from "react";
import { IconButton } from "@mui/material";

/**
 * Animated hamburger menu icon (3 bars → X) com transição suave.
 * Props:
 * - open: boolean (true = X, false = hambúrguer)
 * - onClick: função
 * - sx: estilos adicionais
 */
export default function AnimatedMenuIcon({ open, onClick, sx = {}, ...props }) {
  return (
    <IconButton
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      onClick={onClick}
      sx={{
        width: 48,
        height: 48,
        position: "relative",
        transition: "background 0.2s",
        ...sx,
      }}
      {...props}
    >
      <span
        style={{
          display: "block",
          width: 28,
          height: 22,
          position: "relative",
        }}
      >
        {/* Linha 1 */}
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 28,
            height: 4,
            borderRadius: 2,
            background: open ? "#d32f2f" : "#222",
            boxShadow: open ? "0 2px 8px #d32f2f44" : "0 2px 8px #2222",
            transform: open
              ? "translateY(9px) rotate(45deg)"
              : "translateY(0) rotate(0deg)",
            transition:
              "background 0.2s, box-shadow 0.2s, transform 0.32s cubic-bezier(.4,0,.2,1)",
          }}
        />
        {/* Linha 2 */}
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 9,
            width: 28,
            height: 4,
            borderRadius: 2,
            background: open ? "#d32f2f" : "#222",
            opacity: open ? 0 : 1,
            transform: open ? "scaleX(0.5)" : "scaleX(1)",
            transition:
              "background 0.2s, opacity 0.2s, transform 0.32s cubic-bezier(.4,0,.2,1)",
          }}
        />
        {/* Linha 3 */}
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 18,
            width: 28,
            height: 4,
            borderRadius: 2,
            background: open ? "#d32f2f" : "#222",
            boxShadow: open ? "0 2px 8px #d32f2f44" : "0 2px 8px #2222",
            transform: open
              ? "translateY(-9px) rotate(-45deg)"
              : "translateY(0) rotate(0deg)",
            transition:
              "background 0.2s, box-shadow 0.2s, transform 0.32s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </span>
    </IconButton>
  );
}
