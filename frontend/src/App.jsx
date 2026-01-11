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
import DetalheProduto from "./pages/DetalheProduto.jsx";

import Navbar from "./components/Navbar.jsx";
import EditarComercio from "./pages/EditarComercio.jsx";
import EditarProduto from "./pages/EditarProduto.jsx";
import PageTransition from "./components/PageTransition.jsx";
import { useLocation } from "react-router-dom";

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
          transition:
            "background 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1)",
          willChange: "background, box-shadow, transform",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: { xs: "90vw", sm: "none" },
          "&:hover": {
            boxShadow: "0 4px 16px #1565c033",
            filter: "brightness(1.08)",
            transform: "scale(1.045)",
            backgroundColor: "#e3f2fd",
          },
          "&:focus-visible": {
            outline: "2px solid #1976d2",
            outlineOffset: 2,
            boxShadow: "0 0 0 4px #1976d244, 0 4px 16px #1565c033",
            transform: "scale(1.03)",
          },
          "&:active": {
            filter: "brightness(0.97)",
            transform: "scale(0.98)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 24px #1976d222",
          transition:
            "box-shadow 0.3s, transform 0.22s cubic-bezier(.4,0,.2,1), opacity 0.5s cubic-bezier(.4,0,.2,1)",
          opacity: 0,
          transform: "translateY(24px)",
          animation: "fadeInCard 0.7s cubic-bezier(.4,0,.2,1) forwards",
          willChange: "box-shadow, transform, opacity",
          "@keyframes fadeInCard": {
            from: { opacity: 0, transform: "translateY(24px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
          "&:hover": {
            boxShadow: "0 8px 32px #1976d244",
            transform: "scale(1.025) translateY(-2px)",
          },
          "&:focus-visible": {
            outline: "2px solid #1976d2",
            outlineOffset: 2,
            boxShadow: "0 0 0 4px #1976d244, 0 8px 32px #1976d244",
            transform: "scale(1.015) translateY(-1px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          // Removido background customizado para não afetar Alert variant='filled'
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          boxShadow: "0 8px 40px #1976d244",
          transition:
            "opacity 0.32s cubic-bezier(.4,0,.2,1), transform 0.32s cubic-bezier(.4,0,.2,1)",
          opacity: 0,
          transform: "translateY(32px) scale(0.98)",
          animation: "fadeInDialog 0.5s cubic-bezier(.4,0,.2,1) forwards",
          willChange: "opacity, transform",
          "@keyframes fadeInDialog": {
            from: { opacity: 0, transform: "translateY(32px) scale(0.98)" },
            to: { opacity: 1, transform: "translateY(0) scale(1)" },
          },
        },
      },
    },
  },
});

// Contexto para loading global
export const LoadingContext = createContext({ open: false, setOpen: () => {} });

function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <LoadingContext.Provider value={{ open: loading, setOpen: setLoading }}>
          <LoadingBackdrop open={loading} />
          <GlobalSnackbar />
          <Navbar />
          <PageTransition locationKey={location.key}>
            <Routes location={location}>
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
              <Route path="/produtos/:id" element={<DetalheProduto />} />
            </Routes>
          </PageTransition>
        </LoadingContext.Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
