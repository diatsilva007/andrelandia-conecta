import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useSnackbar } from "./SnackbarContext.jsx";

export default function GlobalSnackbar() {
  const { open, message, severity, handleClose } = useSnackbar();
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <MuiAlert
        onClose={handleClose}
        severity={severity || "info"}
        sx={{ width: "100%" }}
        elevation={6}
        variant="filled"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
}
