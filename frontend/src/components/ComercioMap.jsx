import React from "react";
import { Box, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { categoriaIcons } from "../assets/markerIcons";

export default function ComercioMap({ comercios = [] }) {
  // Posição central padrão (Andrelândia/MG)
  const center = [-21.7417, -44.3111];
  return (
    <Box my={4}>
      <Typography variant="h6" fontWeight={700} color="primary.main" mb={2}>
        Mapa de localização dos comércios
      </Typography>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: 400, width: "100%", borderRadius: 12 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {comercios.map((com) => {
          if (!(com.latitude && com.longitude)) return null;
          return (
            <Marker
              key={com.id}
              position={[com.latitude, com.longitude]}
              icon={categoriaIcons.Padrao}
            >
              <Popup minWidth={220} maxWidth={320}>
                <Box>
                  <Box sx={{ p: 1.5, minWidth: 200, maxWidth: 300 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      color="primary.main"
                      sx={{ mb: 0.5, fontSize: 18, textAlign: "center" }}
                    >
                      {com.nome}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5, textAlign: "center" }}
                    >
                      {com.categoria || "Sem categoria"}
                    </Typography>
                    {com.imagem && (
                      <img
                        src={`http://localhost:3333${com.imagem}`}
                        alt={com.nome}
                        style={{
                          width: "100%",
                          maxHeight: 90,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginBottom: 8,
                          boxShadow: "0 2px 8px #1565c033",
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {com.endereco || "Endereço não informado"}
                    </Typography>
                    {com.descricao && (
                      <Typography
                        variant="body2"
                        color="secondary"
                        sx={{ mb: 0.5, fontStyle: "italic", textAlign: "left" }}
                      >
                        {com.descricao}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize={13}
                      sx={{ mt: 0.5, textAlign: "right" }}
                    >
                      Tel: {com.telefone || "Não informado"}
                    </Typography>
                    {com.email && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={13}
                        sx={{ mt: 0.5, textAlign: "right" }}
                      >
                        <span style={{ marginRight: 4 }}>E-mail:</span>
                        <a
                          href={`mailto:${com.email}`}
                          style={{
                            color: "#1976d2",
                            textDecoration: "underline",
                            wordBreak: "break-all",
                          }}
                        >
                          {com.email}
                        </a>
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
}
