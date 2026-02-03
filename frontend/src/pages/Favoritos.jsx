import React, { useEffect, useState } from "react";
import FavoriteButton from "../components/FavoriteButton.jsx";
import { Box, Typography, Grid, Button } from "@mui/material";
import { CardMedia, Chip, Avatar } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AnimatedCard from "../components/AnimatedCard.jsx";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function Favoritos() {
  const location = useLocation();
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);

  // Atualiza favoritos ao montar e sempre que localStorage mudar
  useEffect(() => {
    const loadFavoritos = () => {
      const favStr = localStorage.getItem("favoritos");
      setFavoritos(favStr ? JSON.parse(favStr) : []);
    };
    loadFavoritos();
    window.addEventListener("storage", loadFavoritos);
    window.addEventListener("favoritos-updated", loadFavoritos);
    return () => {
      window.removeEventListener("storage", loadFavoritos);
      window.removeEventListener("favoritos-updated", loadFavoritos);
    };
  }, [location.pathname]);

  // Função para atualizar favoritos imediatamente após clique
  const handleFavoriteToggle = (item) => {
    const favStr = localStorage.getItem("favoritos");
    let favs = favStr ? JSON.parse(favStr) : [];
    const isFav = favs.some((f) => f.id === item.id && f.tipo === item.tipo);
    if (isFav) {
      favs = favs.filter((f) => !(f.id === item.id && f.tipo === item.tipo));
    } else {
      const novoItem = {
        id: item.id,
        tipo: item.tipo,
        nome: item.nome || "",
        descricao: item.descricao || "",
        link:
          item.link ||
          (item.tipo === "comercio"
            ? `/comercios/${item.id}`
            : `/produtos/${item.id}`),
      };
      favs.push(novoItem);
    }
    localStorage.setItem("favoritos", JSON.stringify(favs));
    setFavoritos(favs);
  };

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
          columns={12}
          spacing={2}
          justifyContent="center"
          alignItems="stretch"
          sx={{ maxWidth: 1200, width: "100%", mx: "auto", mt: 0 }}
        >
          {favoritos.map((item) => (
            <Grid
              gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
              key={item.id}
            >
              <AnimatedCard
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  boxShadow: "0 2px 12px #1976d222",
                  bgcolor: "#fff",
                  p: { xs: 2, sm: 3 },
                  minHeight: { xs: 260, sm: 300 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  mb: { xs: 2, sm: 3 },
                  transition: "box-shadow 0.3s, transform 0.2s",
                  overflow: "hidden",
                  "&:hover": {
                    boxShadow: "0 8px 32px #1976d244",
                    transform: "scale(1.015) translateY(-2px)",
                  },
                }}
              >
                {/* Ícone de favoritos no topo direito */}
                <Box
                  sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
                >
                  <FavoriteButton
                    item={item}
                    sx={{ fontSize: 28, p: 0.5, color: "#f50057" }}
                    onClick={() => handleFavoriteToggle(item)}
                  />
                </Box>
                {/* Imagem do comércio/produto */}
                {item.tipo === "comercio" && item.imagem && (
                  <Box mb={1.5} display="flex" justifyContent="center">
                    <img
                      src={
                        item.imagem.startsWith("/uploads")
                          ? `http://localhost:3333${item.imagem}`
                          : item.imagem
                      }
                      alt={item.nome}
                      style={{
                        maxWidth: "100%",
                        maxHeight: 120,
                        borderRadius: 12,
                        objectFit: "cover",
                        boxShadow: "0 2px 8px #0002",
                      }}
                    />
                  </Box>
                )}
                {item.tipo === "produto" && item.imagem && (
                  <Box mb={1.5} display="flex" justifyContent="center">
                    <img
                      src={
                        item.imagem.startsWith("/uploads")
                          ? `http://localhost:3333${item.imagem}`
                          : item.imagem
                      }
                      alt={item.nome}
                      style={{
                        maxWidth: "100%",
                        maxHeight: 120,
                        borderRadius: 12,
                        objectFit: "cover",
                        boxShadow: "0 2px 8px #0002",
                      }}
                    />
                  </Box>
                )}
                {/* Informações principais */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    mb: 1.2,
                    mt: 0.5,
                  }}
                >
                  {item.tipo === "comercio" ? (
                    <StoreIcon sx={{ color: "primary.main", fontSize: 22 }} />
                  ) : (
                    <ShoppingCartIcon
                      sx={{ color: "secondary.main", fontSize: 22 }}
                    />
                  )}
                  <Chip
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
                    fontSize: 20,
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
                    fontSize: 15,
                    minHeight: 36,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {item.descricao}
                </Typography>
                {/* Botão de visualizar centralizado na base */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: "auto",
                    mb: 0.5,
                  }}
                >
                  <Button
                    variant="contained"
                    color={item.tipo === "comercio" ? "primary" : "secondary"}
                    sx={{
                      fontWeight: 700,
                      borderRadius: 2,
                      fontSize: 16,
                      boxShadow: 2,
                      py: 1.1,
                      px: 2.5,
                      letterSpacing: 0.5,
                      background:
                        item.tipo === "comercio" ? "#1565c0" : "#43a047",
                      color: "#fff",
                      transition: "background 0.22s, box-shadow 0.22s",
                      "&:hover": {
                        background:
                          item.tipo === "comercio" ? "#1976d2" : "#388e3c",
                        color: "#fff",
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => navigate(item.link)}
                  >
                    Visualizar{" "}
                    {item.tipo === "comercio" ? "comércio" : "produto"}
                  </Button>
                </Box>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
