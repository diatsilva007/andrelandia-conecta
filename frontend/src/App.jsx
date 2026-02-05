import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ThemeProviderCustom, useThemeMode } from "./contexts/ThemeContext.jsx";
import LoadingBackdrop from "./components/LoadingBackdrop.jsx";
import React, { useState } from "react";
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
import Favoritos from "./pages/Favoritos.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import WelcomeDialog from "./components/WelcomeDialog.jsx";
import EditarComercio from "./pages/EditarComercio.jsx";
import EditarProduto from "./pages/EditarProduto.jsx";
import PageTransition from "./components/PageTransition.jsx";
import PerfilPublico from "./pages/PerfilPublico.jsx";
import HistoricoUsuario from "./pages/HistoricoUsuario.jsx";
import { useLocation } from "react-router-dom";
import { useUser } from "./contexts/UserContext.jsx";
// Contexto para loading global
export const LoadingContext = React.createContext({
  open: false,
  setOpen: () => {},
});

function getTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#1565c0",
        contrastText: "#fff",
        gradient: "linear-gradient(90deg, #1565c0 0%, #43a047 100%)",
      },
      secondary: {
        main: "#43a047",
        contrastText: "#fff",
        gradient: "linear-gradient(90deg, #43a047 0%, #1565c0 100%)",
      },
      background:
        mode === "dark"
          ? {
              default: "#181c22",
              paper: "#23272f",
              gradient: "linear-gradient(120deg, #23272f 0%, #181c22 100%)",
            }
          : {
              default: "#f4f6fa",
              paper: "#fff",
              gradient: "linear-gradient(120deg, #e3f2fd 0%, #e8f5e9 100%)",
            },
      info: { main: "#0288d1" },
      success: { main: "#388e3c" },
      error: { main: "#d32f2f" },
      warning: { main: "#ffa000" },
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      h5: {
        fontWeight: 700,
        letterSpacing: 1.2,
        textShadow: mode === "dark" ? "0 2px 8px #0008" : "0 2px 8px #0002",
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
    shape: { borderRadius: 12 },
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
      values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow:
              mode === "dark" ? "0 2px 8px #1565c055" : "0 2px 8px #43a04733",
            transition:
              "background 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1)",
            willChange: "background, box-shadow, transform",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: { xs: "90vw", sm: "none" },
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0 4px 16px #1565c088"
                  : "0 4px 16px #1565c033",
              filter: "brightness(1.08)",
              transform: "scale(1.045)",
              backgroundColor: mode === "dark" ? "#23272f" : "#e3f2fd",
            },
            "&:focus-visible": {
              outline: "2px solid #1976d2",
              outlineOffset: 2,
              boxShadow:
                mode === "dark"
                  ? "0 0 0 4px #1976d288, 0 4px 16px #1565c088"
                  : "0 0 0 4px #1976d244, 0 4px 16px #1565c033",
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
            boxShadow:
              mode === "dark" ? "0 4px 24px #1976d244" : "0 4px 24px #1976d222",
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
              boxShadow:
                mode === "dark"
                  ? "0 8px 32px #1976d288"
                  : "0 8px 32px #1976d244",
              transform: "scale(1.025) translateY(-2px)",
            },
            "&:focus-visible": {
              outline: "2px solid #1976d2",
              outlineOffset: 2,
              boxShadow:
                mode === "dark"
                  ? "0 0 0 4px #1976d288, 0 8px 32px #1976d288"
                  : "0 0 0 4px #1976d244, 0 8px 32px #1976d244",
              transform: "scale(1.015) translateY(-1px)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 18,
            boxShadow:
              mode === "dark" ? "0 8px 40px #1976d288" : "0 8px 40px #1976d244",
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
}

function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { mode } = useThemeMode();
  const theme = getTheme(mode);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const { loadingUser, usuario } = useUser();
  // [DEBUG] console.log('[App] usuario:', usuario);
  // [DEBUG] console.log('[App] loadingUser:', loadingUser);

  React.useEffect(() => {
    // Exibe mensagem de boas-vindas apenas se nunca foi vista
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (usuario && !hasSeenWelcome) {
      setWelcomeOpen(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    setWelcomeOpen(false);
    localStorage.setItem("hasSeenWelcome", "true");
  };

  // Suspense global para rotas protegidas
  if (loadingUser) {
    // [DEBUG] console.log('[App] Exibindo loading global (loadingUser)');
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingBackdrop open={true} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <LoadingContext.Provider value={{ open: loading, setOpen: setLoading }}>
          <LoadingBackdrop open={loading} />
          <GlobalSnackbar />
          <Navbar />
          <WelcomeDialog open={welcomeOpen} onClose={handleCloseWelcome} />
          <PageTransition locationKey={location.key}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/registrar" element={<CadastroUsuario />} />
              <Route path="/esqueci-senha" element={<EsqueciSenha />} />
              <Route
                path="/redefinir-senha/:token"
                element={<RedefinirSenha />}
              />
              <Route path="/" element={<ListaComercios />} />
              <Route path="/comercios/:id" element={<DetalheComercio />} />
              <Route
                path="/comercios/:id/editar"
                element={
                  <ProtectedRoute>
                    <EditarComercio />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/comercios/novo"
                element={
                  <ProtectedRoute>
                    <CadastroComercio />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/comercios/:id/produtos/novo"
                element={
                  <ProtectedRoute>
                    <CadastroProduto />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/produtos/:id/editar"
                element={
                  <ProtectedRoute>
                    <EditarProduto />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favoritos"
                element={
                  <ProtectedRoute>
                    <Favoritos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil/:id"
                element={
                  <ProtectedRoute>
                    <PerfilPublico />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/historico"
                element={
                  <ProtectedRoute>
                    <HistoricoUsuario />
                  </ProtectedRoute>
                }
              />
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
      <ThemeProviderCustom>
        <App />
      </ThemeProviderCustom>
    </BrowserRouter>
  );
}
