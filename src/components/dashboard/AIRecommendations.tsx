import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Lightbulb } from "lucide-react";

interface AIRecommendationsProps {
  suggestions: string[];
}

const defaultSuggestions = [
  "Add more project-based skills to showcase practical experience",
  "Include measurable achievements with specific metrics",
  "Optimize headline for ATS compatibility",
  "Add relevant certifications to boost credibility",
  "Use action verbs to describe your accomplishments",
];

export function AIRecommendations({ suggestions }: AIRecommendationsProps) {
  const displaySuggestions = suggestions.length > 0 ? suggestions.slice(0, 5) : defaultSuggestions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.9 }}
    >
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displaySuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
              >
                <Lightbulb className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-sm">{suggestion}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
