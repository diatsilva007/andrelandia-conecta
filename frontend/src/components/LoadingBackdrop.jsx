import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

export default function LoadingBackdrop({ open }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
