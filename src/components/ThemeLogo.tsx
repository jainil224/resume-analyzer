import { useTheme } from "next-themes";
import logo from "@/assets/logo.png";

interface ThemeLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function ThemeLogo({ size = "md", className = "" }: ThemeLogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={`relative flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      <img
        src={logo}
        alt="RA Logo"
        className={`w-full h-full object-contain transition-all duration-300 ${isDark ? "invert" : ""}`}
      />
    </div>
  );
}
