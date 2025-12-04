import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { width: 80, strokeWidth: 6, fontSize: "text-lg" },
  md: { width: 120, strokeWidth: 8, fontSize: "text-2xl" },
  lg: { width: 180, strokeWidth: 10, fontSize: "text-4xl" },
};

export function ScoreCircle({
  score,
  maxScore = 100,
  size = "md",
  label,
  showPercentage = true,
  className,
}: ScoreCircleProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (score / maxScore) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getScoreColor = () => {
    if (percentage >= 80) return "stroke-success";
    if (percentage >= 60) return "stroke-accent";
    if (percentage >= 40) return "stroke-warning";
    return "stroke-destructive";
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
            className="text-secondary"
          />
          {/* Progress circle */}
          <motion.circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            className={getScoreColor()}
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
            className={cn("font-bold", config.fontSize)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
          {showPercentage && (
            <span className="text-xs text-muted-foreground">/ {maxScore}</span>
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
