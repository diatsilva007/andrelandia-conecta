import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// ...existing code...
import { useSnackbar } from "../components/SnackbarContext.jsx";
import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import { LoadingContext } from "../App.jsx";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import ImageUpload from "../components/ImageUpload.jsx";
import { useNavigate, useParams } from "react-router-dom";
import VoltarButton from "../components/VoltarButton.jsx";

export default function EditarComercio() {
  const [loadingCoords, setLoadingCoords] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [imagemPreview, setImagemPreview] = useState(null);
  const [categorias] = useState([
    "Alimentação",
    "Vestuário",
    "Serviços",
    "Saúde",
    "Educação",
    "Beleza",
    "Tecnologia",
    "Outros",
  ]);
  const { setOpen } = useContext(LoadingContext);
  const { setSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // Busca latitude/longitude pelo endereço usando Nominatim (OpenStreetMap)
  const buscarCoordenadas = async () => {
    if (!form.endereco) {
      setErro("Preencha o endereço para buscar coordenadas.");
      return;
    }
    setLoadingCoords(true);
    setErro("");
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.endereco)}`,
      );
      if (res.data && res.data.length > 0) {
        setForm((f) => ({
          ...f,
          latitude: res.data[0].lat,
          longitude: res.data[0].lon,
        }));
      } else {
        setErro("Endereço não encontrado. Tente ser mais específico.");
      }
    } catch {
      setErro("Erro ao buscar coordenadas. Tente novamente.");
    } finally {
      setLoadingCoords(false);
    }
  };
  const [usuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  });
  const { id } = useParams();
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    endereco: "",
    telefone: "",
    categoria: "",
    imagem: null,
    latitude: "",
    longitude: "",
  });
  useEffect(() => {
    if (!localStorage.getItem("token") || usuario?.tipo !== "comerciante") {
      navigate("/login");
      return;
    }
    setOpen(true);
    axios
      .get(`http://localhost:3333/comercios/${id}`)
      .then((res) => {
        setForm(res.data);
        setImagemPreview(
          res.data.imagem ? `http://localhost:3333${res.data.imagem}` : null,
        );
      })
      .catch(() => setErro("Erro ao carregar dados do comércio."))
      .finally(() => {
        setLoading(false);
        setOpen(false);
      });
  }, [id, setOpen, navigate, usuario]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setOpen(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "imagem") formData.append(key, value);
      });
      if (form.imagem) formData.append("imagem", form.imagem);
      await axios.put(`http://localhost:3333/comercios/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSucesso("Comércio atualizado com sucesso!");
      setSnackbar({
        open: true,
        message: "Comércio atualizado com sucesso!",
        severity: "success",
      });
      setTimeout(
        () =>
          navigate("/", {
            state: { sucesso: "Comércio atualizado com sucesso!" },
          }),
        1200,
      );
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao atualizar comércio";
      setErro(msg);
      setSnackbar({
        open: true,
        message: msg,
        severity: "error",
      });
    } finally {
      setOpen(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box bgcolor="background.default" minHeight="100vh" py={{ xs: 2, sm: 4 }}>
      <Box sx={{ maxWidth: 420, mx: "auto", mb: 3 }}>
        <BreadcrumbNav
          items={[{ label: "Início", to: "/" }, { label: "Editar Comércio" }]}
        />
      </Box>
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: 420,
          mx: "auto",
          width: "100%",
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          mb={2}
          align="center"
          fontWeight={700}
          color="primary.main"
          sx={{ letterSpacing: 1 }}
        >
          Editar Comércio
        </Typography>
        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}
        {sucesso && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {sucesso}
          </Alert>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
          <ImageUpload
            label="Imagem do comércio"
            value={imagemPreview}
            onChange={(file) => {
              setForm((f) => ({ ...f, imagem: file }));
              setImagemPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
          <TextField
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ maxLength: 60, "aria-label": "Nome do comércio" }}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Categoria"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            fullWidth
            required={false}
            sx={{ mb: 2 }}
            helperText="Escolha a categoria principal do comércio"
          >
            <MenuItem value="">
              <em>Selecione</em>
            </MenuItem>
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Descrição"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            inputProps={{
              maxLength: 200,
              "aria-label": "Descrição do comércio",
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Endereço"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{
              maxLength: 120,
              "aria-label": "Endereço do comércio",
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Telefone"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            inputProps={{ maxLength: 20, "aria-label": "Telefone do comércio" }}
            sx={{ mb: 2 }}
          />
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <TextField
              label="Latitude"
              name="latitude"
              value={form.latitude || ""}
              onChange={handleChange}
              fullWidth
              type="number"
              inputProps={{ step: "any", "aria-label": "Latitude do comércio" }}
              placeholder="-21.7417"
            />
            <TextField
              label="Longitude"
              name="longitude"
              value={form.longitude || ""}
              onChange={handleChange}
              fullWidth
              type="number"
              inputProps={{
                step: "any",
                "aria-label": "Longitude do comércio",
              }}
              placeholder="-44.3111"
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={buscarCoordenadas}
              sx={{ minWidth: 44, height: 56 }}
            >
              Buscar pelo endereço
            </Button>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: 0.5,
              borderRadius: 2,
            }}
            aria-label="Salvar alterações do comércio"
          >
            Salvar
          </Button>
        </form>
        <VoltarButton
          label="Cancelar"
          onClick={() => navigate(-1)}
          sx={{ width: "100%", mt: 1 }}
        />
      </Paper>
    </Box>
  );
}
