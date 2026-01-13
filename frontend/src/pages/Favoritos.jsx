import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import AnimatedCard from "../components/AnimatedCard.jsx";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import { useNavigate } from "react-router-dom";

export default function Favoritos() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    // Carrega favoritos do localStorage
    const favStr = localStorage.getItem("favoritos");
    if (favStr) setFavoritos(JSON.parse(favStr));
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "background.default",
        px: { xs: 1, sm: 2, md: 6 },
        py: 0,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1200, mt: 2, mb: 1 }}>
        <BreadcrumbNav items={[{ label: "Favoritos" }]} />
      </Box>
      <Typography variant="h4" fontWeight={700} mb={3} align="center">
        Meus Favoritos
      </Typography>
      {favoritos.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          mt={6}
        >
          Nenhum comércio ou produto favoritado ainda.
        </Typography>
      ) : (
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          justifyContent="center"
          alignItems="flex-start"
          sx={{ maxWidth: 1200, width: "100%", mx: "auto", mt: 0 }}
        >
          {favoritos.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <AnimatedCard
                sx={{
                  position: "relative",
                  borderRadius: { xs: 2, sm: 3, md: 4 },
                  boxShadow: 6,
                  bgcolor: "#fff",
                  p: { xs: 1.5, sm: 2 },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  color="primary.main"
                  sx={{ fontSize: 20, letterSpacing: 0.5 }}
                >
                  {item.nome}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={1}
                  sx={{ fontSize: 16 }}
                >
                  {item.descricao}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(item.link)}
                >
                  Visualizar
                </Button>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
