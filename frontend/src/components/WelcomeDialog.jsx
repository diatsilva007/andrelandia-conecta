import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function WelcomeDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>
        Bem-vindo à Andrelândia Conecta!
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
          Aqui você pode explorar comércios locais, favoritar produtos,
          cadastrar seu negócio e muito mais. Aproveite as dicas e navegue pelo
          menu para conhecer todos os recursos!
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Dica: Use os filtros para encontrar rapidamente o que procura.
          Cadastre seu comércio para aparecer no mapa da cidade!
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button variant="contained" color="primary" onClick={onClose}>
          Começar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
