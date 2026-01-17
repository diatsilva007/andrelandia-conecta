import React from "react";
import { Box, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
        {comercios.map((com) =>
          com.latitude && com.longitude ? (
            <Marker key={com.id} position={[com.latitude, com.longitude]}>
              <Popup>
                <strong>{com.nome}</strong>
                <br />
                {com.categoria || "Sem categoria"}
              </Popup>
            </Marker>
          ) : null,
        )}
      </MapContainer>
    </Box>
  );
}
