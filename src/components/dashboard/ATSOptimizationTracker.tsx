import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, CheckCircle, XCircle } from "lucide-react";

interface ATSOptimizationTrackerProps {
  averageAtsScore: number;
  totalAnalyses: number;
  atsDistribution: { low: number; medium: number; high: number };
}

export function ATSOptimizationTracker({
  averageAtsScore,
  totalAnalyses,
  atsDistribution,
}: ATSOptimizationTrackerProps) {
  const keywordMatchPercentage = Math.min(averageAtsScore * 5, 100);
  const passRate = totalAnalyses > 0 
    ? Math.round((atsDistribution.high / totalAnalyses) * 100) 
    : 0;
  const failRate = totalAnalyses > 0 
    ? Math.round((atsDistribution.low / totalAnalyses) * 100) 
    : 0;

  const metrics = [
    {
      label: "Avg Keyword Match",
      value: keywordMatchPercentage,
      icon: Target,
      color: "text-primary",
    },
    {
      label: "Pass Probability",
      value: passRate,
      icon: CheckCircle,
      color: "text-success",
    },
    {
      label: "Fail Rate",
      value: failRate,
      icon: XCircle,
      color: "text-destructive",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            ATS Optimization Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>
                  <span className="text-sm font-bold">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
