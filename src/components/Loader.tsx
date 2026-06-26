import { motion } from "framer-motion";
import logoAln from "@/assets/logo-aln-white.png";

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, hsl(222 47% 6%) 0%, hsl(222 47% 11%) 40%, hsl(225 50% 16%) 70%, hsl(222 47% 10%) 100%)",
      }}
    >
      <motion.div
        initial={{ rotateY: 0, scale: 0.8, opacity: 0 }}
        animate={{
          rotateY: [0, 180, 360],
          scale: [0.8, 1.1, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 1.8,
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
        style={{ perspective: 800 }}
      >
        <img
          src={logoAln}
          alt="All You Need"
          className="h-20 md:h-28 w-auto drop-shadow-2xl"
        />
      </motion.div>

      {/* Subtle pulsing ring */}
      <motion.div
        className="absolute rounded-full border border-accent/20"
        initial={{ width: 100, height: 100, opacity: 0 }}
        animate={{
          width: [100, 160],
          height: [100, 160],
          opacity: [0.4, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
};

export default Loader;
