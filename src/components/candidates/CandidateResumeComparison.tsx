import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreCircle } from "@/components/ScoreCircle";
import { 
  X,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Target,
  Briefcase,
  FileCheck,
  Sparkles,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { format } from "date-fns";

interface CandidateResume {
  id: string;
  version: number;
  resume_name: string;
  overall_score: number;
  skills_match: number;
  experience_score: number;
  education_score: number;
  ats_score: number;
  formatting_score: number;
  grammar_score: number;
  matched_skills: string[];
  missing_skills: string[];
  created_at: string;
}

interface CandidateResumeComparisonProps {
  resumes: CandidateResume[];
  onClose: () => void;
}

export function CandidateResumeComparison({ resumes, onClose }: CandidateResumeComparisonProps) {
  if (resumes.length !== 2) return null;

  const [older, newer] = resumes.sort((a, b) => a.version - b.version);

  const getDiffIcon = (value1: number, value2: number) => {
    const diff = value2 - value1;
    if (diff > 0) return <ArrowUpRight className="w-4 h-4 text-success" />;
    if (diff < 0) return <ArrowDownRight className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getDiffText = (value1: number, value2: number) => {
    const diff = value2 - value1;
    if (diff > 0) return `+${diff}`;
    if (diff < 0) return `${diff}`;
    return "0";
  };

  const getDiffColor = (value1: number, value2: number) => {
    const diff = value2 - value1;
    if (diff > 0) return "text-success";
    if (diff < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  const scoreItems = [
    { label: "Skills Match", v1: older.skills_match, v2: newer.skills_match, icon: Target },
    { label: "Experience", v1: older.experience_score, v2: newer.experience_score, icon: Briefcase },
    { label: "Education", v1: older.education_score, v2: newer.education_score, icon: BookOpen },
    { label: "ATS Score", v1: older.ats_score, v2: newer.ats_score, icon: FileCheck },
    { label: "Formatting", v1: older.formatting_score, v2: newer.formatting_score, icon: Sparkles },
    { label: "Grammar", v1: older.grammar_score, v2: newer.grammar_score, icon: Award },
  ];

  const getSkillsDiff = () => {
    const newlyMatched = newer.matched_skills.filter(s => !older.matched_skills.includes(s) && older.missing_skills.includes(s));
    const stillMissing = newer.missing_skills.filter(s => older.missing_skills.includes(s));
    const newMissing = newer.missing_skills.filter(s => !older.missing_skills.includes(s));
    return { newlyMatched, stillMissing, newMissing };
  };

  const skillsDiff = getSkillsDiff();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="overflow-hidden">
        <div className="bg-hero p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary-foreground">Resume Comparison</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <ScoreCircle score={older.overall_score} size="md" />
              <p className="text-sm text-primary-foreground/80 mt-2">Version {older.version}</p>
              <p className="text-xs text-primary-foreground/60">
                {format(new Date(older.created_at), "MMM d, yyyy")}
              </p>
            </div>
            <div className="flex flex-col items-center">
              {getDiffIcon(older.overall_score, newer.overall_score)}
              <span className={`text-2xl font-bold ${getDiffColor(older.overall_score, newer.overall_score)}`}>
                {getDiffText(older.overall_score, newer.overall_score)}
              </span>
              <span className="text-xs text-primary-foreground/60">points</span>
            </div>
            <div className="text-center">
              <ScoreCircle score={newer.overall_score} size="md" />
              <p className="text-sm text-primary-foreground/80 mt-2">Version {newer.version}</p>
              <p className="text-xs text-primary-foreground/60">
                {format(new Date(newer.created_at), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score Changes</CardTitle>
          <CardDescription>Comparing Version {older.version} to Version {newer.version}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scoreItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-accent" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground text-sm">{item.v1}%</span>
                  <div className="flex items-center gap-1 min-w-16 justify-center">
                    {getDiffIcon(item.v1, item.v2)}
                    <span className={`font-semibold text-sm ${getDiffColor(item.v1, item.v2)}`}>
                      {getDiffText(item.v1, item.v2)}
                    </span>
                  </div>
                  <span className="font-medium text-sm">{item.v2}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skills Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {skillsDiff.newlyMatched.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <p className="text-sm font-medium text-success">
                  Newly Matched Skills ({skillsDiff.newlyMatched.length})
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillsDiff.newlyMatched.map((skill) => (
                  <Badge key={skill} variant="success">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {skillsDiff.stillMissing.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-warning" />
                <p className="text-sm font-medium text-warning">
                  Still Missing ({skillsDiff.stillMissing.length})
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillsDiff.stillMissing.map((skill) => (
                  <Badge key={skill} variant="outline" className="border-warning/50 text-warning">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {skillsDiff.newMissing.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-destructive" />
                <p className="text-sm font-medium text-destructive">
                  New Gaps ({skillsDiff.newMissing.length})
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillsDiff.newMissing.map((skill) => (
                  <Badge key={skill} variant="destructive">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {skillsDiff.newlyMatched.length === 0 && skillsDiff.stillMissing.length === 0 && skillsDiff.newMissing.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No significant skill changes between versions</p>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="text-sm text-muted-foreground">
            {newer.overall_score > older.overall_score 
              ? `Great progress! The candidate improved their overall score by ${newer.overall_score - older.overall_score} points from Version ${older.version} to Version ${newer.version}.`
              : newer.overall_score < older.overall_score
              ? `The overall score decreased by ${older.overall_score - newer.overall_score} points. Review the changes to understand what went wrong.`
              : `The overall score remained the same between versions.`}
            {skillsDiff.newlyMatched.length > 0 && ` ${skillsDiff.newlyMatched.length} new skills were matched.`}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
