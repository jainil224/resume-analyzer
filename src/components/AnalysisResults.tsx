import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreCircle } from "./ScoreCircle";
import { SkillTag } from "./SkillTag";
import { SuggestionCard } from "./SuggestionCard";
import { ShareButtons } from "./ShareButtons";
import { DownloadHistory } from "./DownloadHistory";
import { generateAnalysisPDF } from "@/utils/pdfExport";
import { useState } from "react";
import { 
  Target, 
  Briefcase, 
  FileCheck, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface AnalysisData {
  overall_score: number;
  skills_match: number;
  experience_score: number;
  ats_score: number;
  formatting_score: number;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  ai_suggestions: string[];
}

interface AnalysisResultsProps {
  data: AnalysisData;
  jobTitle?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AnalysisResults({ data, jobTitle }: AnalysisResultsProps) {
  const [historyKey, setHistoryKey] = useState(0);
  
  const getScoreMessage = () => {
    if (data.overall_score >= 80) return { title: "Excellent Match!", color: "text-success" };
    if (data.overall_score >= 60) return { title: "Good Potential", color: "text-success" };
    if (data.overall_score >= 40) return { title: "Needs Improvement", color: "text-warning" };
    return { title: "Significant Changes Needed", color: "text-destructive" };
  };

  const scoreMessage = getScoreMessage();

  const handleExportPDF = () => {
    try {
      generateAnalysisPDF(data, jobTitle);
      toast.success("PDF report downloaded successfully!");
      // Refresh history component
      setHistoryKey(prev => prev + 1);
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Export & Share Actions */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <ShareButtons 
          score={data.overall_score} 
          onExportPDF={handleExportPDF}
          showExport={true}
        />
      </motion.div>
      {/* Main Score Hero Section */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="bg-hero p-6 md:p-10 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              {/* Score Circle */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl scale-110" />
                <ScoreCircle
                  score={data.overall_score}
                  size="lg"
                  label="Overall Score"
                  variant="hero"
                />
              </div>
              
              {/* Score Info */}
              <div className="flex-1 text-center md:text-left">
                <Badge variant="ai" className="mb-4 backdrop-blur-sm">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Powered Analysis
                </Badge>
                <h2 className={`text-3xl md:text-4xl font-bold text-primary-foreground mb-3 ${scoreMessage.color === 'text-success' ? '' : ''}`}>
                  <span className="text-success">{scoreMessage.title}</span>
                </h2>
                <p className="text-primary-foreground/80 max-w-lg text-base md:text-lg leading-relaxed">
                  Your resume has been analyzed against the job description. 
                  Review the insights below to improve your chances.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Score Breakdown Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { score: data.skills_match, label: "Skills Match", icon: Target, max: 40, color: "text-success" },
            { score: data.experience_score, label: "Experience", icon: Briefcase, max: 30, color: "text-foreground" },
            { score: data.ats_score, label: "ATS Score", icon: FileCheck, max: 20, color: "text-accent" },
            { score: data.formatting_score, label: "Formatting", icon: Sparkles, max: 10, color: "text-success" },
          ].map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card variant="gradient-underline" className="p-5 h-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 bg-secondary rounded-xl">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <ScoreCircle
                    score={item.score}
                    maxScore={item.max}
                    size="sm"
                    showPercentage={true}
                  />
                  <span className="text-sm font-medium text-muted-foreground text-center">
                    {item.label}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Skills Section */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
        <Card variant="gradient-underline" className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-success text-xl">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              Matched Skills
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Skills from your resume that match the job requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2.5">
              {data.matched_skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SkillTag skill={skill} matched={true} />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="gradient-underline" className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-warning text-xl">
              <div className="p-2 bg-warning/10 rounded-lg">
                <TrendingDown className="w-5 h-5" />
              </div>
              Missing Skills
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Skills required by the job that are not in your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2.5">
              {data.missing_skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SkillTag skill={skill} matched={false} />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Strengths & Weaknesses */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
        <Card variant="gradient-underline">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-success text-xl">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 text-sm p-3 bg-success/5 rounded-lg border border-success/10"
                >
                  <span className="text-success font-bold mt-0.5">✓</span>
                  <span className="text-foreground leading-relaxed">{strength}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card variant="gradient-underline">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-warning text-xl">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </div>
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.weaknesses.map((weakness, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 text-sm p-3 bg-warning/5 rounded-lg border border-warning/10"
                >
                  <span className="text-warning font-bold mt-0.5">!</span>
                  <span className="text-foreground leading-relaxed">{weakness}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Suggestions */}
      <motion.div variants={itemVariants}>
        <Card variant="gradient-underline">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              AI-Powered Suggestions
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Personalized recommendations to improve your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.ai_suggestions.map((suggestion, index) => (
                <SuggestionCard
                  key={index}
                  suggestion={suggestion}
                  index={index}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Download History */}
      <motion.div variants={itemVariants}>
        <DownloadHistory key={historyKey} />
      </motion.div>
    </motion.div>
  );
}
