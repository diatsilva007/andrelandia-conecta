import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  Tabs,
  Tab,
} from "@mui/material";
import AnimatedCard from "../components/AnimatedCard.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";

import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import AnalyticCard from "../components/AnalyticCard.jsx";
import AnalyticLineChart from "../components/AnalyticLineChart.jsx";
import ProductRankingList from "../components/ProductRankingList.jsx";
import DateFilter from "../components/DateFilter.jsx";
import ComercioMap from "../components/ComercioMap.jsx";

export default function Dashboard() {
  const location = useLocation();
  const { usuario, loadingUser } = useUser();
  // [DEBUG] console.log('[Dashboard] usuario:', usuario);
  // [DEBUG] console.log('[Dashboard] loadingUser:', loadingUser);
  const [openComercioDialog, setOpenComercioDialog] = useState(false);
  const [openProdutoDialog, setOpenProdutoDialog] = useState(false);
  const [openPerfilDialog, setOpenPerfilDialog] = useState(false);
  const [showComercios, setShowComercios] = useState(false);
  const [showProdutos, setShowProdutos] = useState(false);
  // Removido: usuario agora vem do contexto global
  const [stats, setStats] = useState({ comercios: 0, produtos: 0 });
  const [ultimosComercios, setUltimosComercios] = useState([]);
  const [todosComercios, setTodosComercios] = useState([]);
  const [ultimosProdutos, setUltimosProdutos] = useState([]);
  const [analytics, setAnalytics] = useState({
    vendas: 0,
    acessos: 0,
    avaliacoes: 0,
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [chartData, setChartData] = useState({
    vendas: [],
    acessos: [],
    avaliacoes: [],
    labels: [],
  });
  const [chartTab, setChartTab] = useState(0);
  const [rankingProdutos, setRankingProdutos] = useState([]);
  const [periodo, setPeriodo] = useState("Semana");
  const [comercioId, setComercioId] = useState(null);
  const navigate = useNavigate();

  // Função para buscar dados do backend
  const fetchStats = async () => {
    try {
      const [comRes, prodRes] = await Promise.all([
        axios.get("http://localhost:3333/comercios?offset=0&limit=1000"),
        axios.get("http://localhost:3333/produtos?offset=0&limit=1000"),
      ]);
      const comerciosArr = comRes.data.data || [];
      const produtosArr = prodRes.data.data || [];
      setStats({
        comercios: comerciosArr.length,
        produtos: produtosArr.length,
      });
      setTodosComercios(comerciosArr);
      setUltimosComercios(comerciosArr.slice(-3).reverse());
      setUltimosProdutos(produtosArr.slice(-3).reverse());
    } catch {
      setStats({ comercios: 0, produtos: 0 });
      setTodosComercios([]);
      setUltimosComercios([]);
      setUltimosProdutos([]);
    }
  };

  // Busca o comércio do usuário logado (caso seja comerciante)
  useEffect(() => {
    async function fetchComercioUsuario() {
      if (usuario?.tipo === "comerciante" && usuario?.id) {
        try {
          const res = await axios.get(
            `http://localhost:3333/comercios?usuarioId=${usuario.id}`,
          );
          // Se retornar um array de comércios, pega o primeiro (ou ajuste conforme regra de negócio)
          if (Array.isArray(res.data) && res.data.length > 0) {
            setComercioId(res.data[0].id);
          } else {
            setComercioId(null);
          }
        } catch {
          setComercioId(null);
        }
      } else {
        setComercioId(null);
      }
    }
    fetchComercioUsuario();
  }, [usuario]);

  // Ajusta fetchAnalytics para usar o id do comércio
  const fetchAnalytics = async () => {
    if (!comercioId) return;
    setLoadingAnalytics(true);
    try {
      const res = await axios.get(
        `http://localhost:3333/comercios/${comercioId}/analytics`,
      );
      setAnalytics(res.data);
    } catch {
      setAnalytics({ vendas: 0, acessos: 0, avaliacoes: 0 });
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchChartData = async () => {
    // Exemplo: buscar dados reais do backend
    // Aqui, mock para demonstração
    setChartData({
      vendas: [5, 8, 12, 7, 10, 15, 9],
      acessos: [20, 30, 25, 40, 35, 50, 45],
      avaliacoes: [1, 2, 1, 3, 2, 4, 3],
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    });
  };

  const fetchRankingProdutos = async () => {
    // Exemplo: buscar dados reais do backend
    // Aqui, mock para demonstração
    setRankingProdutos([
      { id: 1, nome: "Produto A", vendas: 15, avaliacoes: 8, imagem: "" },
      { id: 2, nome: "Produto B", vendas: 12, avaliacoes: 5, imagem: "" },
      { id: 3, nome: "Produto C", vendas: 9, avaliacoes: 6, imagem: "" },
    ]);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (comercioId) {
      fetchAnalytics();
      fetchChartData();
      fetchRankingProdutos();
    }
    // eslint-disable-next-line
  }, [comercioId]);

  // Recarrega dados se retornar de edição/cadastro com sucesso
  useEffect(() => {
    if (location.state && location.state.sucesso) {
      fetchStats();
      // Limpa o state para evitar recarregamento duplo
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line
  }, [location.state]);

  // Atualização automática via evento global (localStorage)
  useEffect(() => {
    function handleStorageEvent(e) {
      if (e.key === "refresh_dashboard") {
        fetchStats();
      }
    }
    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, []);

  const handleChartTabChange = (event, newValue) => {
    setChartTab(newValue);
  };

  const handlePeriodoChange = (e) => {
    setPeriodo(e.target.value);
    // Aqui você pode disparar nova busca de dados conforme o período selecionado
    // Exemplo: fetchChartData(e.target.value);
  };

  useEffect(() => {
    if (!usuario && !loadingUser) {
      // [DEBUG] console.log('[Dashboard] Redirecionando para login. usuario:', usuario, 'loadingUser:', loadingUser);
      navigate("/login");
    }
  }, [usuario, loadingUser, navigate]);

  if (loadingUser) {
    return null;
  }
  if (!usuario) {
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
      paddingTop={{ xs: 6, sm: 10, md: 12 }}
      sx={{
        overflowX: "hidden",
        px: { xs: 0, sm: 2 },
      }}
    >
      <Box
        maxWidth={900}
        width="100%"
        mx="auto"
        px={{ xs: 1, sm: 2 }}
        pt={2}
        textAlign="center"
      >
        <BreadcrumbNav items={[{ label: "Dashboard" }]} />
      </Box>
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          boxShadow: 8,
          borderRadius: { xs: 2, sm: 4 },
          bgcolor: "background.paper",
          textAlign: "center",
          mt: 3,
          mb: 6,
          py: { xs: 2, sm: 4 },
        }}
      >
        <CardContent sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 5 } }}>
          {/* Bloco do usuário no topo */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={3}
            mb={5}
          >
            <Avatar
              src={
                usuario.imagem
                  ? `http://localhost:3333${usuario.imagem}`
                  : undefined
              }
              alt={usuario.nome}
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#1976d2",
                fontWeight: 700,
                fontSize: 32,
              }}
            >
              {!usuario.imagem && usuario.nome?.charAt(0).toUpperCase()}
            </Avatar>
            <Box textAlign="left">
              <Typography variant="h5" fontWeight={700} color="primary.main">
                {usuario.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {usuario.email}
              </Typography>
            </Box>
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
                minWidth: 44,
                minHeight: 44,
                boxShadow: "0 2px 8px #1565c033",
                transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                background: "#1565c0",
                color: "#fff",
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
          {/* Cards de resumo de comércios e produtos */}
          <Grid
            container
            spacing={2}
            mb={5}
            justifyContent="center"
            columns={12}
          >
            <Grid gridColumn="span 6">
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
                    Comércios cadastrados
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
            <Grid gridColumn="span 6">
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
                    Produtos cadastrados
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
          {/* Mapa dos comércios cadastrados */}
          <Box mb={5}>
            <ComercioMap comercios={todosComercios} />
          </Box>
          {/* Atalhos rápidos logo após os cards de resumo */}
          <Box mb={5}>
            <Typography variant="h6" color="primary.main" mb={2}>
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
                  sx={{
                    fontWeight: 700,
                    borderRadius: 3,
                    fontSize: 16,
                    py: 1.2,
                    boxShadow: showComercios ? 1 : 3,
                    transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                    "&:hover": showComercios
                      ? {
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          borderColor: "#1976d2",
                          boxShadow: 6,
                        }
                      : {
                          backgroundColor: "#1565c0",
                          color: "#fff",
                          boxShadow: 6,
                        },
                  }}
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
                  sx={{
                    fontWeight: 700,
                    borderRadius: 3,
                    fontSize: 16,
                    py: 1.2,
                    boxShadow: showProdutos ? 1 : 3,
                    transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                      color: "#fff",
                      borderColor: "#1565c0",
                      boxShadow: 6,
                    },
                  }}
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
          {/* Espaçamento entre seções principais */}
          <Box mb={4}>
            {/* Cards analíticos */}
            <Grid container spacing={2} columns={12} mb={2}>
              <Grid item xs={12} sm={4}>
                <AnalyticCard
                  title="Vendas"
                  value={loadingAnalytics ? "..." : analytics.vendas}
                  color="primary"
                  icon={
                    <span role="img" aria-label="vendas">
                      💰
                    </span>
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <AnalyticCard
                  title="Acessos"
                  value={loadingAnalytics ? "..." : analytics.acessos}
                  color="info"
                  icon={
                    <span role="img" aria-label="acessos">
                      👁️
                    </span>
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <AnalyticCard
                  title="Avaliações"
                  value={loadingAnalytics ? "..." : analytics.avaliacoes}
                  color="success"
                  icon={
                    <span role="img" aria-label="avaliações">
                      ⭐
                    </span>
                  }
                />
              </Grid>
            </Grid>
          </Box>
          <Box mb={4}>
            {/* Filtro de período */}
            <DateFilter value={periodo} onChange={handlePeriodoChange} />
          </Box>
          <Box mb={4}>
            {/* Abas dos gráficos analíticos */}
            <Tabs
              value={chartTab}
              onChange={handleChartTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{ mb: 2, bgcolor: "background.paper", borderRadius: 2 }}
            >
              <Tab label="Vendas" />
              <Tab label="Acessos" />
              <Tab label="Avaliações" />
            </Tabs>
          </Box>
          <Box mb={4}>
            {/* Gráficos analíticos */}
            {chartTab === 0 && (
              <AnalyticLineChart
                title={`Vendas por dia (${periodo})`}
                labels={chartData.labels}
                data={chartData.vendas}
                color="#1976d2"
              />
            )}
            {chartTab === 1 && (
              <AnalyticLineChart
                title={`Acessos por dia (${periodo})`}
                labels={chartData.labels}
                data={chartData.acessos}
                color="#388e3c"
              />
            )}
            {chartTab === 2 && (
              <AnalyticLineChart
                title={`Avaliações por dia (${periodo})`}
                labels={chartData.labels}
                data={chartData.avaliacoes}
                color="#fbc02d"
              />
            )}
          </Box>
          <Box mb={4}>
            {/* Ranking de produtos */}
            <ProductRankingList
              products={rankingProdutos}
              title={`Produtos mais vendidos/avaliados (${periodo})`}
            />
          </Box>
          <Box mt={5}>
            {/* Últimos comércios cadastrados */}
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
                      {com.imagem && (
                        <Box mb={1} display="flex" justifyContent="center">
                          <img
                            src={
                              com.imagem.startsWith("/uploads")
                                ? `http://localhost:3333${com.imagem}`
                                : com.imagem
                            }
                            alt={com.nome}
                            style={{
                              maxWidth: "100%",
                              maxHeight: 80,
                              borderRadius: 8,
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      )}
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
          </Box>
          <Box mt={5}>
            {/* Últimos produtos cadastrados */}
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
                      {prod.imagem && (
                        <Box mb={1} display="flex" justifyContent="center">
                          <img
                            src={`http://localhost:3333${prod.imagem}`}
                            alt={prod.nome}
                            style={{
                              maxWidth: "100%",
                              maxHeight: 120,
                              borderRadius: 8,
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      )}
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
          </Box>
          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
              Dica: mantenha seus dados atualizados e aproveite para divulgar
              seus produtos e serviços!
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
