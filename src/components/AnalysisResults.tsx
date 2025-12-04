import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreCircle } from "./ScoreCircle";
import { SkillTag } from "./SkillTag";
import { SuggestionCard } from "./SuggestionCard";
import { 
  Target, 
  Briefcase, 
  FileCheck, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Zap
} from "lucide-react";

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

export function AnalysisResults({ data }: AnalysisResultsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Main Score Section */}
      <motion.div variants={itemVariants}>
        <Card variant="elevated" className="overflow-hidden">
          <div className="bg-hero p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ScoreCircle
                score={data.overall_score}
                size="lg"
                label="Overall Score"
                className="text-primary-foreground"
              />
              <div className="flex-1 text-center md:text-left">
                <Badge variant="ai" className="mb-3">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Powered Analysis
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                  {data.overall_score >= 80
                    ? "Excellent Match!"
                    : data.overall_score >= 60
                    ? "Good Potential"
                    : data.overall_score >= 40
                    ? "Needs Improvement"
                    : "Significant Changes Needed"}
                </h2>
                <p className="text-primary-foreground/80 max-w-md">
                  Your resume has been analyzed against the job description. Review the insights below to improve your chances.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { score: data.skills_match, label: "Skills Match", icon: Target, max: 40 },
            { score: data.experience_score, label: "Experience", icon: Briefcase, max: 30 },
            { score: data.ats_score, label: "ATS Score", icon: FileCheck, max: 20 },
            { score: data.formatting_score, label: "Formatting", icon: Sparkles, max: 10 },
          ].map((item, index) => (
            <Card key={item.label} variant="glass" className="p-4">
              <div className="flex flex-col items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <ScoreCircle
                  score={item.score}
                  maxScore={item.max}
                  size="sm"
                  showPercentage={true}
                />
                <span className="text-xs font-medium text-muted-foreground text-center">
                  {item.label}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Skills Section */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <TrendingUp className="w-5 h-5" />
              Matched Skills
            </CardTitle>
            <CardDescription>
              Skills from your resume that match the job requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.matched_skills.map((skill) => (
                <SkillTag key={skill} skill={skill} matched={true} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <TrendingDown className="w-5 h-5" />
              Missing Skills
            </CardTitle>
            <CardDescription>
              Skills required by the job that are not in your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.missing_skills.map((skill) => (
                <SkillTag key={skill} skill={skill} matched={false} />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Strengths & Weaknesses */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-success">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-success mt-1">✓</span>
                  {strength}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-warning">Areas to Improve</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.weaknesses.map((weakness, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-warning mt-1">!</span>
                  {weakness}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Suggestions */}
      <motion.div variants={itemVariants}>
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI-Powered Suggestions
            </CardTitle>
            <CardDescription>
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
    </motion.div>
  );
}
