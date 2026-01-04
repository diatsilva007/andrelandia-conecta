import React, { createContext, useContext, useState } from "react";

const SnackbarContext = createContext({
  open: false,
  message: "",
  severity: "info",
  setSnackbar: () => {},
});

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ ...snackbar, setSnackbar, handleClose }}>
      {children}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
