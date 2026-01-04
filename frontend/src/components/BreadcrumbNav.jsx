import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BreadcrumbNav({ items }) {
  const navigate = useNavigate();
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, fontSize: 15 }}>
      {items.map((item, idx) =>
        item.to ? (
          <Link
            key={item.label}
            underline="hover"
            color="inherit"
            onClick={() => navigate(item.to)}
            sx={{ cursor: "pointer", fontWeight: 500 }}
          >
            {item.label}
          </Link>
        ) : (
          <Typography key={item.label} color="text.primary" fontWeight={600}>
            {item.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
