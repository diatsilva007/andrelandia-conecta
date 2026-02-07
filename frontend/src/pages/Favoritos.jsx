import React, { useEffect, useState } from "react";
import FavoriteButton from "../components/FavoriteButton.jsx";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { CardMedia, Chip, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AnimatedCard from "../components/AnimatedCard.jsx";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function Favoritos() {
  const location = useLocation();
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [busca, setBusca] = useState("");

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
        imagem: item.imagem || "",
      };
      favs.push(novoItem);
    }
    localStorage.setItem("favoritos", JSON.stringify(favs));
    setFavoritos(favs);
  };

  // Filtragem por nome
  const comerciosFav = favoritos
    .filter((f) => f.tipo === "comercio")
    .filter(
      (f) =>
        busca.trim() === "" ||
        f.nome.toLowerCase().includes(busca.trim().toLowerCase()),
    );
  const produtosFav = favoritos
    .filter((f) => f.tipo === "produto")
    .filter(
      (f) =>
        busca.trim() === "" ||
        f.nome.toLowerCase().includes(busca.trim().toLowerCase()),
    );

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "background.default",
        px: { xs: 2, sm: 3, md: 6 },
        py: 0,
        pt: { xs: 12, sm: 14, md: 16 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-start" },
          mb: { xs: 2, md: 4 },
          gap: 2,
          maxWidth: 700,
          mx: { xs: "auto", md: "auto" },
          pl: { xs: 0, md: 4 },
        }}
      >
        <Tooltip title="Voltar" arrow>
          <IconButton
            aria-label="Voltar"
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
            sx={{
              mr: { xs: 2, md: 3 },
              ml: { xs: 0, md: 0 },
              width: 48,
              height: 48,
              bgcolor: "#f5f5f5",
              color: "primary.main",
              borderRadius: 2.5,
              boxShadow: "0 2px 8px #1976d222",
              fontSize: 28,
              transition: "background 0.2s, color 0.2s",
              position: "relative",
              left: 0,
              top: 0,
              "&:hover": {
                bgcolor: "primary.main",
                color: "#fff",
              },
              "&:focus": {
                outline: "2px solid #1976d2",
              },
            }}
            tabIndex={0}
          >
            <ArrowBackIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
        <Typography
          variant="h4"
          fontWeight={800}
          align="center"
          sx={{
            letterSpacing: 1.2,
            color: "primary.main",
            textShadow: "0 2px 8px #0002",
            flex: 1,
            fontSize: { xs: 28, sm: 36, md: 40 },
            textAlign: "center",
          }}
        >
          Meus Favoritos
        </Typography>
      </Box>

      {/* Campo de busca aprimorado */}
      <Box
        sx={{
          maxWidth: 420,
          mx: "auto",
          mb: { xs: 2, md: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            bgcolor: "rgba(255,255,255,0.95)",
            borderRadius: 3,
            boxShadow: "0 6px 24px #1976d244",
            display: "flex",
            alignItems: "center",
            px: 2.5,
            py: 1.5,
            border: "1.5px solid #bdbdbd",
            gap: 1.5,
            transition: "box-shadow 0.2s",
            "&:focus-within": {
              boxShadow: "0 8px 32px #1976d288",
              borderColor: "#1976d2",
            },
          }}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            style={{ opacity: 0.7 }}
          >
            <path
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99c.41.41 1.09.41 1.5 0s.41-1.09 0-1.5l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z"
              fill="#1976d2"
            />
          </svg>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: 18,
              background: "transparent",
              padding: "0 4px",
              color: "#333",
            }}
            aria-label="Buscar favoritos"
          />
        </Box>
      </Box>

      {/* Comércios Favoritos */}
      <Box
        sx={{
          mt: { xs: 2, md: 6 },
          mb: { xs: 2, md: 4 },
          px: { xs: 0, md: 2 },
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary.main"
          mb={2}
          sx={{
            textAlign: "center",
            fontSize: { xs: 22, md: 28 },
            letterSpacing: 1.1,
            textShadow: "0 2px 8px #1976d222",
            background: "linear-gradient(90deg,#1976d2 0%,#43a047 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Comércios Favoritos
        </Typography>
        {comerciosFav.length === 0 ? (
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              sx={{
                bgcolor: "#e0e0e0",
                width: 60,
                height: 60,
                mx: "auto",
                mb: 1,
              }}
            >
              <StoreIcon sx={{ color: "primary.main", fontSize: 32 }} />
            </Avatar>
            <Typography variant="body1" color="text.secondary">
              Nenhum comércio favoritado.
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            columns={12}
            spacing={{ xs: 2, md: 3 }}
            justifyContent="center"
            alignItems="stretch"
            sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}
          >
            {comerciosFav.map((item) => (
              <Grid
                gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
                key={item.id}
                sx={{ display: "flex" }}
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
                    alignItems: "center",
                    "&:hover": {
                      boxShadow: "0 8px 32px #1976d244",
                      transform: "scale(1.015) translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
                  >
                    <FavoriteButton
                      item={item}
                      sx={{ fontSize: 28, p: 0.5, color: "#f50057" }}
                      onClick={() => handleFavoriteToggle(item)}
                    />
                  </Box>
                  {item.imagem && (
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                      mb: 1.2,
                      mt: 0.5,
                      justifyContent: "center",
                    }}
                  >
                    <StoreIcon sx={{ color: "primary.main", fontSize: 22 }} />
                    <Chip
                      label="Comércio"
                      color="primary"
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
                      textAlign: "center",
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
                      textAlign: "center",
                    }}
                  >
                    {item.descricao}
                  </Typography>
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
                      color="primary"
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                        fontSize: 16,
                        boxShadow: 2,
                        py: 1.1,
                        px: 2.5,
                        letterSpacing: 0.5,
                        background: "#1565c0",
                        color: "#fff",
                        transition: "background 0.22s, box-shadow 0.22s",
                        "&:hover": {
                          background: "#1976d2",
                          color: "#fff",
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => navigate(item.link)}
                    >
                      Visualizar comércio
                    </Button>
                  </Box>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Produtos Favoritos */}
      <Box
        sx={{
          mt: { xs: 2, md: 6 },
          mb: { xs: 2, md: 4 },
          px: { xs: 0, md: 2 },
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="secondary.main"
          mb={2}
          sx={{
            textAlign: "center",
            fontSize: { xs: 22, md: 28 },
            letterSpacing: 1.1,
            textShadow: "0 2px 8px #43a04744",
            background: "linear-gradient(90deg,#43a047 0%,#1976d2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Produtos Favoritos
        </Typography>
        {produtosFav.length === 0 ? (
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              sx={{
                bgcolor: "#e0e0e0",
                width: 60,
                height: 60,
                mx: "auto",
                mb: 1,
              }}
            >
              <ShoppingCartIcon
                sx={{ color: "secondary.main", fontSize: 32 }}
              />
            </Avatar>
            <Typography variant="body1" color="text.secondary">
              Nenhum produto favoritado.
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            columns={12}
            spacing={{ xs: 2, md: 3 }}
            justifyContent="center"
            alignItems="stretch"
            sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}
          >
            {produtosFav.map((item) => (
              <Grid
                gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
                key={item.id}
                sx={{ display: "flex" }}
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
                    alignItems: "center",
                    "&:hover": {
                      boxShadow: "0 8px 32px #1976d244",
                      transform: "scale(1.015) translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
                  >
                    <FavoriteButton
                      item={item}
                      sx={{ fontSize: 28, p: 0.5, color: "#f50057" }}
                      onClick={() => handleFavoriteToggle(item)}
                    />
                  </Box>
                  {item.imagem && (
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                      mb: 1.2,
                      mt: 0.5,
                      justifyContent: "center",
                    }}
                  >
                    <ShoppingCartIcon
                      sx={{ color: "secondary.main", fontSize: 22 }}
                    />
                    <Chip
                      label="Produto"
                      color="secondary"
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
                    color="secondary.main"
                    sx={{
                      fontSize: 20,
                      letterSpacing: 0.5,
                      mb: 0.5,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textAlign: "center",
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
                      textAlign: "center",
                    }}
                  >
                    {item.descricao}
                  </Typography>
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
                      color="secondary"
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                        fontSize: 16,
                        boxShadow: 2,
                        py: 1.1,
                        px: 2.5,
                        letterSpacing: 0.5,
                        background: "#43a047",
                        color: "#fff",
                        transition: "background 0.22s, box-shadow 0.22s",
                        "&:hover": {
                          background: "#388e3c",
                          color: "#fff",
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => navigate(item.link)}
                    >
                      Visualizar produto
                    </Button>
                  </Box>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
