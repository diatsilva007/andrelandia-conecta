import React, { useState, useEffect } from "react";
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

function EditarPerfilDialog({ open, onClose, onSuccess }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
      setNome(usuario.nome || "");
      setEmail(usuario.email || "");
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      await axios.put(
        `http://localhost:3333/usuarios/${usuario.id}`,
        {
          nome,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSnackbar({
        open: true,
        message: "Perfil atualizado com sucesso!",
        severity: "success",
      });
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("usuario")),
          nome,
          email,
        })
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao atualizar perfil.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Perfil</DialogTitle>
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
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Tooltip title="Cancelar edição" arrow>
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
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      transform: "translateY(-1px) scale(1.02)",
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
            <Tooltip title="Salvar alterações do perfil" arrow>
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
                    fontWeight: 700,
                    fontSize: 17,
                    boxShadow: 3,
                    transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-2px) scale(1.03)",
                      backgroundColor: "primary.dark",
                    },
                    "&:focus-visible": {
                      outline: "2px solid #1976d2",
                      outlineOffset: 2,
                    },
                  }}
                >
                  Salvar
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

export default EditarPerfilDialog;
