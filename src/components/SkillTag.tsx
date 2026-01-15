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
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-default",
        matched
          ? "bg-success/10 text-success border border-success/20 hover:bg-success/15 hover:border-success/30"
          : "bg-warning/10 text-warning border border-warning/20 hover:bg-warning/15 hover:border-warning/30",
        className
      )}
    >
      {matched ? (
        <Check className="w-4 h-4" />
      ) : (
        <X className="w-4 h-4" />
      )}
      <span>{skill}</span>
    </motion.div>
  );
}
