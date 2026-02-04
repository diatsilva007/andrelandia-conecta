import BreadcrumbNav from "../components/BreadcrumbNav.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import React, { useState, useEffect, useContext } from "react";
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
  // Estado da imagem
  const [imagem, setImagem] = useState(null);
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
    const novoForm = { ...form, [name]: value };
    setForm(novoForm);
    // Se o campo alterado for parte do endereço, busca coordenadas automaticamente
    const camposEndereco = [
      "logradouro",
      "numero",
      "bairro",
      "cidade",
      "estado",
      "cep",
    ];
    if (camposEndereco.includes(name)) {
      const enderecoCompleto = `${novoForm.logradouro}, ${novoForm.numero} - ${novoForm.bairro}, ${novoForm.cidade} - ${novoForm.estado}, CEP: ${novoForm.cep}`;
      if (enderecoCompleto.replace(/[,-CEP: ]/g, "").length > 0) {
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
            }
          });
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
          <ImageUpload
            label="Imagem do comércio"
            onChange={setImagem}
            value={null}
          />
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
