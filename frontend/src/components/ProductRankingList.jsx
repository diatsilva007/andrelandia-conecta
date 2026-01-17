import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

export default function ProductRankingList({
  products = [],
  title = "Ranking de Produtos",
}) {
  return (
    <Card
      sx={{ boxShadow: 2, borderRadius: 3, bgcolor: "background.paper", mt: 3 }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700} color="primary.main" mb={2}>
          {title}
        </Typography>
        <List>
          {products.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center">
              Nenhum produto encontrado.
            </Typography>
          )}
          {products.map((prod, idx) => (
            <ListItem key={prod.id}>
              <ListItemAvatar>
                <Avatar
                  src={
                    prod.imagem
                      ? `http://localhost:3333${prod.imagem}`
                      : undefined
                  }
                >
                  {prod.nome?.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${idx + 1}. ${prod.nome}`}
                secondary={`Vendas: ${prod.vendas || 0} | Avaliações: ${prod.avaliacoes || 0}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
