import { motion } from "framer-motion";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SuggestionCardProps {
  suggestion: string;
  index: number;
  className?: string;
}

export function SuggestionCard({ suggestion, index, className }: SuggestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card variant="gradient-underline" className={cn("hover:shadow-lg", className)}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors group-hover:scale-110 transition-transform duration-300">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-relaxed">{suggestion}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
