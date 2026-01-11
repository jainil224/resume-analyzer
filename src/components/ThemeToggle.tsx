import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative flex items-center gap-2 rounded-full px-4 py-2 
        transition-colors duration-300 cursor-pointer
        ${isDark 
          ? "bg-card text-foreground border border-border" 
          : "bg-secondary text-foreground border border-border"
        }
      `}
    >
      {/* Icon circle */}
      <motion.div
        layout
        className={`
          flex items-center justify-center w-8 h-8 rounded-full
          ${isDark 
            ? "bg-primary text-primary-foreground order-first" 
            : "bg-background text-foreground order-last border border-border"
          }
        `}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </motion.div>

      {/* Text label */}
      <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
        {isDark ? "NIGHT MODE" : "DAY MODE"}
      </span>
    </button>
  );
}
