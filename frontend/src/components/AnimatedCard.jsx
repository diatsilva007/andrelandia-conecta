import { motion } from "framer-motion";
import { Card } from "@mui/material";

export default function AnimatedCard({ children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
}
