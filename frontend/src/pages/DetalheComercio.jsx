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
      <Button component={Link} to="/" variant="outlined" sx={{ mb: 2 }}>
        Voltar
      </Button>
      {token && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2, ml: 2 }}
          onClick={() => navigate(`/comercios/${id}/produtos/novo`)}
        >
          Novo Produto
        </Button>
      )}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5">{comercio.nome}</Typography>
          <Typography variant="body1" color="text.secondary">
            {comercio.descricao}
          </Typography>
          <Typography variant="body2">Endereço: {comercio.endereco}</Typography>
          <Typography variant="body2">Telefone: {comercio.telefone}</Typography>
        </CardContent>
      </Card>
      <Typography variant="h6" mb={2}>
        Produtos
      </Typography>
      <Grid container spacing={2}>
        {comercio.produtos && comercio.produtos.length > 0 ? (
          comercio.produtos.map((produto) => (
            <Grid item xs={12} sm={6} md={4} key={produto.id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">{produto.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {produto.descricao}
                  </Typography>
                  <Typography variant="body2">
                    Preço: R$ {produto.preco.toFixed(2)}
                  </Typography>
                </CardContent>
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
