import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DetalheComercio() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [comercio, setComercio] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3333/comercios/${id}`)
      .then((res) => setComercio(res.data))
      .catch(() => setComercio(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  if (!comercio)
    return (
      <Typography align="center" mt={8}>
        Comércio não encontrado.
      </Typography>
    );

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Button component={Link} to="/" variant="outlined">
          Voltar
        </Button>
        {token && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/comercios/${id}/produtos/novo`)}
          >
            Novo Produto
          </Button>
        )}
        {token && (
          <Tooltip title="Editar comércio">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              sx={{ ml: 2 }}
              onClick={() => navigate(`/comercios/${id}/editar`)}
            >
              Editar
            </Button>
          </Tooltip>
        )}
      </Box>
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3, p: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Avatar sx={{ bgcolor: "primary.main", fontWeight: 700 }}>
              {comercio.nome?.[0]?.toUpperCase() || "?"}
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              {comercio.nome}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" mb={0.5}>
            {comercio.descricao}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Endereço: {comercio.endereco}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Telefone: {comercio.telefone}
          </Typography>
        </CardContent>
      </Card>
      <Typography variant="h6" mb={2}>
        Produtos
      </Typography>
      <Grid container spacing={2}>
        {comercio.produtos && comercio.produtos.length > 0 ? (
          comercio.produtos.map((produto) => (
            <Grid item xs={12} sm={6} md={4} key={produto.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 2,
                  minHeight: 140,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Avatar sx={{ bgcolor: "secondary.main", fontWeight: 700 }}>
                      {produto.nome?.[0]?.toUpperCase() || "?"}
                    </Avatar>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="primary.main"
                    >
                      {produto.nome}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={0.5}>
                    {produto.descricao}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Preço: R$ {produto.preco.toFixed(2)}
                  </Typography>
                </CardContent>
                {token && (
                  <Box
                    display="flex"
                    gap={1}
                    justifyContent="flex-end"
                    px={2}
                    pb={2}
                  >
                    <Tooltip title="Editar produto">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        sx={{ borderRadius: 2, minWidth: 0, px: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Exemplo: navigate(`/produtos/${produto.id}/editar`)
                        }}
                      >
                        Editar
                      </Button>
                    </Tooltip>
                    <Tooltip title="Excluir produto">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        sx={{ borderRadius: 2, minWidth: 0, px: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Exemplo: handleDeleteProduto(produto.id)
                        }}
                      >
                        Excluir
                      </Button>
                    </Tooltip>
                  </Box>
                )}
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" ml={2}>
            Nenhum produto cadastrado.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
