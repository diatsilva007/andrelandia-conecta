import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
// Componente para centralizar o mapa quando latitude/longitude mudam
function MapAutoCenter({ latitude, longitude }) {
  const map = useMap();
  React.useEffect(() => {
    if (latitude && longitude) {
      map.setView([Number(latitude), Number(longitude)], map.getZoom(), {
        animate: true,
      });
    }
  }, [latitude, longitude, map]);
  return null;
}
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Ícone customizado para o marcador do comércio
const comercioIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function LocationSelector({ latitude, longitude, onChange }) {
  // Componente para capturar clique no mapa
  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });
  return null;
}
import React, { useState, useEffect, useContext } from "react";
// Função utilitária para comprimir imagem
function compressImage(file, maxWidth = 600, maxHeight = 600, quality = 0.7) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject("Arquivo não é imagem");
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressed = new File([blob], file.name, { type: blob.type });
            resolve(compressed);
          } else {
            reject("Falha ao comprimir imagem");
          }
        },
        file.type === "image/png" ? "image/png" : "image/jpeg",
        quality,
      );
    };
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
import { useUser } from "../contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Alert,
  Button,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import VoltarButton from "../components/VoltarButton.jsx";
import { categoriasComercio } from "../assets/categories.js";
import { useSnackbar } from "../components/SnackbarContext.jsx";
import { LoadingContext } from "../App.jsx";
// ...existing code...

export default function CadastroComercio() {
  const { usuario, loadingUser } = useUser();
  // Estado do formulário
  const [form, setForm] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    email: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone: "",
    latitude: "",
    longitude: "",
  });
  // Estado para erro de e-mail
  const [emailErro, setEmailErro] = useState("");
  // Sugestão de domínios
  const dominiosPopulares = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
  ];
  // Estado da imagem
  const [imagem, setImagem] = useState(null);
  const [imagemErro, setImagemErro] = useState("");
  // Categoria personalizada
  const [categoriaPersonalizada, setCategoriaPersonalizada] = useState("");
  // Estado de feedback visual
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const { setSnackbar } = useSnackbar();
  const { setOpen } = useContext(LoadingContext);
  const navigate = useNavigate();

  useEffect(() => {
    if ((!usuario || usuario?.tipo !== "comerciante") && !loadingUser) {
      navigate("/login");
    }
  }, [navigate, usuario, loadingUser]);
  if (loadingUser) {
    return null;
  }

  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    // Capitalização automática para nome
    if (name === "nome") {
      value = value.replace(/\b\w/g, (l) => l.toUpperCase());
      value = value.slice(0, 60);
    }
    // Limite de caracteres para descrição
    if (name === "descricao") {
      value = value.slice(0, 200);
    }
    // CEP: só números no estado
    if (name === "cep") {
      value = value.replace(/\D/g, "").slice(0, 8);
    }
    // Telefone: só números no estado
    if (name === "telefone") {
      value = value.replace(/\D/g, "").slice(0, 11);
    }
    // Validação de e-mail
    if (name === "email") {
      setEmailErro("");
      // Regex simples para e-mail
      const emailValido = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
      if (value && !emailValido) {
        setEmailErro("E-mail inválido");
      }
    }
    const novoForm = { ...form, [name]: value };
    setForm(novoForm);
    // Busca coordenadas só se todos os campos principais estiverem preenchidos
    const camposEndereco = [
      "logradouro",
      "numero",
      "bairro",
      "cidade",
      "estado",
      "cep",
    ];
    if (camposEndereco.includes(name)) {
      const { logradouro, numero, bairro, cidade, estado, cep } = novoForm;
      if (
        logradouro &&
        numero &&
        bairro &&
        cidade &&
        estado &&
        cep &&
        cep.length === 8
      ) {
        const enderecoCompleto = `${logradouro}, ${numero} - ${bairro}, ${cidade} - ${estado}, ${cep}`;
        axios
          .get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`,
          )
          .then((res) => {
            if (res.data && res.data.length > 0) {
              setForm((f) => ({
                ...f,
                latitude: res.data[0].lat,
                longitude: res.data[0].lon,
              }));
            } else {
              setForm((f) => ({ ...f, latitude: "", longitude: "" }));
              setSnackbar({
                open: true,
                message: "Endereço não localizado no mapa. Verifique os dados.",
                severity: "warning",
              });
            }
          })
          .catch(() => {
            setForm((f) => ({ ...f, latitude: "", longitude: "" }));
            setSnackbar({
              open: true,
              message: "Erro ao buscar localização do endereço.",
              severity: "error",
            });
          });
      } else {
        // Se algum campo for apagado, limpa a localização
        setForm((f) => ({ ...f, latitude: "", longitude: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    // Se selecionou "Outro (especificar)", usa a categoria personalizada
    const categoriaFinal =
      form.categoria === "Outro (especificar)"
        ? categoriaPersonalizada.trim()
        : form.categoria;
    if (
      form.categoria === "Outro (especificar)" &&
      !categoriaPersonalizada.trim()
    ) {
      setErro("Por favor, especifique a categoria do comércio.");
      setSnackbar({
        open: true,
        message: "Por favor, especifique a categoria do comércio.",
        severity: "warning",
      });
      return;
    }
    e.preventDefault();
    setErro("");
    setSucesso("");
    // Validação: exige latitude e longitude
    if (!form.latitude || !form.longitude) {
      setErro(
        "Preencha corretamente o endereço para localizar o comércio no mapa.",
      );
      setSnackbar({
        open: true,
        message:
          "Preencha corretamente o endereço para localizar o comércio no mapa.",
        severity: "warning",
      });
      return;
    }
    setOpen(true);
    try {
      const token = localStorage.getItem("token");
      // Monta o campo 'endereco' concatenando os campos separados
      const enderecoCompleto = `${form.logradouro}, ${form.numero} - ${form.bairro}, ${form.cidade} - ${form.estado}, CEP: ${form.cep}`;
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "categoria") {
          formData.append("categoria", categoriaFinal);
        } else if (key === "latitude" || key === "longitude") {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, String(Number(value)));
          }
        } else {
          formData.append(key, value);
        }
      });
      formData.append("endereco", enderecoCompleto);
      if (imagem) {
        formData.append("imagem", imagem, "comercio.jpg");
      }
      await axios.post("http://localhost:3333/comercios", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSucesso("Comércio cadastrado com sucesso!");
      setSnackbar({
        open: true,
        message: "Comércio cadastrado com sucesso!",
        severity: "success",
      });
      // Dispara evento global para atualizar Dashboard (e mapa)
      localStorage.setItem("refresh_dashboard", Date.now());
      setTimeout(
        () =>
          navigate("/", {
            state: { sucesso: "Comércio cadastrado com sucesso!" },
          }),
        1200,
      );
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao cadastrar comércio";
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

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        py: { xs: 2, sm: 4 },
      }}
    >
      <BreadcrumbNav
        items={[
          { label: "Comércios", to: "/comercios" },
          { label: "Cadastrar" },
        ]}
      />
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 400,
          mt: { xs: 2, sm: 3 },
          mb: 3,
          px: { xs: 1.5, sm: 2.5 },
          py: { xs: 2, sm: 2.5 },
          borderRadius: 3,
          boxShadow: "0 2px 12px #0001",
          background: (theme) => theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          color="primary.main"
          gutterBottom
          align="center"
          sx={{ fontSize: 22 }}
        >
          Cadastro de Comércio
        </Typography>
        {erro && (
          <Alert severity="error" sx={{ mb: 1.5 }}>
            {erro}
          </Alert>
        )}
        {sucesso && (
          <Alert severity="success" sx={{ mb: 1.5 }}>
            {sucesso}
          </Alert>
        )}
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}
        >
          <Box sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
            <span style={{ fontSize: 14, color: "#666" }}>
              Imagem do comércio (JPG, PNG ou WebP, até 5MB)
            </span>
          </Box>
          <ImageUpload
            label="Imagem do comércio"
            onChange={async (file) => {
              setImagemErro("");
              if (!file) {
                setImagem(null);
                return;
              }
              // Validação de formato
              const formatosPermitidos = [
                "image/jpeg",
                "image/png",
                "image/webp",
              ];
              if (!formatosPermitidos.includes(file.type)) {
                setImagem(null);
                setImagemErro(
                  "Formato de imagem não suportado. Envie JPG, PNG ou WebP.",
                );
                return;
              }
              // Validação de tamanho (opcional, 5MB)
              if (file.size > 5 * 1024 * 1024) {
                setImagem(null);
                setImagemErro("A imagem deve ter no máximo 5MB.");
                return;
              }
              // Compressão automática
              try {
                const comprimida = await compressImage(file);
                setImagem(comprimida);
              } catch (err) {
                setImagem(null);
                setImagemErro("Erro ao processar a imagem. Tente outra.");
              }
            }}
            value={null}
          />
          {imagemErro && (
            <Alert
              severity="error"
              sx={{
                mt: 1,
                mb: 0.5,
                px: 2,
                py: 1,
                alignItems: "center",
                fontSize: 15,
                borderRadius: 2,
                boxShadow: 1,
                maxWidth: 360,
              }}
            >
              {imagemErro}
            </Alert>
          )}
          {/* Campo de e-mail com sugestões de domínio */}
          <Autocomplete
            freeSolo
            options={
              form.email && form.email.includes("@")
                ? dominiosPopulares
                    .filter((dom) => dom.startsWith(form.email.split("@")[1]))
                    .map((dom) => form.email.split("@")[0] + "@" + dom)
                : []
            }
            inputValue={form.email}
            onInputChange={(_, newInput) => {
              handleChange({ target: { name: "email", value: newInput } });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="E-mail (opcional)"
                name="email"
                size="small"
                fullWidth
                error={!!emailErro}
                helperText={
                  form.email
                    ? emailErro || "Informe um e-mail válido para contato"
                    : "Se desejar, informe um e-mail para contato"
                }
                autoComplete="email"
                sx={{ mb: 1 }}
              />
            )}
          />
          {/* ...existing code... */}
          <TextField
            label="Nome do Comércio"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            inputProps={{ maxLength: 60 }}
            helperText={`${form.nome.length}/60 caracteres`}
          />
          <Autocomplete
            options={categoriasComercio}
            value={form.categoria}
            onChange={(_, newValue) => {
              handleChange({
                target: {
                  name: "categoria",
                  value: newValue || "",
                },
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Categoria" required size="small" />
            )}
            fullWidth
            disableClearable
            freeSolo={false}
          />
          {form.categoria === "Outro (especificar)" && (
            <TextField
              label="Especifique a categoria"
              value={categoriaPersonalizada}
              onChange={(e) => setCategoriaPersonalizada(e.target.value)}
              fullWidth
              required
              size="small"
              inputProps={{ maxLength: 40 }}
            />
          )}
          <TextField
            label="Descrição"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            size="small"
            inputProps={{ maxLength: 200 }}
            helperText={`${form.descricao.length}/200 caracteres`}
          />
          {/* Grupo de Endereço */}
          {/* Seletor de localização no mapa */}
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            sx={{ mt: 2, mb: 0.5 }}
          >
            Localização no mapa
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 220,
              mb: 1,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 1,
            }}
          >
            <MapContainer
              center={[
                form.latitude ? Number(form.latitude) : -21.7417,
                form.longitude ? Number(form.longitude) : -44.3111,
              ]}
              zoom={15}
              style={{ height: 220, width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* Centraliza o mapa automaticamente ao atualizar endereço */}
              <MapAutoCenter
                latitude={form.latitude}
                longitude={form.longitude}
              />
              {/* Permite ajuste manual clicando no mapa */}
              <LocationSelector
                latitude={form.latitude}
                longitude={form.longitude}
                onChange={({ lat, lng }) =>
                  setForm((f) => ({ ...f, latitude: lat, longitude: lng }))
                }
              />
              {form.latitude && form.longitude && (
                <Marker
                  position={[Number(form.latitude), Number(form.longitude)]}
                  icon={comercioIcon}
                />
              )}
            </MapContainer>
          </Box>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <TextField
              label="Latitude"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              size="small"
              fullWidth
              inputProps={{ inputMode: "decimal", pattern: "[0-9.-]*" }}
            />
            <TextField
              label="Longitude"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              size="small"
              fullWidth
              inputProps={{ inputMode: "decimal", pattern: "[0-9.-]*" }}
            />
          </Box>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            sx={{ mt: 1, mb: 0.5 }}
          >
            Endereço
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Logradouro"
              name="logradouro"
              value={form.logradouro}
              onChange={handleChange}
              required
              size="small"
              sx={{ flex: 2 }}
            />
            <TextField
              label="Número"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              required
              size="small"
              sx={{ flex: 1, minWidth: 80 }}
            />
          </Box>
          <TextField
            label="Bairro"
            name="bairro"
            value={form.bairro}
            onChange={handleChange}
            required
            size="small"
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Cidade"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              required
              size="small"
              sx={{ flex: 2 }}
            />
            <TextField
              label="Estado"
              name="estado"
              value={form.estado}
              onChange={handleChange}
              required
              size="small"
              sx={{ flex: 1, minWidth: 60 }}
            />
          </Box>
          <TextField
            label="CEP"
            name="cep"
            value={
              form.cep.length > 5
                ? form.cep.replace(/(\d{5})(\d{1,3})/, "$1-$2")
                : form.cep
            }
            onChange={handleChange}
            required
            size="small"
            inputProps={{
              maxLength: 9,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            helperText="Formato: 99999-999"
          />
          <TextField
            label="Telefone"
            name="telefone"
            value={
              form.telefone.length > 0
                ? form.telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
                : form.telefone
            }
            onChange={handleChange}
            fullWidth
            required
            size="small"
            inputProps={{ maxLength: 15, inputMode: "tel", pattern: "[0-9]*" }}
            helperText="Formato: (99) 99999-9999"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: 0.3,
              borderRadius: 2,
              py: 1,
              mt: 0.5,
              textTransform: "none",
              backgroundColor: (theme) => theme.palette.primary.main,
              color: "#fff",
              transition: "background 0.2s",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.dark,
                color: "#fff",
                boxShadow: 2,
              },
            }}
          >
            Cadastrar
          </Button>
          <VoltarButton
            label="Cancelar"
            onClick={() => navigate(-1)}
            sx={{ width: "100%", mt: 0.5 }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
