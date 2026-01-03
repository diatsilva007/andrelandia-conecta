import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// ...existing code...
const ListaComercios = () => {
  const navigate = useNavigate();
  const [comercios] = useState([]);
  const [token] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comercioExcluir, setComercioExcluir] = useState(null);
  const handleDelete = () => {};
  return (
    // Banner institucional avançado + grid de comércios + Snackbar e Dialog
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 6 },
        py: { xs: 6, md: 10 },
        m: 0,
        borderRadius: 0,
        bgcolor: "background.default",
      }}
    >
      {/* Banner */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 700,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mb: 6,
          borderRadius: 5,
          boxShadow: 6,
          background: "linear-gradient(90deg, #1976d2 0%, #43a047 100%)",
          position: "relative",
          overflow: "hidden",
          py: { xs: 6, md: 10 },
          px: { xs: 2, md: 6 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.08,
            background:
              "url('https://www.transparenttextures.com/patterns/diamond-upholstery.png') repeat",
            zIndex: 0,
          }}
        />
        <Avatar
          sx={{
            bgcolor: "secondary.main",
            width: 90,
            height: 90,
            fontSize: 48,
            mb: 3,
            boxShadow: 3,
            zIndex: 1,
            animation: "pulse 2s infinite",
          }}
        >
          🏪
        </Avatar>
        <Typography
          variant="h2"
          fontWeight={800}
          mb={2}
          sx={{ color: "#fff", zIndex: 1, textShadow: "0 2px 8px #0002" }}
        >
          Andrelândia Conecta
        </Typography>
        <Typography
          variant="h5"
          fontWeight={500}
          mb={2}
          sx={{ color: "#e0f2f1", zIndex: 1 }}
        >
          Visibilidade e gestão para o comércio local
        </Typography>
        <Typography
          variant="body1"
          mb={3}
          sx={{ color: "#fff", fontSize: 20, zIndex: 1, maxWidth: 600 }}
        >
          Plataforma para conectar, divulgar e fortalecer os negócios de
          Andrelândia/MG e região.
          <br />
          Cadastre seu comércio e faça parte dessa rede!
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            borderRadius: 4,
            fontWeight: 700,
            px: 5,
            py: 2,
            fontSize: 20,
            boxShadow: "0 2px 8px #43a04733",
            transition: "background 0.2s, box-shadow 0.2s",
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0 0%, #388e3c 100%)",
              boxShadow: "0 4px 16px #43a04733",
            },
            zIndex: 1,
          }}
          onClick={() => navigate("/comercios/cadastrar")}
        >
          Cadastrar meu comércio
        </Button>
      </Box>

      {/* Grid de comércios */}
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="flex-start"
        sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}
      >
        {comercios.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h5" color="text.secondary" fontWeight={500}>
                Nenhum comércio cadastrado ainda.
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={2}>
                Seja o primeiro a cadastrar seu negócio e fortalecer o comércio
                local!
              </Typography>
            </Box>
          </Grid>
        )}
        {comercios.length > 0 &&
          comercios.map((comercio) => (
            <Grid item xs={12} sm={6} md={4} key={comercio.id}>
              <Card
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  boxShadow: 6,
                  bgcolor: "#fff",
                  transition: "box-shadow 0.3s, transform 0.2s",
                  "&:hover": {
                    boxShadow: 12,
                    transform: "translateY(-6px) scale(1.03)",
                  },
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                }}
              >
                <CardContent sx={{ pb: 1 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        fontWeight: 700,
                        width: 48,
                        height: 48,
                        fontSize: 24,
                      }}
                    >
                      {comercio.nome?.[0]?.toUpperCase() || "?"}
                    </Avatar>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="primary.main"
                      sx={{ flex: 1 }}
                    >
                      {comercio.nome}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {comercio.descricao}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Endereço:</strong> {comercio.endereco}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Telefone:</strong> {comercio.telefone}
                  </Typography>
                </CardContent>
                {token && (
                  <Box
                    display="flex"
                    gap={1}
                    justifyContent="flex-end"
                    px={2}
                    pb={2}
                  >
                    <Tooltip title="Editar">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        sx={{
                          borderRadius: 2,
                          minWidth: 0,
                          px: 1,
                          transition: "background 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            background: "#e3f2fd",
                            boxShadow: "0 2px 8px #1976d222",
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/comercios/${comercio.id}/editar`);
                        }}
                      >
                        Editar
                      </Button>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        sx={{
                          borderRadius: 2,
                          minWidth: 0,
                          px: 1,
                          transition: "background 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            background: "#ffebee",
                            boxShadow: "0 2px 8px #d32f2f22",
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setComercioExcluir(comercio);
                          setDialogOpen(true);
                        }}
                      >
                        Excluir
                      </Button>
                    </Tooltip>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Snackbar e Dialog */}
      <Snackbar>{/* ...conteúdo do Snackbar se houver... */}</Snackbar>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o comércio "{comercioExcluir?.nome}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => handleDelete(comercioExcluir.id)}
            color="error"
            autoFocus
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ListaComercios;
