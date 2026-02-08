import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Skeleton,
  Chip,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Carrossel de fotos dos comércios
export default function CarrosselComercios() {
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function fetchComercios() {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:3333/comercios?limit=10&offset=0",
        );
        const json = await res.json();
        if (isMounted) setComercios(json.data || []);
      } catch {
        // Pode usar SnackbarContext para feedback de erro
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchComercios();
    // Atualização automática a cada 30s
    const interval = setInterval(fetchComercios, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Setas customizadas
  function Arrow(props) {
    const { className, onClick, direction } = props;
    return (
      <Box
        className={className}
        onClick={onClick}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          zIndex: 2,
          width: 38,
          height: 38,
          bgcolor: "background.paper",
          borderRadius: "50%",
          boxShadow: 3,
          color: "primary.main",
          cursor: "pointer",
          transform: "translateY(-50%)",
          transition: "background 0.2s, color 0.2s",
          "&:hover": {
            bgcolor: "primary.main",
            color: "primary.contrastText",
          },
          left: direction === "left" ? { xs: 0, sm: -18 } : "unset",
          right: direction === "right" ? { xs: 0, sm: -18 } : "unset",
        }}
      >
        {direction === "left" ? (
          <ArrowBackIosNewIcon fontSize="small" />
        ) : (
          <ArrowForwardIosIcon fontSize="small" />
        )}
      </Box>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
    arrows: true,
    prevArrow: <Arrow direction="left" />,
    nextArrow: <Arrow direction="right" />,
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        my: { xs: 1, sm: 2 },
        px: { xs: 0, sm: 0 },
        pb: { xs: 2, sm: 4 },
        pt: 0,
        background: "none",
        borderRadius: 0,
        boxShadow: "none",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        textAlign="center"
        sx={{
          color: "primary.main",
          letterSpacing: 0.5,
          textShadow: "none",
          width: "100%",
        }}
      >
        Destaques do Comércio Local
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", gap: 3, justifyContent: "center", py: 3 }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={340}
              height={230}
              sx={{ borderRadius: 4, boxShadow: 3 }}
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          <Slider {...settings} className="carrossel-comercios-slider">
            {comercios.map((comercio) => (
              <Box
                key={comercio.id}
                px={{ xs: 0.5, sm: 1.5 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pb: { xs: 1.5, sm: 2 },
                }}
              >
                <Card
                  sx={{
                    borderRadius: 5,
                    boxShadow: "0 4px 32px #1565c033, 0 1.5px 8px #43a04722",
                    cursor: "pointer",
                    width: { xs: 260, sm: 320, md: 340, lg: 360 },
                    maxWidth: { xs: 280, sm: 340, md: 360 },
                    minWidth: 200,
                    minHeight: 270,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    transition: "transform 0.16s, box-shadow 0.16s",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 8px 40px #43a04744, 0 2px 12px #1565c044",
                    },
                    bgcolor: "rgba(255,255,255,0.92)",
                    border: "none",
                    backdropFilter: "blur(2.5px)",
                    overflow: "visible",
                    mx: "auto",
                  }}
                  onClick={() => navigate(`/comercios/${comercio.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="130"
                    image={
                      comercio.imagem
                        ? comercio.imagem.startsWith("/uploads")
                          ? `http://localhost:3333${comercio.imagem}`
                          : comercio.imagem
                        : "/public/placeholder_comercio.jpg"
                    }
                    alt={comercio.nome}
                    sx={{
                      objectFit: "cover",
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      borderBottom: "1px solid #e0e0e0",
                      width: "100%",
                    }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      py: { xs: 1, sm: 1.5 },
                      px: { xs: 1.2, sm: 2.2 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      minHeight: 90,
                      width: "100%",
                    }}
                  >
                    {comercio.categoria && (
                      <Chip
                        label={comercio.categoria}
                        size="small"
                        sx={{
                          bgcolor: "primary.light",
                          color: "primary.contrastText",
                          fontWeight: 700,
                          fontSize: 12,
                          mb: 0.5,
                          px: 1.2,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                        aria-label={`Categoria: ${comercio.categoria}`}
                      />
                    )}
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      noWrap
                      sx={{
                        color: "primary.dark",
                        fontSize: 18,
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      {comercio.nome}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{
                        fontWeight: 500,
                        fontSize: 14,
                        mb: 0.5,
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      {comercio.descricao || "Comércio local de Andrelândia"}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      px: { xs: 1.2, sm: 2.2 },
                      pb: { xs: 1.5, sm: 2 },
                      pt: 0,
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<StoreIcon />}
                      sx={{
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: 15,
                        py: 1.1,
                        boxShadow: "0 2px 8px #1565c022",
                        background:
                          "linear-gradient(90deg, #1565c0 0%, #43a047 100%)",
                        transition:
                          "background 0.18s, box-shadow 0.18s, transform 0.14s",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #43a047 0%, #1565c0 100%)",
                          boxShadow: "0 4px 16px #43a04722",
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      Ver detalhes
                    </Button>
                  </Box>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      )}
    </Box>
  );
}
