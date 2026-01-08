import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [stats, setStats] = useState({ comercios: 0, produtos: 0 });
  const [ultimosComercios, setUltimosComercios] = useState([]);
  const [ultimosProdutos, setUltimosProdutos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("usuario");
    if (userStr) setUsuario(JSON.parse(userStr));
    // Buscar estatísticas reais do backend
    const fetchStats = async () => {
      try {
        const [comRes, prodRes] = await Promise.all([
          axios.get("http://localhost:3333/comercios"),
          axios.get("http://localhost:3333/produtos"),
        ]);
        setStats({
          comercios: comRes.data.length,
          produtos: prodRes.data.length,
        });
        setUltimosComercios(comRes.data.slice(-3).reverse());
        setUltimosProdutos(prodRes.data.slice(-3).reverse());
      } catch (err) {
        setStats({ comercios: 0, produtos: 0 });
        setUltimosComercios([]);
        setUltimosProdutos([]);
      }
    };
    fetchStats();
  }, []);

  if (!usuario) {
    navigate("/login");
    return null;
  }

  return (
    <Box
      bgcolor="background.default"
      minHeight="100vh"
      width="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          boxShadow: 8,
          borderRadius: 4,
          bgcolor: "background.paper",
        }}
      >
        <CardContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            mb={2}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 72,
                height: 72,
                fontSize: 40,
              }}
            >
              {usuario.nome?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Typography
              variant="h5"
              fontWeight={700}
              color="primary.main"
              align="center"
            >
              Bem-vindo, {usuario.nome}!
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Perfil:{" "}
              {usuario.tipo === "comerciante" ? "Comerciante" : "Cliente"}
            </Typography>
          </Box>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: "#e3f2fd", boxShadow: 2, borderRadius: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight={600}
                    align="center"
                  >
                    Comércios
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color="primary.main"
                    align="center"
                  >
                    {stats.comercios}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: "#e8f5e9", boxShadow: 2, borderRadius: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    color="secondary.main"
                    fontWeight={600}
                    align="center"
                  >
                    Produtos
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color="secondary.main"
                    align="center"
                  >
                    {stats.produtos}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Typography
              variant="subtitle1"
              color="primary.main"
              fontWeight={600}
              align="center"
              mb={1}
            >
              Atalhos rápidos
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={
                    <span role="img" aria-label="comércios">
                      🏪
                    </span>
                  }
                  onClick={() => navigate("/comercios")}
                >
                  Ver Comércios
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  startIcon={
                    <span role="img" aria-label="produtos">
                      🛒
                    </span>
                  }
                  onClick={() => navigate("/produtos")}
                >
                  Ver Produtos
                </Button>
              </Grid>
              {usuario.tipo === "comerciante" && (
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={
                      <span role="img" aria-label="cadastro comércio">
                        ➕
                      </span>
                    }
                    onClick={() => navigate("/cadastro-comercio")}
                  >
                    Cadastrar Comércio
                  </Button>
                </Grid>
              )}
              {usuario.tipo === "comerciante" && (
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    startIcon={
                      <span role="img" aria-label="cadastro produto">
                        ➕
                      </span>
                    }
                    onClick={() => navigate("/cadastro-produto")}
                  >
                    Cadastrar Produto
                  </Button>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="text"
                  color="info"
                  startIcon={
                    <span role="img" aria-label="editar perfil">
                      👤
                    </span>
                  }
                  onClick={() => navigate("/editar-usuario")}
                >
                  Editar Perfil
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box mt={4} textAlign="center">
            <Typography variant="h6" color="primary.main" mb={2}>
              Últimos comércios cadastrados
            </Typography>
            <Grid container spacing={2} mb={2}>
              {ultimosComercios?.map((com) => (
                <Grid item xs={12} sm={4} key={com.id}>
                  <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color="primary.main"
                      >
                        {com.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {com.categoria || "Sem categoria"}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ mt: 1 }}
                        onClick={() => navigate(`/comercios/${com.id}`)}
                      >
                        Visualizar
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Typography variant="h6" color="secondary.main" mb={2}>
              Últimos produtos cadastrados
            </Typography>
            <Grid container spacing={2} mb={2}>
              {ultimosProdutos?.map((prod) => (
                <Grid item xs={12} sm={4} key={prod.id}>
                  <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color="secondary.main"
                      >
                        {prod.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {prod.descricao || "Sem descrição"}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{ mt: 1 }}
                        onClick={() => navigate(`/produtos/${prod.id}`)}
                      >
                        Visualizar
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Typography variant="body2" color="text.secondary" mt={2}>
              Dica: mantenha seus dados atualizados e aproveite para divulgar
              seus produtos e serviços!
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
