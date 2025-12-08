import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Target,
  Briefcase,
  BookOpen,
  FileCheck,
  Sparkles,
  Award,
  CheckCircle,
  XCircle
} from "lucide-react";

interface CandidateResume {
  overall_score: number;
  skills_match: number;
  experience_score: number;
  education_score: number;
  ats_score: number;
  formatting_score: number;
  grammar_score: number;
  matched_skills: string[];
  missing_skills: string[];
}

interface ATSScoreBreakdownProps {
  resume: CandidateResume;
}

export function ATSScoreBreakdown({ resume }: ATSScoreBreakdownProps) {
  const scoreItems = [
    { 
      label: "Skills Match", 
      value: resume.skills_match, 
      max: 100, 
      icon: Target,
      description: "How well the candidate's skills match the job requirements",
      color: "primary"
    },
    { 
      label: "Experience Score", 
      value: resume.experience_score, 
      max: 100, 
      icon: Briefcase,
      description: "Relevance and quality of work experience",
      color: "accent"
    },
    { 
      label: "Education Score", 
      value: resume.education_score, 
      max: 100, 
      icon: BookOpen,
      description: "Educational qualifications and relevance",
      color: "success"
    },
    { 
      label: "ATS Compatibility", 
      value: resume.ats_score, 
      max: 100, 
      icon: FileCheck,
      description: "How well the resume is optimized for ATS systems",
      color: "warning"
    },
    { 
      label: "Formatting Score", 
      value: resume.formatting_score, 
      max: 100, 
      icon: Sparkles,
      description: "Resume structure, layout, and readability",
      color: "primary"
    },
    { 
      label: "Grammar Score", 
      value: resume.grammar_score, 
      max: 100, 
      icon: Award,
      description: "Writing quality and grammatical correctness",
      color: "accent"
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-card-gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Overall ATS Score</h3>
                <p className="text-sm text-muted-foreground">
                  Combined score across all evaluation criteria
                </p>
              </div>
              <div className={`text-4xl font-bold ${getScoreColor(resume.overall_score)}`}>
                {resume.overall_score}%
              </div>
            </div>
            <div className="mt-4">
              <Progress value={resume.overall_score} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score Breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        {scoreItems.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${item.color}/10`}>
                    <item.icon className={`w-5 h-5 text-${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{item.label}</span>
                      <span className={`font-bold ${getScoreColor(item.value)}`}>
                        {item.value}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                    <div className="relative">
                      <Progress value={item.value} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Keywords Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Keywords Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="font-medium text-success">Keywords Present ({resume.matched_skills.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.matched_skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-2 py-1 text-xs bg-success/10 text-success rounded-full border border-success/20"
                    >
                      {skill}
                    </span>
                  ))}
                  {resume.matched_skills.length === 0 && (
                    <span className="text-sm text-muted-foreground">No matching keywords found</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-4 h-4 text-destructive" />
                  <span className="font-medium text-destructive">Keywords Missing ({resume.missing_skills.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.missing_skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded-full border border-destructive/20"
                    >
                      {skill}
                    </span>
                  ))}
                  {resume.missing_skills.length === 0 && (
                    <span className="text-sm text-muted-foreground">All expected keywords are present</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score Interpretation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Score Interpretation</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span>80-100: Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span>60-79: Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span>0-59: Needs Work</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
