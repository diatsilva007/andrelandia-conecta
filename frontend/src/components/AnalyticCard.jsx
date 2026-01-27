import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function AnalyticCard({
  title,
  value,
  color = "primary",
  icon,
}) {
  // Paleta customizada para maior contraste
  const bgColors = {
    primary: "#1976d2",
    info: "#0288d1",
    success: "#43a047",
    warning: "#ffa000",
    error: "#d32f2f",
    default: "#eceff1",
  };
  const fgColors = {
    primary: "#fff",
    info: "#fff",
    success: "#fff",
    warning: "#fff",
    error: "#fff",
    default: "#333",
  };
  const bg = bgColors[color] || bgColors.default;
  const fg = fgColors[color] || fgColors.default;

  return (
    <Card
      sx={{
        boxShadow: 8,
        borderRadius: 4,
        bgcolor: bg,
        color: fg,
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "box-shadow 0.3s, transform 0.2s",
        "&:hover": {
          boxShadow: "0 8px 32px #1976d244",
          transform: "scale(1.04)",
        },
      }}
    >
      <CardContent sx={{ width: "100%", p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={3}>
          {icon && (
            <Box fontSize={44} color={fg} display="flex" alignItems="center">
              {icon}
            </Box>
          )}
          <Box textAlign="left">
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ color: fg, letterSpacing: 1, mb: 0.5 }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{ color: fg, textShadow: "0 2px 8px #0002" }}
            >
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
