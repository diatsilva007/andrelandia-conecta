import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import VoltarButton from "../components/VoltarButton.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";

export default function DetalheProduto() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3333/produtos/${id}`)
      .then((res) => setProduto(res.data))
      .catch(() => setProduto(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  if (!produto)
    return (
      <Typography align="center" mt={8}>
        Produto não encontrado.
      </Typography>
    );

  return (
    <Box
      bgcolor="background.default"
      minHeight="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      px={{ xs: 1, sm: 2 }}
      py={{ xs: 2, sm: 4 }}
      paddingTop={{ xs: 8, sm: 10, md: 12 }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto", width: "100%", mb: 3 }}>
        <VoltarButton label="Voltar" />
        <BreadcrumbNav
          items={[
            { label: "Início", to: "/" },
            { label: produto.nome || "Produto" },
          ]}
        />
      </Box>
      <Card
        sx={{
          width: "100%",
          maxWidth: 500,
          mx: "auto",
          boxShadow: 6,
          borderRadius: 4,
          bgcolor: "background.paper",
          position: "relative",
        }}
      >
        <CardContent>
          <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
            <FavoriteButton
              item={{
                id: produto.id,
                tipo: "produto",
                nome: produto.nome,
                descricao: produto.descricao,
                link: `/produtos/${produto.id}`,
              }}
            />
          </Box>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar
              sx={{
                bgcolor: "secondary.main",
                width: 64,
                height: 64,
                fontSize: 32,
              }}
            >
              {produto.nome?.charAt(0).toUpperCase() || "P"}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} color="secondary.main">
                {produto.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {produto.descricao || "Sem descrição"}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="body1"
            color="primary.main"
            fontWeight={600}
            mb={1}
          >
            Preço: R$ {produto.preco?.toFixed(2)}
          </Typography>
          {produto.comercio && (
            <Typography variant="body2" color="text.secondary" mb={1}>
              Comércio: {produto.comercio.nome}
            </Typography>
          )}
          <Button
            variant="outlined"
            color="primary"
            sx={{
              mt: 2,
              fontWeight: 600,
              borderRadius: 3,
              backgroundColor: "#f5faff",
              color: "#1976d2",
              borderColor: "#1976d2",
              transition: "background 0.2s, box-shadow 0.2s",
              "&:hover": {
                backgroundColor: "#e3f2fd",
                color: "#1565c0",
                borderColor: "#1565c0",
                boxShadow: "0 2px 8px #1976d222",
              },
              "&:focus-visible": {
                outline: "2px solid #1976d2",
                outlineOffset: 2,
              },
            }}
            component={Link}
            to={produto.comercio ? `/comercios/${produto.comercio.id}` : "/"}
          >
            Ver comércio
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
