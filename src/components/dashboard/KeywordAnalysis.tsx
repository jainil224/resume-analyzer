import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, Check, X } from "lucide-react";

interface KeywordAnalysisProps {
  usedKeywords: string[];
  missingKeywords: string[];
}

export function KeywordAnalysis({ usedKeywords, missingKeywords }: KeywordAnalysisProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" />
            Keyword Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Most Used Keywords</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {usedKeywords.length > 0 ? (
                  usedKeywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="bg-success/10 text-success border-success/20">
                      {keyword}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No keywords found</p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <X className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium">Missing Keywords</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.length > 0 ? (
                  missingKeywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
                      {keyword}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No missing keywords</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
