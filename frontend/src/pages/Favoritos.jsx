import React, { useEffect, useState } from "react";
import FavoriteButton from "../components/FavoriteButton.jsx";
import { Box, Typography, Grid, Button } from "@mui/material";
import { CardMedia, Chip, Avatar } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AnimatedCard from "../components/AnimatedCard.jsx";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import { useNavigate } from "react-router-dom";

export default function Favoritos() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    // Carrega favoritos do localStorage
    const loadFavoritos = () => {
      const favStr = localStorage.getItem("favoritos");
      setFavoritos(favStr ? JSON.parse(favStr) : []);
    };
    loadFavoritos();
    window.addEventListener("storage", loadFavoritos);
    return () => window.removeEventListener("storage", loadFavoritos);
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "background.default",
        px: { xs: 2, sm: 3, md: 6 },
        py: 0,
        pt: { xs: 12, sm: 14, md: 16 }, // Mais espaço abaixo da navbar
      }}
    >
      {/* Breadcrumb removido para visual mais limpo */}
      <Typography
        variant="h4"
        fontWeight={800}
        mb={2}
        align="center"
        sx={{
          letterSpacing: 1.2,
          color: "primary.main",
          textShadow: "0 2px 8px #0002",
        }}
      >
        Meus Favoritos
      </Typography>
      {favoritos.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 8, mb: 6 }}>
          <Avatar
            sx={{
              bgcolor: "#e0e0e0",
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
            }}
          >
            <FavoriteButton item={{ id: "dummy", tipo: "comercio" }} />
          </Avatar>
          <Typography
            variant="h6"
            color="text.secondary"
            fontWeight={500}
            mb={1}
          >
            Nenhum favorito encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Marque comércios ou produtos como favoritos para encontrá-los
            rapidamente aqui!
          </Typography>
        </Box>
      ) : (
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          justifyContent="center"
          alignItems="stretch"
          sx={{ maxWidth: 1200, width: "100%", mx: "auto", mt: 0 }}
        >
          {favoritos.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <AnimatedCard
                sx={{
                  position: "relative",
                  borderRadius: { xs: 3, sm: 4, md: 5 },
                  boxShadow: "0 4px 24px #1976d222",
                  bgcolor: "#fff",
                  p: { xs: 2, sm: 3 },
                  minHeight: { xs: 220, sm: 260 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  mb: { xs: 2, sm: 3 }, // Espaço entre cards
                  transition: "box-shadow 0.3s, transform 0.2s",
                  "&:hover": {
                    boxShadow: "0 8px 32px #1976d244",
                    transform: "scale(1.025) translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
                  <FavoriteButton item={item} />
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Chip
                    icon={
                      item.tipo === "comercio" ? (
                        <StoreIcon />
                      ) : (
                        <ShoppingCartIcon />
                      )
                    }
                    label={item.tipo === "comercio" ? "Comércio" : "Produto"}
                    color={item.tipo === "comercio" ? "primary" : "secondary"}
                    sx={{
                      fontWeight: 600,
                      fontSize: 13,
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="primary.main"
                  sx={{
                    fontSize: 22,
                    letterSpacing: 0.5,
                    mb: 0.5,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.nome}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={2}
                  sx={{
                    fontSize: 16,
                    minHeight: 36,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {item.descricao}
                </Typography>
                <Button
                  variant="contained"
                  color={item.tipo === "comercio" ? "primary" : "secondary"}
                  sx={{
                    mt: 1.5,
                    fontWeight: 700,
                    borderRadius: 2,
                    fontSize: 16,
                    boxShadow: 2,
                    py: 1.2,
                    px: 2.5,
                    letterSpacing: 0.5,
                    background:
                      item.tipo === "comercio" ? "#1565c0" : "#43a047",
                    color: "#fff",
                    "&:hover": {
                      background:
                        item.tipo === "comercio" ? "#1976d2" : "#388e3c",
                      color: "#fff",
                    },
                  }}
                  onClick={() => navigate(item.link)}
                >
                  Visualizar {item.tipo === "comercio" ? "comércio" : "produto"}
                </Button>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
