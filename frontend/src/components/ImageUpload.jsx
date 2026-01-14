import React, { useRef, useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

// Utilitário para comprimir imagem (usando canvas)
function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const w = img.width * scale;
      const h = img.height * scale;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({ label = "Imagem", onChange, value }) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(value || null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Arquivo não é uma imagem válida.");
      return;
    }
    setError("");
    // Compressão
    const blob = await compressImage(file);
    setPreview(URL.createObjectURL(blob));
    if (onChange) onChange(blob);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <Box
      sx={{
        border: dragActive ? "2px solid #1976d2" : "2px dashed #bdbdbd",
        borderRadius: 2,
        p: 2,
        textAlign: "center",
        position: "relative",
        background: dragActive ? "#e3f2fd" : "#fafafa",
        cursor: "pointer",
        minHeight: 180,
        mb: 2,
      }}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label={label}
    >
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: 140, borderRadius: 8 }}
        />
      ) : (
        <>
          <IconButton color="primary" component="span" size="large">
            <PhotoCamera fontSize="inherit" />
          </IconButton>
          <Typography variant="body2" color="textSecondary">
            Arraste uma imagem aqui ou clique para selecionar
          </Typography>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleInputChange}
        tabIndex={-1}
      />
      {error && (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      )}
    </Box>
  );
}
