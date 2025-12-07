import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Code, Heart, Building } from "lucide-react";

interface SkillGapAnalysisProps {
  missingSkills: { name: string; count: number }[];
  totalAnalyses: number;
}

export function SkillGapAnalysis({ missingSkills, totalAnalyses }: SkillGapAnalysisProps) {
  // Categorize skills (simplified categorization)
  const technicalKeywords = ["python", "java", "javascript", "react", "sql", "aws", "docker", "kubernetes", "typescript", "node"];
  const softKeywords = ["communication", "leadership", "teamwork", "problem", "analytical", "management"];

  const technicalGaps = missingSkills.filter(s => 
    technicalKeywords.some(k => s.name.toLowerCase().includes(k))
  );
  const softGaps = missingSkills.filter(s => 
    softKeywords.some(k => s.name.toLowerCase().includes(k))
  );
  const otherGaps = missingSkills.filter(s => 
    !technicalKeywords.some(k => s.name.toLowerCase().includes(k)) &&
    !softKeywords.some(k => s.name.toLowerCase().includes(k))
  );

  const calculatePercentage = (count: number) => 
    totalAnalyses > 0 ? Math.round((count / totalAnalyses) * 100) : 0;

  const gaps = [
    {
      title: "Technical Skills",
      icon: Code,
      items: technicalGaps.slice(0, 3),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Soft Skills",
      icon: Heart,
      items: softGaps.slice(0, 3),
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      title: "Industry Skills",
      icon: Building,
      items: otherGaps.slice(0, 3),
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Skill Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {missingSkills.length > 0 ? (
            <div className="space-y-6">
              {gaps.map((gap, index) => (
                <div key={gap.title}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded ${gap.bgColor}`}>
                      <gap.icon className={`w-4 h-4 ${gap.color}`} />
                    </div>
                    <span className="font-medium text-sm">{gap.title}</span>
                  </div>
                  {gap.items.length > 0 ? (
                    <div className="space-y-2">
                      {gap.items.map(skill => (
                        <div key={skill.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{skill.name}</span>
                            <span className="font-medium">{calculatePercentage(skill.count)}% lack this</span>
                          </div>
                          <Progress value={calculatePercentage(skill.count)} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No gaps detected</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">No skill gaps detected yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
