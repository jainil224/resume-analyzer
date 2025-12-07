import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, Users, Star, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
  delay: number;
}

function StatCard({ title, value, icon: Icon, trend, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`} />
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
              {trend && (
                <p className="text-xs text-success mt-1">{trend}</p>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatsCardsProps {
  totalResumes: number;
  analyzedResumes: number;
  totalCandidates: number;
  averageAtsScore: number;
  skillGapsDetected: number;
}

export function StatsCards({
  totalResumes,
  analyzedResumes,
  totalCandidates,
  averageAtsScore,
  skillGapsDetected,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Resumes",
      value: totalResumes,
      icon: FileText,
      color: "from-primary to-accent",
      trend: "+12% this month",
    },
    {
      title: "Resumes Analyzed",
      value: analyzedResumes,
      icon: CheckCircle,
      color: "from-success to-emerald-500",
    },
    {
      title: "Total Candidates",
      value: totalCandidates,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Average ATS Score",
      value: `${averageAtsScore}%`,
      icon: Star,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Skill Gaps Detected",
      value: skillGapsDetected,
      icon: AlertTriangle,
      color: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
}
