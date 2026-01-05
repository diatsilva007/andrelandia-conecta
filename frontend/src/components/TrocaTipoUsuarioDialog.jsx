import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTipoAtualizado(res.data.tipo);
      onClose();
    } catch (err) {
      setErro(
        err.response?.data?.error || "Erro ao atualizar tipo de usuário."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSalvar}
          variant="contained"
          color="primary"
          disabled={loading || tipo === usuario.tipo}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
