import { motion } from "framer-motion";
import { Card } from "@mui/material";

export default function AnimatedCard({ children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Card
        {...props}
        sx={{
          ...props.sx,
          boxShadow: 6,
          transition: "box-shadow 0.3s, transform 0.2s",
          "&:hover": {
            boxShadow: "0 8px 32px #1976d244",
            background: "#fff", // Mantém fundo branco no hover
          },
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
}
