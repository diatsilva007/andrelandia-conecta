import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import LoadingBackdrop from "./components/LoadingBackdrop.jsx";
import React, { createContext, useState } from "react";
import { SnackbarProvider } from "./components/SnackbarContext.jsx";
import GlobalSnackbar from "./components/GlobalSnackbar.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ListaComercios from "./pages/ListaComercios.jsx";
import DetalheComercio from "./pages/DetalheComercio.jsx";
import CadastroComercio from "./pages/CadastroComercio.jsx";
import CadastroProduto from "./pages/CadastroProduto.jsx";
import CadastroUsuario from "./pages/CadastroUsuario.jsx";
import EsqueciSenha from "./pages/EsqueciSenha.jsx";
import RedefinirSenha from "./pages/RedefinirSenha.jsx";
import Navbar from "./components/Navbar.jsx";
import EditarComercio from "./pages/EditarComercio.jsx";
import EditarProduto from "./pages/EditarProduto.jsx";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565c0", // azul profundo
      contrastText: "#fff",
      gradient: "linear-gradient(90deg, #1565c0 0%, #43a047 100%)",
    },
    secondary: {
      main: "#43a047", // verde vibrante
      contrastText: "#fff",
      gradient: "linear-gradient(90deg, #43a047 0%, #1565c0 100%)",
    },
    background: {
      default: "#f4f6fa",
      paper: "#fff",
      gradient: "linear-gradient(120deg, #e3f2fd 0%, #e8f5e9 100%)",
    },
    info: {
      main: "#0288d1",
    },
    success: {
      main: "#388e3c",
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#ffa000",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h5: {
      fontWeight: 700,
      letterSpacing: 1.2,
      textShadow: "0 2px 8px #0002",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: 1,
    },
    button: {
      fontWeight: 700,
      letterSpacing: 0.5,
      textTransform: "none",
      transition: "all 0.2s",
    },
  },
  shape: {
    borderRadius: 12,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 8px #43a04733",
          transition: "all 0.2s",
          "&:hover": {
            boxShadow: "0 4px 16px #1565c033",
            filter: "brightness(1.08)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 24px #1976d222",
          transition: "box-shadow 0.3s",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: "linear-gradient(120deg, #e3f2fd 0%, #e8f5e9 100%)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #1565c0 0%, #43a047 100%)",
        },
      },
    },
  },
});

// Contexto para loading global
export const LoadingContext = createContext({ open: false, setOpen: () => {} });

function App() {
  const [loading, setLoading] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <LoadingContext.Provider value={{ open: loading, setOpen: setLoading }}>
          <LoadingBackdrop open={loading} />
          <GlobalSnackbar />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/registrar" element={<CadastroUsuario />} />
              <Route path="/esqueci-senha" element={<EsqueciSenha />} />
              <Route
                path="/redefinir-senha/:token"
                element={<RedefinirSenha />}
              />
              <Route
                path="/comercios/:id/editar"
                element={<EditarComercio />}
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<ListaComercios />} />
              <Route path="/comercios/:id" element={<DetalheComercio />} />
              <Route path="/comercios/novo" element={<CadastroComercio />} />
              <Route
                path="/comercios/:id/produtos/novo"
                element={<CadastroProduto />}
              />
              <Route path="/produtos/:id/editar" element={<EditarProduto />} />
            </Routes>
          </BrowserRouter>
        </LoadingContext.Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
