import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { TrendingUp, Target, Award, Sparkles } from "lucide-react";

interface PerformanceData {
  skillStrength: number;
  atsProgress: number;
  resumeImprovement: number;
  overallScore: number;
}

interface CandidatePerformanceChartProps {
  data: PerformanceData;
}

export function CandidatePerformanceChart({ data }: CandidatePerformanceChartProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getProgressClass = (score: number) => {
    if (score >= 80) return "[&>div]:bg-success";
    if (score >= 60) return "[&>div]:bg-warning";
    return "[&>div]:bg-destructive";
  };

  const metrics = [
    { 
      label: "Skill Strength", 
      value: data.skillStrength, 
      icon: Target,
      description: "Overall skill proficiency"
    },
    { 
      label: "ATS Score", 
      value: data.atsProgress, 
      icon: Award,
      description: "Resume ATS compatibility"
    },
    { 
      label: "Resume Quality", 
      value: data.resumeImprovement, 
      icon: Sparkles,
      description: "Content and formatting quality"
    },
    { 
      label: "Overall Performance", 
      value: data.overallScore, 
      icon: TrendingUp,
      description: "Combined candidate rating"
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{metric.label}</span>
              </div>
              <span className={`text-sm font-bold ${getScoreColor(metric.value)}`}>
                {metric.value}%
              </span>
            </div>
            <Progress value={metric.value} className={`h-2 ${getProgressClass(metric.value)}`} />
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}