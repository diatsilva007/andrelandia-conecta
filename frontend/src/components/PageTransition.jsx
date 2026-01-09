import { motion, AnimatePresence } from "framer-motion";

export default function PageTransition({ children, locationKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={locationKey}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.32, ease: "easeInOut" }}
        style={{ minHeight: "100vh" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
