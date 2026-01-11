import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";

function CadastroProdutoDialog({ open, onClose, onSuccess }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [comercioId, setComercioId] = useState("");
  const [comercios, setComercios] = useState([]);
  const [semComercio, setSemComercio] = useState(false);
  useEffect(() => {
    if (!open) return;
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;
    // Buscar comércios do usuário logado
    const fetchComercios = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3333/comercios?usuarioId=${usuario.id}`
        );
        setComercios(res.data);
        if (res.data.length > 0) {
          setComercioId(res.data[0].id.toString());
          setSemComercio(false);
        } else {
          setSemComercio(true);
        }
      } catch {
        setComercios([]);
        setSemComercio(true);
      }
    };
    fetchComercios();
  }, [open]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (semComercio) return;
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3333/produtos",
        {
          nome,
          descricao,
          preco: parseFloat(preco),
          comercioId: parseInt(comercioId, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSnackbar({
        open: true,
        message: "Produto cadastrado com sucesso!",
        severity: "success",
      });
      setNome("");
      setDescricao("");
      setPreco("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao cadastrar produto.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Cadastrar Produto</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Preço"
              type="number"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {semComercio ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Você precisa cadastrar um comércio antes de cadastrar produtos.
              </Alert>
            ) : (
              <TextField
                select
                label="Comércio"
                value={comercioId}
                onChange={(e) => setComercioId(e.target.value)}
                fullWidth
                margin="normal"
                required
              >
                {comercios.map((com) => (
                  <MenuItem key={com.id} value={com.id.toString()}>
                    {com.nome}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </DialogContent>
          <DialogActions>
            <Tooltip title="Cancelar cadastro" arrow>
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
                  }}
                >
                  Cancelar
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Confirmar cadastro de produto" arrow>
              <span>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    minWidth: 48,
                    minHeight: 48,
                    px: 2.5,
                    py: 1.5,
                    borderRadius: 3,
                  }}
                >
                  Cadastrar
                </Button>
              </span>
            </Tooltip>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CadastroProdutoDialog;
