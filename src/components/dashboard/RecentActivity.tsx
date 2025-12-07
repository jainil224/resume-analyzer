import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Analysis {
  id: string;
  resume_name: string;
  job_title: string | null;
  overall_score: number;
  created_at: string;
}

interface RecentActivityProps {
  analyses: Analysis[];
}

export function RecentActivity({ analyses }: RecentActivityProps) {
  const getScoreBadge = (score: number) => {
    if (score >= 75) return <Badge className="bg-success text-success-foreground">High</Badge>;
    if (score >= 50) return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
    return <Badge className="bg-destructive text-destructive-foreground">Low</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🕒 Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analyses.length > 0 ? (
            <div className="space-y-3">
              {analyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{analysis.resume_name}</p>
                    {analysis.job_title && (
                      <p className="text-xs text-muted-foreground truncate">{analysis.job_title}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getScoreBadge(analysis.overall_score)}
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {format(new Date(analysis.created_at), "MMM d")}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
