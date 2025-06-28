import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Login from "./pages/Login.jsx";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // azul forte
    },
    secondary: {
      main: '#43a047', // verde para remeter à natureza/local
    },
    background: {
      default: '#f4f6fa', // fundo claro e limpo
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: 1,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Outras rotas futuras */}
          <Route
            path="/"
            element={<div>Bem-vindo à Plataforma de Gestão e Visibilidade!</div>}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
