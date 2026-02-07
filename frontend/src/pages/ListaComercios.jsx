import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import LoadingBackdrop from "../components/LoadingBackdrop";
import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "../components/SnackbarContext.jsx";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slider,
  Rating,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import AnimatedCard from "../components/AnimatedCard.jsx";
import Chip from "@mui/material/Chip";
import FavoriteButton from "../components/FavoriteButton.jsx";

import ComercioSkeletonList from "../components/ComercioSkeletonList.jsx";
import Aurora from "../components/Aurora";

const ListaComercios = () => {
  const [incluirSemProdutos, setIncluirSemProdutos] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [comercios, setComercios] = useState([]);
  const [totalComercios, setTotalComercios] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [localizacaoFiltro, setLocalizacaoFiltro] = useState("");
  const { usuario, loadingUser } = useUser();
  const [token] = useState(localStorage.getItem("token"));
  // Filtros avançados
  const [precoRange, setPrecoRange] = useState([0, 1000]);
  const [avaliacaoMin, setAvaliacaoMin] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  // Lazy loading (infinite scroll)
  const ITEMS_PER_PAGE = 10;
  const sentinelRef = useRef(null);
  const [comercioExcluir, setComercioExcluir] = useState(null);
  const { setSnackbar } = useSnackbar();

  // Função para remover acentos
  function normalizar(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  // Categorias dinâmicas extraídas dos comércios carregados
  const categorias = Array.from(
    new Set(
      comercios
        .map((c) => c.categoria)
        .filter((cat) => cat && typeof cat === "string" && cat.trim() !== ""),
    ),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  // Utilidades para preço e avaliação
  function getFaixaPreco(produtos) {
    if (!produtos || produtos.length === 0) return null;
    const precos = produtos
      .map((p) => p.preco)
      .filter((v) => typeof v === "number");
    if (precos.length === 0) return null;
    return [Math.min(...precos), Math.max(...precos)];
  }
  function getMediaAvaliacao(avaliacoes) {
    if (!avaliacoes || avaliacoes.length === 0) return null;
    const soma = avaliacoes.reduce((acc, a) => acc + (a.nota || 0), 0);
    return soma / avaliacoes.length;
  }

  // Determinar faixa global de preços para o Slider
  const todosPrecos = comercios
    .flatMap((c) => (c.produtos || []).map((p) => p.preco))
    .filter((v) => typeof v === "number");
  const precoMinGlobal = todosPrecos.length ? Math.min(...todosPrecos) : 0;
  const precoMaxGlobal = todosPrecos.length ? Math.max(...todosPrecos) : 1000;

  // Filtrar comércios por todos os critérios
  const comerciosFiltrados = comercios.filter((c) => {
    const buscaMatch =
      normalizar(c.nome).includes(normalizar(busca)) ||
      normalizar(c.descricao || "").includes(normalizar(busca)) ||
      normalizar(c.categoria || "").includes(normalizar(busca));
    const categoriaMatch = !categoriaFiltro || c.categoria === categoriaFiltro;
    // Filtro de localização (cidade/bairro)
    const localizacaoMatch =
      !localizacaoFiltro ||
      normalizar(c.endereco || "").includes(normalizar(localizacaoFiltro));
    // Filtro de preço
    const faixa = getFaixaPreco(c.produtos);
    // Se o filtro está no valor padrão, exibe comércios sem produtos se o checkbox estiver marcado
    const filtroAbrangente =
      precoRange[0] === precoMinGlobal && precoRange[1] === precoMaxGlobal;
    const precoOk = filtroAbrangente
      ? incluirSemProdutos || !!faixa // Exibe todos se marcado, senão só com produtos
      : !faixa
        ? false
        : faixa[1] >= precoRange[0] && faixa[0] <= precoRange[1];
    // Filtro de avaliação
    const media = getMediaAvaliacao(c.avaliacoes);
    const avaliacaoOk =
      !avaliacaoMin || (media !== null && media >= avaliacaoMin);
    return (
      buscaMatch && categoriaMatch && localizacaoMatch && precoOk && avaliacaoOk
    );
  });

  // Carregar comércios da API (paginado)
  const [loading, setLoading] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoadingTimeout(true), 10000);
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [loading]);
  // Função para carregar comércios (precisa ser acessível em outros efeitos)
  const fetchComercios = async (reset = false) => {
    try {
      const res = await fetch(
        `http://localhost:3333/comercios?offset=${reset ? 0 : offset}&limit=${ITEMS_PER_PAGE}`,
      );
      if (!res.ok) throw new Error("Erro ao buscar comércios");
      const data = await res.json();
      setTotalComercios(data.total || 0);
      if (reset) {
        setComercios(data.data || []);
        setOffset(ITEMS_PER_PAGE);
      } else {
        setComercios((prev) => [...prev, ...(data.data || [])]);
        setOffset((prev) => prev + ITEMS_PER_PAGE);
      }
      setErroCarregamento("");
    } catch {
      setErroCarregamento(
        "Erro ao carregar comércios. Tente novamente mais tarde.",
      );
      setSnackbar({
        open: true,
        message: "Erro ao carregar comércios",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Carregamento inicial e ao trocar filtros
  useEffect(() => {
    if (!loadingUser) {
      fetchComercios(true);
    }
    // eslint-disable-next-line
  }, [
    loadingUser,
    busca,
    localizacaoFiltro,
    categoriaFiltro,
    precoRange,
    avaliacaoMin,
    setSnackbar,
    offset,
    ITEMS_PER_PAGE,
  ]);

  // Reset ao trocar filtros/busca
  // Carregamento inicial após login/contexto pronto
  useEffect(() => {
    if (!loadingUser) {
      fetchComercios(true);
    }
    // eslint-disable-next-line
  }, [loadingUser]);

  // Reset ao trocar filtros/busca
  // Reset ao trocar filtros/busca, mas não no carregamento inicial
  const filtrosAtivos = [
    busca,
    localizacaoFiltro,
    categoriaFiltro,
    precoRange,
    avaliacaoMin,
  ].join("|");
  const [filtrosIniciados, setFiltrosIniciados] = useState(false);

  useEffect(() => {
    if (!loadingUser && filtrosIniciados) {
      fetchComercios(true);
    }
    // eslint-disable-next-line
  }, [filtrosAtivos, loadingUser, setSnackbar]);

  // Marca filtros como iniciados após o carregamento inicial
  useEffect(() => {
    if (!loadingUser) {
      setFiltrosIniciados(true);
    }
  }, [loadingUser]);

  // Recarrega ao detectar sucesso na navegação (ex: após cadastro)
  useEffect(() => {
    if (location.state && location.state.sucesso) {
      fetchComercios(true);
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line
  }, [location.state]);

  // Função para buscar mais (scroll infinito)
  const fetchMoreComercios = () => {
    if (comercios.length < totalComercios && !isFetchingMore && !loading) {
      // Busca próxima página
      (async () => {
        await new Promise((r) => setTimeout(r, 200)); // delay para UX
        await fetch(
          `http://localhost:3333/comercios?offset=${offset}&limit=${ITEMS_PER_PAGE}`,
        )
          .then((res) => res.json())
          .then((data) => {
            setComercios((prev) => [...prev, ...(data.data || [])]);
            setOffset((prev) => prev + ITEMS_PER_PAGE);
          })
          .catch(() => {
            setSnackbar({
              open: true,
              message: "Erro ao carregar mais comércios",
              severity: "error",
            });
          })
          .finally(() => setIsFetchingMore(false));
      })();
    }
  };

  useEffect(() => {
    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreComercios();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(currentSentinel);
    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [comercios.length, totalComercios, isFetchingMore, loading]);

  // Exibe loading global enquanto contexto do usuário está carregando
  if (loadingUser) {
    return (
      <Box
        minHeight="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <span>Carregando...</span>
      </Box>
    );
  }

  // Exibe loading enquanto carrega comércios
  if (loading) {
    return (
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <LoadingBackdrop open />
        {loadingTimeout && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              bgcolor: "rgba(0,0,0,0.7)",
            }}
          >
            <Box
              bgcolor="white"
              borderRadius={3}
              boxShadow={4}
              px={4}
              py={3}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Typography variant="h6" color="error" fontWeight={700}>
                O carregamento está demorando...
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Verifique sua conexão ou tente novamente.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </Button>
            </Box>
          </Box>
        )}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: 4,
              px: 4,
              py: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="h5" color="primary" fontWeight={700}>
              Carregando comércios...
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Aguarde um instante enquanto buscamos os estabelecimentos
              cadastrados.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Exclusão real via API
  const handleDelete = async (id) => {
    setDialogOpen(false);
    try {
      await fetch(`http://localhost:3333/comercios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setComercios((prev) => prev.filter((c) => c.id !== id));
      setSnackbar({
        open: true,
        message: "Comércio excluído com sucesso!",
        severity: "success",
      });
      // Dispara evento global para atualizar Dashboard
      localStorage.setItem("refresh_dashboard", Date.now());
    } catch {
      setSnackbar({
        open: true,
        message: "Erro ao excluir comércio",
        severity: "error",
      });
    }
  };
  // Renderização principal
  return (
    <>
      {/* Loading do contexto do usuário */}
      {/* Aurora background effect */}
      {loadingUser ? (
        <Box
          sx={{
            width: "100vw",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingBackdrop open />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100vw",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.default",
            px: { xs: 1, sm: 2, md: 6 },
            py: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Aurora />
          {/* Feedback de erro de carregamento */}
          {erroCarregamento && (
            <Box
              sx={{
                width: "100vw",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="error" variant="h6">
                {erroCarregamento}
              </Typography>
            </Box>
          )}
          {/* Renderiza o conteúdo apenas se não estiver carregando nem com erro */}
          {!erroCarregamento && (
            <>
              {/* Banner */}
              <Box
                sx={{
                  width: "100%",
                  maxWidth: { xs: 380, sm: 520, md: 700 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: { xs: 3, sm: 4, md: 5 },
                  boxShadow: 6,
                  background:
                    "linear-gradient(90deg, #1976d2 0%, #43a047 100%)",
                  position: "relative",
                  overflow: "hidden",
                  py: { xs: 5, sm: 7, md: 10 },
                  px: { xs: 2.5, sm: 5, md: 8 },
                  mt: { xs: 7, sm: 10, md: 14 },
                  mb: { xs: 5, sm: 7, md: 10 },
                  gap: { xs: 2.5, sm: 3, md: 4 },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0.08,
                    background:
                      "url('https://www.transparenttextures.com/patterns/diamond-upholstery.png') repeat",
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    width: 160,
                    height: 160,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "background.paper",
                    borderRadius: "50%",
                    boxShadow: 4,
                    mb: 3,
                    zIndex: 1,
                    border: "3px solid #2563eb",
                    overflow: "hidden",
                    animation: "pulse 2s infinite",
                  }}
                  aria-label="Logo Andrelândia Conecta"
                  tabIndex={0}
                >
                  <img
                    src="/andrelandia-conecta-logo.png"
                    alt="Logo Andrelândia Conecta"
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Typography
                  variant="h1"
                  fontWeight={800}
                  mb={2}
                  align="center"
                  sx={(theme) => ({
                    color: "#fff",
                    zIndex: 1,
                    textShadow: "0 2px 8px #0002",
                    letterSpacing: 1,
                    fontFamily: theme.typography.fontFamily,
                    fontSize: { xs: "2.1rem", sm: "2.8rem", md: "3.2rem" },
                    lineHeight: 1.18,
                    maxWidth: { xs: "95vw", sm: 600, md: 700 },
                    mx: "auto",
                    wordBreak: "break-word",
                    px: { xs: 1, sm: 0 },
                  })}
                >
                  Andrelândia Conecta
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={500}
                  mb={2}
                  align="center"
                  sx={{
                    color: "#e0f2f1",
                    zIndex: 1,
                    letterSpacing: 0.5,
                    maxWidth: { xs: "90vw", sm: 520, md: 650 },
                    mx: "auto",
                    px: { xs: 1, sm: 0 },
                    textAlign: "center",
                  }}
                >
                  Visibilidade e gestão para o comércio local
                </Typography>
                <Typography
                  variant="body1"
                  mb={3}
                  align="center"
                  sx={{
                    color: "#fff",
                    fontSize: { xs: 16, sm: 18 },
                    zIndex: 1,
                    maxWidth: { xs: "92vw", sm: 520, md: 650 },
                    mx: "auto",
                    px: { xs: 1, sm: 0 },
                    textAlign: { xs: "justify", sm: "center" },
                    lineHeight: 1.6,
                  }}
                >
                  Plataforma para conectar, divulgar e fortalecer os negócios de
                  Andrelândia/MG e região.
                  <br />
                  <b style={{ display: "inline-block", marginTop: 16 }}>
                    Cadastre seu comércio e faça parte dessa rede!
                  </b>
                </Typography>
                {usuario?.tipo === "comerciante" && (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                      borderRadius: 4,
                      fontWeight: 700,
                      minWidth: 48,
                      minHeight: 48,
                      px: 5,
                      py: 2,
                      fontSize: 18,
                      boxShadow: "0 2px 8px #43a04733",
                      transition: "background 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #1565c0 0%, #388e3c 100%)",
                        boxShadow: "0 4px 16px #43a04733",
                      },
                      zIndex: 1,
                    }}
                    onClick={() => navigate("/comercios/novo")}
                  >
                    Cadastrar meu comércio
                  </Button>
                )}
              </Box>

              {/* Título e explicação dos filtros */}
              <Box
                sx={{ width: "100%", maxWidth: 900, mx: "auto", mt: 2, mb: 1 }}
              >
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="primary.main"
                  gutterBottom
                  align="center"
                >
                  Encontre o comércio ideal para você
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 2 }}
                >
                  Utilize os filtros abaixo para refinar sua busca. Você pode
                  pesquisar por nome, categoria, localização, faixa de preço e
                  avaliação mínima. Combine diferentes filtros para encontrar
                  exatamente o que procura entre os comércios cadastrados em
                  Andrelândia/MG e região.
                </Typography>
              </Box>
              {/* Busca e filtros avançados */}
              <Box
                sx={{
                  maxWidth: 900,
                  mx: "auto",
                  mb: 4,
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Busque por nome, categoria ou palavra-chave..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  aria-label="Buscar comércio por nome"
                  InputProps={{
                    startAdornment: (
                      <SearchIcon
                        sx={{ color: "#1976d2", mr: 1, fontSize: 28 }}
                      />
                    ),
                    sx: {
                      background:
                        "linear-gradient(90deg, #e3f2fd 0%, #f1f8e9 100%)",
                      borderRadius: 3,
                      fontSize: 18,
                      fontWeight: 500,
                      color: "#1a237e",
                      boxShadow: "0 2px 12px #1976d222",
                      transition: "box-shadow 0.3s, border-color 0.3s",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                        borderWidth: 2,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#43a047",
                        borderWidth: 2,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#388e3c",
                        borderWidth: 3,
                      },
                      input: {
                        padding: "14px 12px",
                        fontSize: 18,
                        fontWeight: 500,
                        color: "#1a237e",
                        letterSpacing: 0.5,
                      },
                      "input::placeholder": {
                        color: "#1976d2",
                        opacity: 1,
                        fontWeight: 400,
                        fontStyle: "italic",
                        fontSize: 17,
                        letterSpacing: 0.2,
                      },
                    },
                  }}
                  inputProps={{
                    maxLength: 60,
                    "aria-label": "Buscar comércio por nome",
                    autoComplete: "off",
                  }}
                  sx={{ minWidth: 320, flex: 1 }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Filtrar por endereço (rua, bairro, cidade...)"
                  value={localizacaoFiltro}
                  onChange={(e) => setLocalizacaoFiltro(e.target.value)}
                  aria-label="Filtrar por endereço"
                  InputProps={{
                    startAdornment: (
                      <SearchIcon
                        sx={{ color: "#1976d2", mr: 1, fontSize: 28 }}
                      />
                    ),
                    sx: {
                      background:
                        "linear-gradient(90deg, #e3f2fd 0%, #f1f8e9 100%)",
                      borderRadius: 3,
                      fontSize: 18,
                      fontWeight: 500,
                      color: "#1a237e",
                      boxShadow: "0 2px 12px #1976d222",
                      transition: "box-shadow 0.3s, border-color 0.3s",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                        borderWidth: 2,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#43a047",
                        borderWidth: 2,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#388e3c",
                        borderWidth: 3,
                      },
                      input: {
                        padding: "14px 12px",
                        fontSize: 18,
                        fontWeight: 500,
                        color: "#1a237e",
                        letterSpacing: 0.5,
                      },
                      "input::placeholder": {
                        color: "#1976d2",
                        opacity: 1,
                        fontWeight: 400,
                        fontStyle: "italic",
                        fontSize: 17,
                        letterSpacing: 0.2,
                      },
                    },
                  }}
                  inputProps={{
                    maxLength: 60,
                    "aria-label": "Filtrar por endereço",
                    autoComplete: "off",
                  }}
                  sx={{ minWidth: 220, flex: 1 }}
                />
                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel id="categoria-filtro-label" shrink>
                    Filtrar por categoria
                  </InputLabel>
                  <Select
                    labelId="categoria-filtro-label"
                    value={categoriaFiltro}
                    label="Filtrar por categoria"
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                    displayEmpty
                    sx={{ background: "#f7fafd", borderRadius: 2 }}
                  >
                    <MenuItem value="">
                      <em>Todas as categorias</em>
                    </MenuItem>
                    {categorias.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ minWidth: 220, px: 2 }}>
                  <Typography
                    fontWeight={600}
                    fontSize={15}
                    mb={0.5}
                    color="primary.main"
                  >
                    Faixa de preço (R$)
                  </Typography>
                  <Slider
                    value={precoRange}
                    onChange={(_, v) => setPrecoRange(v)}
                    valueLabelDisplay="auto"
                    min={precoMinGlobal}
                    max={precoMaxGlobal}
                    step={1}
                    marks={[
                      { value: precoMinGlobal, label: `R$${precoMinGlobal}` },
                      { value: precoMaxGlobal, label: `R$${precoMaxGlobal}` },
                    ]}
                    sx={{ mt: 1 }}
                    aria-label="Filtrar por faixa de preço"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={incluirSemProdutos}
                        onChange={(e) =>
                          setIncluirSemProdutos(e.target.checked)
                        }
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    }
                    label="Incluir comércios sem produtos"
                    sx={{ mt: 1, fontWeight: 500 }}
                  />
                </Box>
                <Box sx={{ minWidth: 180, px: 2 }}>
                  <Typography
                    fontWeight={600}
                    fontSize={15}
                    mb={0.5}
                    color="primary.main"
                  >
                    Nota mínima
                  </Typography>
                  <Rating
                    value={avaliacaoMin}
                    onChange={(_, v) => setAvaliacaoMin(v || 0)}
                    precision={1}
                    max={5}
                    sx={{ fontSize: 32 }}
                    aria-label="Filtrar por nota mínima"
                  />
                </Box>
              </Box>
              {/* Título e descrição dos cards */}
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 1200,
                  mx: "auto",
                  mt: 2,
                  mb: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="primary.main"
                  gutterBottom
                  align="center"
                  sx={{ width: "100%" }}
                >
                  Comércios cadastrados
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    maxWidth: { xs: "95vw", sm: 700, md: 900 },
                    textAlign: "center",
                    mx: "auto",
                    fontSize: { xs: 15, sm: 17 },
                    lineHeight: 1.4,
                  }}
                >
                  Veja abaixo os estabelecimentos disponíveis na plataforma. Use
                  os filtros para refinar sua busca.
                </Typography>
              </Box>
              {/* Grid de comércios */}
              <Grid
                container
                columns={12}
                spacing={2}
                justifyContent="center"
                alignItems="flex-start"
                sx={{ maxWidth: 1200, width: "100%", mx: "auto", mt: 0 }}
              >
                {loading ? (
                  <ComercioSkeletonList count={4} />
                ) : comerciosFiltrados.length === 0 ? (
                  <Grid gridColumn="span 12">
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 8,
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        align="center"
                      >
                        Nenhum comércio encontrado.
                      </Typography>
                    </Box>
                  </Grid>
                ) : (
                  comerciosFiltrados.map((comercio) => (
                    <Grid gridColumn="span 12" key={comercio.id}>
                      <AnimatedCard
                        sx={{
                          position: "relative",
                          borderRadius: { xs: 2, sm: 3, md: 4 },
                          boxShadow: 6,
                          bgcolor: "#fff",
                          transition: "box-shadow 0.3s, transform 0.2s",
                          cursor: "pointer",
                          "&:hover": {
                            boxShadow: 12,
                            transform: "translateY(-6px) scale(1.03)",
                          },
                          minHeight: { xs: 240, sm: 260, md: 280 }, // Mais espaço vertical
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          p: { xs: 1.5, sm: 2 },
                        }}
                        onClick={() => navigate(`/comercios/${comercio.id}`)}
                        aria-label={`Ver detalhes do comércio ${comercio.nome}`}
                      >
                        <CardContent sx={{ pb: 4, position: "relative" }}>
                          {/* Botão Visualizar e Favoritar lado a lado */}
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="center"
                            gap={2}
                            px={2}
                            pb={1.5}
                            mb={{ xs: 1.5, sm: 2 }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              size="large"
                              fullWidth={false}
                              sx={{
                                borderRadius: 2.5,
                                minWidth: 48,
                                minHeight: 44,
                                px: 2.5,
                                py: 1.2,
                                fontSize: 16,
                                fontWeight: 700,
                                boxShadow: 2,
                                letterSpacing: 0.5,
                                background: "#1565c0",
                                color: "#fff",
                                transition:
                                  "background 0.22s, box-shadow 0.22s",
                                "&:hover": {
                                  background: "#1976d2",
                                  color: "#fff",
                                  boxShadow: 4,
                                },
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/comercios/${comercio.id}`);
                              }}
                            >
                              Visualizar
                            </Button>
                            <FavoriteButton
                              item={{
                                id: comercio.id,
                                tipo: "comercio",
                                nome: comercio.nome,
                                descricao: comercio.descricao,
                                link: `/comercios/${comercio.id}`,
                                imagem: comercio.imagem || "",
                              }}
                              sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                zIndex: 2,
                                fontSize: 28,
                                p: 0.5,
                                color: "#f50057",
                              }}
                            />
                          </Box>
                          {/* Botão Visualizar removido, agora só existe o conjunto com Favoritar */}
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            mb={2}
                          >
                            {comercio.imagem ? (
                              <img
                                src={
                                  comercio.imagem.startsWith("/uploads")
                                    ? `http://localhost:3333${comercio.imagem}`
                                    : comercio.imagem
                                }
                                alt={comercio.nome}
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "2px solid #1976d2",
                                }}
                              />
                            ) : (
                              <Avatar
                                sx={{
                                  bgcolor: "primary.main",
                                  fontWeight: 700,
                                  width: 44,
                                  height: 44,
                                  fontSize: 22,
                                }}
                              >
                                {comercio.nome?.[0]?.toUpperCase() || "?"}
                              </Avatar>
                            )}
                            <Typography
                              variant="subtitle1"
                              fontWeight={700}
                              color="primary.main"
                              sx={{ flex: 1, fontSize: 20, letterSpacing: 0.5 }}
                            >
                              {comercio.nome}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                            sx={{ fontSize: 16 }}
                          >
                            {comercio.descricao}
                          </Typography>
                          {comercio.categoria && (
                            <Typography
                              variant="caption"
                              color="primary"
                              sx={{
                                fontWeight: 700,
                                background: "#e3f2fd",
                                borderRadius: 2,
                                px: 1.5,
                                py: 0.5,
                                fontSize: 14,
                                display: "inline-block",
                                mb: 1,
                                mt: 0.5,
                                letterSpacing: 0.5,
                              }}
                            >
                              {comercio.categoria}
                            </Typography>
                          )}
                          {/* Faixa de preço */}
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: 15, mt: 0.5 }}
                          >
                            <strong>Preço:</strong>{" "}
                            {getFaixaPreco(comercio.produtos) ? (
                              `R$${getFaixaPreco(comercio.produtos)[0]} - R$${
                                getFaixaPreco(comercio.produtos)[1]
                              }`
                            ) : (
                              <Box display="flex" alignItems="center" gap={1}>
                                <em>sem produtos</em>
                                <Chip
                                  label="Sem produtos"
                                  color="warning"
                                  size="small"
                                  sx={{
                                    fontWeight: 700,
                                    bgcolor: "#fff8e1",
                                    color: "#ff9800",
                                    borderRadius: 1,
                                  }}
                                />
                              </Box>
                            )}
                          </Typography>
                          {/* Média de avaliação */}
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mt={0.5}
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: 15 }}
                            >
                              <strong>Avaliação:</strong>
                            </Typography>
                            <Rating
                              value={
                                getMediaAvaliacao(comercio.avaliacoes) || 0
                              }
                              precision={0.1}
                              readOnly
                              size="small"
                              sx={{ fontSize: 20 }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {getMediaAvaliacao(comercio.avaliacoes)
                                ? getMediaAvaliacao(
                                    comercio.avaliacoes,
                                  ).toFixed(1)
                                : "-"}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: 15 }}
                          >
                            <strong>Endereço:</strong>{" "}
                            {comercio.endereco &&
                            comercio.endereco.trim() !== ""
                              ? comercio.endereco
                              : "Endereço não informado"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: 15 }}
                          >
                            <strong>Telefone:</strong> {comercio.telefone}
                          </Typography>
                        </CardContent>
                        {usuario?.tipo === "comerciante" && token && (
                          <Box
                            display="flex"
                            flexDirection={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "stretch", sm: "center" }}
                            justifyContent="flex-end"
                            gap={{ xs: 1, sm: 1.5 }}
                            px={2}
                            pb={2}
                            mt={{ xs: 1.5, sm: 2 }}
                          >
                            <Tooltip title="Editar">
                              <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                startIcon={<EditIcon sx={{ fontSize: 24 }} />}
                                fullWidth={true}
                                sx={{
                                  borderRadius: 2.5,
                                  minWidth: { xs: "100%", sm: 48 },
                                  minHeight: 44,
                                  px: { xs: 1.5, sm: 2.5 },
                                  py: { xs: 1, sm: 1.2 },
                                  fontSize: { xs: 15, sm: 16 },
                                  fontWeight: 700,
                                  backgroundColor: "#f5faff",
                                  color: "#1976d2",
                                  borderColor: "#1976d2",
                                  boxShadow: "0 2px 8px #1976d222",
                                  transition:
                                    "background 0.2s, box-shadow 0.2s",
                                  "&:hover": {
                                    backgroundColor: "#e3f2fd",
                                    color: "#1565c0",
                                    borderColor: "#1565c0",
                                    boxShadow: "0 4px 16px #1976d244",
                                  },
                                  "&:focus-visible": {
                                    outline: "2px solid #1976d2",
                                    outlineOffset: 2,
                                  },
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/comercios/${comercio.id}/editar`);
                                }}
                              >
                                Editar
                              </Button>
                            </Tooltip>
                            <Tooltip title="Excluir">
                              <Button
                                variant="outlined"
                                color="error"
                                size="large"
                                startIcon={<DeleteIcon sx={{ fontSize: 24 }} />}
                                fullWidth={true}
                                sx={{
                                  borderRadius: 2.5,
                                  minWidth: { xs: "100%", sm: 48 },
                                  minHeight: 44,
                                  px: { xs: 1.5, sm: 2.5 },
                                  py: { xs: 1, sm: 1.2 },
                                  fontSize: { xs: 15, sm: 16 },
                                  fontWeight: 700,
                                  backgroundColor: "#fff5f5",
                                  color: "#d32f2f",
                                  borderColor: "#d32f2f",
                                  boxShadow: "0 2px 8px #d32f2f22",
                                  transition:
                                    "background 0.2s, box-shadow 0.2s",
                                  "&:hover": {
                                    backgroundColor: "#ffebee",
                                    color: "#b71c1c",
                                    borderColor: "#b71c1c",
                                    boxShadow: "0 4px 16px #d32f2f44",
                                  },
                                  "&:focus-visible": {
                                    outline: "2px solid #d32f2f",
                                    outlineOffset: 2,
                                  },
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setComercioExcluir(comercio);
                                  setDialogOpen(true);
                                }}
                              >
                                Excluir
                              </Button>
                            </Tooltip>
                          </Box>
                        )}
                      </AnimatedCard>
                    </Grid>
                  ))
                )}
                {comercios.length < totalComercios && (
                  <div ref={sentinelRef} style={{ height: 1 }} />
                )}
              </Grid>
              {/* Dialog de confirmação */}
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Tem certeza que deseja excluir o comércio "
                    {comercioExcluir?.nome}"?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialogOpen(false)} color="primary">
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => handleDelete(comercioExcluir.id)}
                    color="error"
                    autoFocus
                    sx={{
                      borderRadius: 2,
                      minWidth: 48,
                      minHeight: 48,
                      px: 2,
                      py: 1.2,
                      fontSize: 16,
                      transition: "background 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        background: "#ffebee",
                        boxShadow: "0 2px 8px #d32f2f22",
                      },
                      "&:focus-visible": {
                        outline: "2px solid #d32f2f",
                        outlineOffset: 2,
                      },
                    }}
                  >
                    Excluir
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default ListaComercios;
