import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface SkillTagProps {
  skill: string;
  matched?: boolean;
  className?: string;
}

export function SkillTag({ skill, matched = true, className }: SkillTagProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
        matched
          ? "bg-success/10 text-success border border-success/20"
          : "bg-warning/10 text-warning border border-warning/20",
        className
      )}
    >
      {matched ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <X className="w-3.5 h-3.5" />
      )}
      {skill}
    </motion.div>
  );
}
