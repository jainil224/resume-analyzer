import { motion } from "framer-motion";
import { Sparkles, FileSearch, Brain, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { icon: FileSearch, label: "Parsing resume..." },
  { icon: Brain, label: "AI analyzing content..." },
  { icon: Sparkles, label: "Generating insights..." },
  { icon: CheckCircle, label: "Finalizing results..." },
];

interface LoadingAnalysisProps {
  currentStep?: number;
}

export function LoadingAnalysis({ currentStep = 1 }: LoadingAnalysisProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Animated AI Icon */}
      <motion.div
        className="relative mb-8"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="p-6 bg-accent-gradient rounded-full shadow-glow">
          <Brain className="w-12 h-12 text-accent-foreground" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-full bg-accent/20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-2">AI Analyzing Your Resume</h3>
      <p className="text-muted-foreground text-sm mb-8 text-center max-w-sm">
        Our AI is comparing your resume against the job requirements
      </p>

      {/* Progress Steps */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {steps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all",
              index < currentStep
                ? "bg-success/10"
                : index === currentStep
                ? "bg-accent/10"
                : "bg-secondary/50"
            )}
          >
            <div
              className={cn(
                "p-2 rounded-lg",
                index < currentStep
                  ? "bg-success/20"
                  : index === currentStep
                  ? "bg-accent/20"
                  : "bg-muted"
              )}
            >
              <step.icon
                className={cn(
                  "w-4 h-4",
                  index < currentStep
                    ? "text-success"
                    : index === currentStep
                    ? "text-accent"
                    : "text-muted-foreground"
                )}
              />
            </div>
            <span
              className={cn(
                "text-sm font-medium",
                index < currentStep
                  ? "text-success"
                  : index === currentStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
            {index === currentStep && (
              <motion.div
                className="ml-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full" />
              </motion.div>
            )}
            {index < currentStep && (
              <CheckCircle className="w-4 h-4 text-success ml-auto" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
