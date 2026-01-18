import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative flex items-center gap-3 rounded-full px-2 py-2 
        transition-all duration-500 cursor-pointer hover:scale-105 active:scale-95
        ${isDark 
          ? "bg-slate-800 border border-slate-700" 
          : "bg-secondary border border-border"
        }
      `}
      aria-label="Toggle theme"
    >
      {/* Animated circle container */}
      <motion.div
        layout
        className={`
          relative flex items-center justify-center w-10 h-10 rounded-full
          ${isDark 
            ? "bg-slate-700 order-last" 
            : "bg-primary order-first"
          }
        `}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Moon className="w-5 h-5 text-white" />
              {/* Stars decoration */}
              <motion.div
                className="absolute -top-1 -left-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="w-1 h-1 bg-white rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-3"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </motion.div>
              <motion.div
                className="absolute top-0 -right-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <div className="w-0.5 h-0.5 bg-white rounded-full" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Sun className="w-5 h-5 text-primary-foreground" />
              {/* Bubble decorations */}
              <motion.div
                className="absolute -top-0.5 -right-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="w-2 h-2 bg-primary-foreground/60 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -right-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <div className="w-1 h-1 bg-primary-foreground/40 rounded-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Text label */}
      <motion.span 
        layout
        className={`
          text-sm font-semibold tracking-wide whitespace-nowrap px-2
          ${isDark ? "text-white order-first" : "text-foreground order-last"}
        `}
      >
        {isDark ? "Dark" : "Light"}
      </motion.span>
    </button>
  );
}
