import { Button, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function VoltarButton({ sx = {}, label = "Voltar", ...props }) {
  const navigate = useNavigate();
  return (
    <Tooltip title={label} arrow>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="contained"
        color="secondary"
        onClick={() => navigate(-1)}
        sx={{
          mt: { xs: 2, sm: 3, md: 4 },
          mb: 1,
          fontWeight: 600,
          borderRadius: 3,
          boxShadow: 2,
          textTransform: "none",
          alignSelf: "flex-start",
          px: 2.5,
          py: 1.2,
          fontSize: { xs: "1rem", sm: "1.05rem" },
          ...sx,
        }}
        aria-label={label}
        {...props}
      >
        {label}
      </Button>
    </Tooltip>
  );
}
