import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import LoadingBackdrop from "./components/LoadingBackdrop.jsx";
import React, { createContext, useState } from "react";
import { SnackbarProvider } from "./components/SnackbarContext.jsx";
import GlobalSnackbar from "./components/GlobalSnackbar.jsx";
import Login from "./pages/Login.jsx";
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
      main: "#1976d2", // azul forte
    },
    secondary: {
      main: "#43a047", // verde para remeter à natureza/local
    },
    background: {
      default: "#f4f6fa", // fundo claro e limpo
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h5: {
      fontWeight: 700,
      letterSpacing: 1,
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
              {/* Outras rotas futuras */}
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
