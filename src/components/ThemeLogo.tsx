import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

interface ThemeLogoProps {
  size?: "sm" | "md" | "lg";
  isProcessing?: boolean;
  className?: string;
}

export function ThemeLogo({ size = "md", isProcessing = false, className = "" }: ThemeLogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <motion.div
      className={`relative flex-shrink-0 ${sizeClasses[size]} ${className}`}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Pulsing glow effect when processing */}
      {isProcessing && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/40"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-accent/30"
            animate={{
              scale: [1, 2.2, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3,
            }}
          />
        </>
      )}

      {/* Logo image with smooth transition */}
      <motion.img
        src={isDark ? logoDark : logoLight}
        alt="RA Logo"
        className="w-full h-full object-contain transition-all duration-300"
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isProcessing ? [1, 1.05, 1] : 1,
        }}
        transition={{ 
          duration: 0.5, 
          ease: "easeOut",
          scale: isProcessing ? {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          } : undefined,
        }}
      />
    </motion.div>
  );
}
