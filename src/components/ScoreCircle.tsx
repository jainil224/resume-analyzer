import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  showPercentage?: boolean;
  className?: string;
  variant?: "default" | "hero";
}

const sizeConfig = {
  sm: { width: 80, strokeWidth: 6, fontSize: "text-xl", labelSize: "text-xs" },
  md: { width: 120, strokeWidth: 8, fontSize: "text-3xl", labelSize: "text-sm" },
  lg: { width: 180, strokeWidth: 12, fontSize: "text-5xl", labelSize: "text-base" },
};

export function ScoreCircle({
  score,
  maxScore = 100,
  size = "md",
  label,
  showPercentage = true,
  className,
  variant = "default",
}: ScoreCircleProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (score / maxScore) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getScoreColor = () => {
    if (percentage >= 80) return "stroke-success";
    if (percentage >= 60) return "stroke-success";
    if (percentage >= 40) return "stroke-warning";
    return "stroke-destructive";
  };

  const getTextColor = () => {
    if (variant === "hero") return "text-primary-foreground";
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-success";
    if (percentage >= 40) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg
          className="transform -rotate-90"
          width={config.width}
          height={config.width}
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className={variant === "hero" ? "text-white/20" : "text-secondary"}
          />
          {/* Progress circle */}
          <motion.circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            className={variant === "hero" ? "stroke-white" : getScoreColor()}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("font-bold", config.fontSize, variant === "hero" ? "text-primary-foreground" : getTextColor())}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
          {showPercentage && (
            <span className={cn(
              config.labelSize,
              "font-medium",
              variant === "hero" ? "text-primary-foreground/60" : "text-muted-foreground"
            )}>
              / {maxScore}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className={cn(
          config.labelSize,
          "font-medium",
          variant === "hero" ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {label}
        </span>
      )}
    </div>
  );
}
