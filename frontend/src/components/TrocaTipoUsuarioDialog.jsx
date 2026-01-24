import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";

export default function TrocaTipoUsuarioDialog({
  open,
  onClose,
  usuario,
  onTipoAtualizado,
}) {
  const [tipo, setTipo] = useState(usuario?.tipo || "cliente");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    setTipo(e.target.value);
  };

  const handleSalvar = async () => {
    setLoading(true);
    setErro("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:3333/usuarios/${usuario.id}`,
        { tipo },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onTipoAtualizado(res.data.tipo);
      onClose();
    } catch (err) {
      setErro(
        err.response?.data?.error || "Erro ao atualizar tipo de usuário.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{
        appear: true,
        onEnter: (node) => {
          node.style.opacity = 0;
          node.style.transform = "scale(0.96)";
          setTimeout(() => {
            node.style.transition = "all 0.32s cubic-bezier(.4,0,.2,1)";
            node.style.opacity = 1;
            node.style.transform = "scale(1)";
          }, 10);
        },
        onExited: (node) => {
          node.style.opacity = 0;
          node.style.transform = "scale(0.96)";
        },
      }}
    >
      <DialogTitle>Alterar tipo de usuário</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography>
            Você pode alternar entre <b>cliente</b> e <b>comerciante</b> para
            acessar todos os recursos da plataforma.
          </Typography>
        </Box>
        <FormControl fullWidth>
          <InputLabel id="tipo-label">Tipo</InputLabel>
          <Select
            labelId="tipo-label"
            value={tipo}
            label="Tipo"
            onChange={handleChange}
            disabled={loading}
          >
            <MenuItem value="cliente">Cliente</MenuItem>
            <MenuItem value="comerciante">Comerciante</MenuItem>
          </Select>
        </FormControl>
        {erro && (
          <Typography color="error" mt={2}>
            {erro}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Tooltip title="Cancelar alteração de tipo" arrow>
          <span>
            <Button
              onClick={onClose}
              disabled={loading}
              sx={{
                minWidth: 48,
                minHeight: 48,
                px: 2.5,
                py: 1.5,
                borderRadius: 3,
                transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                backgroundColor: "#fafafa",
                "&:hover": {
                  backgroundColor: "#ececec",
                  color: "#222",
                },
                "&:focus-visible": {
                  outline: "2px solid #1976d2",
                  outlineOffset: 2,
                },
              }}
            >
              Cancelar
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Salvar novo tipo de usuário" arrow>
          <span>
            <Button
              onClick={handleSalvar}
              variant="contained"
              color="primary"
              disabled={loading || !usuario || tipo === usuario?.tipo}
              sx={{
                minWidth: 48,
                minHeight: 48,
                px: 2.5,
                py: 1.5,
                borderRadius: 3,
              }}
            >
              Salvar
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
