import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function FavoriteButton({ item }) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    const favStr = localStorage.getItem("favoritos");
    if (favStr) {
      const favs = JSON.parse(favStr);
      setFavorited(favs.some((f) => f.id === item.id && f.tipo === item.tipo));
    }
  }, [item.id, item.tipo]);

  const handleToggle = () => {
    const favStr = localStorage.getItem("favoritos");
    let favs = favStr ? JSON.parse(favStr) : [];
    if (favorited) {
      favs = favs.filter((f) => !(f.id === item.id && f.tipo === item.tipo));
    } else {
      // Garante todos os campos necessários, incluindo imagem
      const novoItem = {
        id: item.id,
        tipo: item.tipo,
        nome: item.nome || "",
        descricao: item.descricao || "",
        link:
          item.link ||
          (item.tipo === "comercio"
            ? `/comercios/${item.id}`
            : `/produtos/${item.id}`),
        imagem: item.imagem || "",
      };
      favs.push(novoItem);
    }
    localStorage.setItem("favoritos", JSON.stringify(favs));
    setFavorited(!favorited);
    // Dispara evento customizado para atualizar Favoritos.jsx
    window.dispatchEvent(new Event("favoritos-updated"));
  };

  return (
    <Tooltip
      title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <IconButton
        color={favorited ? "error" : "default"}
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        aria-label={
          favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"
        }
        sx={{ transition: "color 0.2s", fontSize: 28 }}
      >
        {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
}
