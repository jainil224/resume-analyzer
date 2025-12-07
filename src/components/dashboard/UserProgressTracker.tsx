import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User, FileText, TrendingUp, Award } from "lucide-react";

interface UserProgressTrackerProps {
  profileCompletion: number;
  resumeStrength: number;
  skillsImprovement: number;
}

export function UserProgressTracker({
  profileCompletion,
  resumeStrength,
  skillsImprovement,
}: UserProgressTrackerProps) {
  const progressItems = [
    {
      label: "Profile Completion",
      value: profileCompletion,
      icon: User,
      color: "text-blue-500",
      progressColor: "bg-blue-500",
    },
    {
      label: "Resume Strength",
      value: resumeStrength,
      icon: FileText,
      color: "text-purple-500",
      progressColor: "bg-purple-500",
    },
    {
      label: "Skills Improvement",
      value: skillsImprovement,
      icon: TrendingUp,
      color: "text-green-500",
      progressColor: "bg-green-500",
    },
  ];

  const overallLevel = Math.round((profileCompletion + resumeStrength + skillsImprovement) / 3);
  const level = overallLevel >= 80 ? "Expert" : overallLevel >= 60 ? "Advanced" : overallLevel >= 40 ? "Intermediate" : "Beginner";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-warning" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-2">
              <span className="text-2xl font-bold text-white">{overallLevel}%</span>
            </div>
            <p className="text-sm font-medium">{level} Level</p>
          </div>
          <div className="space-y-4">
            {progressItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
