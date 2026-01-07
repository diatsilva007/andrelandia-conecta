import React, { useState, useEffect } from "react";
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

// ...existing code...
const ListaComercios = () => {
  const navigate = useNavigate();
  const [comercios, setComercios] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [token] = useState(localStorage.getItem("token"));
  const [usuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  });
  // Filtros avançados
  const [precoRange, setPrecoRange] = useState([0, 1000]);
  const [avaliacaoMin, setAvaliacaoMin] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comercioExcluir, setComercioExcluir] = useState(null);
  const { setSnackbar } = useSnackbar();
  // Carregar comércios da API
  useEffect(() => {
    async function fetchComercios() {
      try {
        const res = await fetch("http://localhost:3333/comercios");
        const data = await res.json();
        setComercios(data);
      } catch {
        setSnackbar({
          open: true,
          message: "Erro ao carregar comércios",
          severity: "error",
        });
      }
    }
    fetchComercios();
  }, [setSnackbar]);

  // Função para remover acentos
  function normalizar(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  // Categorias sugeridas (pode ser expandido futuramente)
  const categorias = [
    "Alimentação",
    "Vestuário",
    "Serviços",
    "Saúde",
    "Educação",
    "Beleza",
    "Tecnologia",
    "Outros",
  ];

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
    // Filtro de preço
    const faixa = getFaixaPreco(c.produtos);
    const precoOk =
      !faixa || (faixa[1] >= precoRange[0] && faixa[0] <= precoRange[1]);
    // Filtro de avaliação
    const media = getMediaAvaliacao(c.avaliacoes);
    const avaliacaoOk =
      !avaliacaoMin || (media !== null && media >= avaliacaoMin);
    return buscaMatch && categoriaMatch && precoOk && avaliacaoOk;
  });

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
    } catch {
      setSnackbar({
        open: true,
        message: "Erro ao excluir comércio",
        severity: "error",
      });
    }
  };
  return (
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
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1200, mt: 2, mb: 1 }}>
        <BreadcrumbNav items={[{ label: "Início" }]} />
      </Box>
      {/* Banner */}
      {/* Banner centralizado */}
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: 360, sm: 500, md: 700 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: { xs: 2, sm: 4, md: 5 },
          boxShadow: 6,
          background: "linear-gradient(90deg, #1976d2 0%, #43a047 100%)",
          position: "relative",
          overflow: "hidden",
          py: { xs: 3, sm: 5, md: 8 },
          px: { xs: 1, sm: 3, md: 6 },
          mt: { xs: 6, sm: 10, md: 14 },
          mb: { xs: 4, sm: 6, md: 8 },
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
        <Avatar
          sx={{
            bgcolor: "secondary.main",
            width: 80,
            height: 80,
            fontSize: 44,
            mb: 2.5,
            boxShadow: 3,
            zIndex: 1,
            animation: "pulse 2s infinite",
          }}
        >
          🏪
        </Avatar>
        <Typography
          variant="h3"
          fontWeight={800}
          mb={1.5}
          sx={{
            color: "#fff",
            zIndex: 1,
            textShadow: "0 2px 8px #0002",
            letterSpacing: 1,
          }}
        >
          Andrelândia Conecta
        </Typography>
        <Typography
          variant="h6"
          fontWeight={500}
          mb={1.5}
          sx={{ color: "#e0f2f1", zIndex: 1, letterSpacing: 0.5 }}
        >
          Visibilidade e gestão para o comércio local
        </Typography>
        <Typography
          variant="body1"
          mb={2.5}
          sx={{
            color: "#fff",
            fontSize: 18,
            zIndex: 1,
            maxWidth: 600,
            textAlign: "center",
          }}
        >
          Plataforma para conectar, divulgar e fortalecer os negócios de
          Andrelândia/MG e região.
          <br />
          <b>Cadastre seu comércio e faça parte dessa rede!</b>
        </Typography>
        {usuario?.tipo === "comerciante" && (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              borderRadius: 4,
              fontWeight: 700,
              px: 5,
              py: 1.5,
              fontSize: 18,
              boxShadow: "0 2px 8px #43a04733",
              transition: "background 0.2s, box-shadow 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0 0%, #388e3c 100%)",
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
              <SearchIcon sx={{ color: "#1976d2", mr: 1, fontSize: 28 }} />
            ),
            sx: {
              background: "linear-gradient(90deg, #e3f2fd 0%, #f1f8e9 100%)",
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
      {/* Grid de comércios */}
      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 4 }}
        justifyContent="center"
        alignItems="flex-start"
        sx={{ maxWidth: 1200, width: "100%", mx: "auto", mt: 0 }}
      >
        {comerciosFiltrados.length === 0 && (
          <Grid item xs={12}>
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
                fontWeight={600}
                sx={{ letterSpacing: 0.5, textAlign: "center" }}
              >
                Nenhum comércio cadastrado ainda.
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                mt={2}
                sx={{ fontSize: 16, textAlign: "center" }}
              >
                Seja o primeiro a cadastrar seu negócio e fortalecer o comércio
                local!
              </Typography>
            </Box>
          </Grid>
        )}
        {comerciosFiltrados.length > 0 &&
          comerciosFiltrados.map((comercio) => (
            <Grid item xs={12} sm={6} md={4} key={comercio.id}>
              <Card
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
                  minHeight: { xs: 180, sm: 200, md: 220 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: { xs: 1.5, sm: 2 },
                }}
                onClick={() => navigate(`/comercios/${comercio.id}`)}
                aria-label={`Ver detalhes do comércio ${comercio.nome}`}
              >
                <CardContent sx={{ pb: 1 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
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
                      <em>sem produtos</em>
                    )}
                  </Typography>
                  {/* Média de avaliação */}
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: 15 }}
                    >
                      <strong>Avaliação:</strong>
                    </Typography>
                    <Rating
                      value={getMediaAvaliacao(comercio.avaliacoes) || 0}
                      precision={0.1}
                      readOnly
                      size="small"
                      sx={{ fontSize: 20 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {getMediaAvaliacao(comercio.avaliacoes)
                        ? getMediaAvaliacao(comercio.avaliacoes).toFixed(1)
                        : "-"}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: 15 }}
                  >
                    <strong>Endereço:</strong> {comercio.endereco}
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
                    gap={1}
                    justifyContent="flex-end"
                    px={2}
                    pb={2}
                  >
                    <Tooltip title="Editar">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        sx={{
                          borderRadius: 2,
                          minWidth: 0,
                          px: 1,
                          transition: "background 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            background: "#e3f2fd",
                            boxShadow: "0 2px 8px #1976d222",
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
                        size="small"
                        startIcon={<DeleteIcon />}
                        sx={{
                          borderRadius: 2,
                          minWidth: 0,
                          px: 1,
                          transition: "background 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            background: "#ffebee",
                            boxShadow: "0 2px 8px #d32f2f22",
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
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Dialog de confirmação */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o comércio "{comercioExcluir?.nome}"?
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
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ListaComercios;
