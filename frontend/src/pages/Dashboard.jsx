import { useEffect, useState } from "react";
import axios from "axios";
import CadastroComercioDialog from "../components/CadastroComercioDialog.jsx";
import CadastroProdutoDialog from "../components/CadastroProdutoDialog.jsx";
import EditarPerfilDialog from "../components/EditarPerfilDialog.jsx";
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
import AnimatedCard from "../components/AnimatedCard.jsx";
import { useNavigate } from "react-router-dom";

import BreadcrumbNav from "../components/BreadcrumbNav.jsx";

export default function Dashboard() {
  const [openComercioDialog, setOpenComercioDialog] = useState(false);
  const [openProdutoDialog, setOpenProdutoDialog] = useState(false);
  const [openPerfilDialog, setOpenPerfilDialog] = useState(false);
  const [showComercios, setShowComercios] = useState(false);
  const [showProdutos, setShowProdutos] = useState(false);
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
      <Box maxWidth={900} mx="auto" px={2} pt={2}>
        <BreadcrumbNav items={[{ label: "Dashboard" }]} />
      </Box>
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
          <Box display="flex" justifyContent="flex-end" mb={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                px: 2,
                py: 1,
                fontSize: 15,
                boxShadow: "0 2px 8px #1565c033",
                transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                background: "#1565c0",
                color: "#fff",
                transform: "scale(1)",
                "&:hover": {
                  background: "#1976d2",
                  color: "#fff",
                  transform: "scale(1.07)",
                  boxShadow: "0 4px 16px #1565c044",
                },
              }}
              aria-label="Ir para página inicial"
              onClick={() => navigate("/")}
            >
              Ir para Home
            </Button>
          </Box>
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
          <Grid container spacing={2} mb={2} columns={12}>
            <Grid gridColumn={{ xs: "span 12", sm: "span 6" }}>
              <AnimatedCard
                sx={{ bgcolor: "#e3f2fd", boxShadow: 2, borderRadius: 3 }}
              >
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
              </AnimatedCard>
            </Grid>
            <Grid gridColumn={{ xs: "span 12", sm: "span 6" }}>
              <AnimatedCard
                sx={{ bgcolor: "#e8f5e9", boxShadow: 2, borderRadius: 3 }}
              >
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
              </AnimatedCard>
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
                  variant={showComercios ? "outlined" : "contained"}
                  color="primary"
                  startIcon={
                    <span role="img" aria-label="comércios">
                      🏪
                    </span>
                  }
                  onClick={() => setShowComercios((v) => !v)}
                >
                  {showComercios ? "Ocultar Comércios" : "Ver Comércios"}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant={showProdutos ? "outlined" : "contained"}
                  color="secondary"
                  startIcon={
                    <span role="img" aria-label="produtos">
                      🛒
                    </span>
                  }
                  onClick={() => setShowProdutos((v) => !v)}
                >
                  {showProdutos ? "Ocultar Produtos" : "Ver Produtos"}
                </Button>
              </Grid>
              {usuario.tipo === "comerciante" && (
                <>
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
                      onClick={() => setOpenComercioDialog(true)}
                    >
                      Cadastrar Comércio
                    </Button>
                  </Grid>
                  <CadastroComercioDialog
                    open={openComercioDialog}
                    onClose={() => setOpenComercioDialog(false)}
                    onSuccess={() => window.location.reload()}
                  />
                </>
              )}
              {usuario.tipo === "comerciante" && (
                <>
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
                      onClick={() => setOpenProdutoDialog(true)}
                    >
                      Cadastrar Produto
                    </Button>
                  </Grid>
                  <CadastroProdutoDialog
                    open={openProdutoDialog}
                    onClose={() => setOpenProdutoDialog(false)}
                    onSuccess={() => window.location.reload()}
                  />
                </>
              )}
              <>
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
                    onClick={() => setOpenPerfilDialog(true)}
                  >
                    Editar Perfil
                  </Button>
                </Grid>
                <EditarPerfilDialog
                  open={openPerfilDialog}
                  onClose={() => setOpenPerfilDialog(false)}
                  onSuccess={() => window.location.reload()}
                />
              </>
            </Grid>
          </Box>
          <Box mt={4} textAlign="center">
            {showComercios && (
              <>
                <Typography variant="h6" color="primary.main" mb={2}>
                  Todos os comércios
                </Typography>
                <Grid container spacing={2} mb={2}>
                  {ultimosComercios?.map((com) => (
                    <Grid item xs={12} sm={4} key={com.id}>
                      <AnimatedCard sx={{ boxShadow: 2, borderRadius: 2 }}>
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
                      </AnimatedCard>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
            {showProdutos && (
              <>
                <Typography variant="h6" color="secondary.main" mb={2}>
                  Todos os produtos
                </Typography>
                <Grid container spacing={2} mb={2}>
                  {ultimosProdutos?.map((prod) => (
                    <Grid item xs={12} sm={6} md={4} key={prod.id}>
                      <Card
                        sx={{ boxShadow: 2, borderRadius: { xs: 2, sm: 2 } }}
                      >
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
              </>
            )}
            <Typography variant="h6" color="primary.main" mb={2}>
              Últimos comércios cadastrados
            </Typography>
            <Grid container spacing={2} mb={2}>
              {ultimosComercios?.map((com) => (
                <Grid item xs={12} sm={6} md={4} key={com.id}>
                  <AnimatedCard
                    sx={{ boxShadow: 2, borderRadius: { xs: 2, sm: 2 } }}
                  >
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
                  </AnimatedCard>
                </Grid>
              ))}
            </Grid>
            <Typography variant="h6" color="secondary.main" mb={2}>
              Últimos produtos cadastrados
            </Typography>
            <Grid container spacing={2} mb={2}>
              {ultimosProdutos?.map((prod) => (
                <Grid item xs={12} sm={6} md={4} key={prod.id}>
                  <AnimatedCard
                    sx={{ boxShadow: 2, borderRadius: { xs: 2, sm: 2 } }}
                  >
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
                  </AnimatedCard>
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
