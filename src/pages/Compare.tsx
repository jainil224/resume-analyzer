import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreCircle } from "@/components/ScoreCircle";
import { SkillTag } from "@/components/SkillTag";
import { 
  Brain, 
  ArrowLeft, 
  Columns,
  Layers,
  TrendingUp,
  TrendingDown,
  Target,
  Briefcase,
  FileCheck,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Analysis {
  id: string;
  resume_name: string;
  job_title: string | null;
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
  created_at: string;
}

export default function Compare() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"side-by-side" | "diff">("side-by-side");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const ids = searchParams.get("ids")?.split(",") || [];
    if (ids.length !== 2) {
      toast.error("Please select exactly 2 analyses to compare");
      navigate("/history");
      return;
    }

    fetchAnalyses(ids);
  }, [user, navigate, searchParams]);

  const fetchAnalyses = async (ids: string[]) => {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .in("id", ids);

    if (error || !data || data.length !== 2) {
      toast.error("Failed to load analyses");
      navigate("/history");
    } else {
      setAnalyses(data);
    }
    setLoading(false);
  };

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

  const getUniqueSkills = (skills1: string[], skills2: string[]) => {
    const onlyIn1 = skills1.filter(s => !skills2.includes(s));
    const onlyIn2 = skills2.filter(s => !skills1.includes(s));
    const shared = skills1.filter(s => skills2.includes(s));
    return { onlyIn1, onlyIn2, shared };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const [a1, a2] = analyses;
  const matchedSkillsDiff = getUniqueSkills(a1.matched_skills, a2.matched_skills);
  const missingSkillsDiff = getUniqueSkills(a1.missing_skills, a2.missing_skills);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/history")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-accent-gradient rounded-lg">
                <Brain className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-bold text-lg">Compare Analyses</span>
            </div>
          </div>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "side-by-side" | "diff")}>
            <TabsList>
              <TabsTrigger value="side-by-side">
                <Columns className="w-4 h-4 mr-2" />
                Side by Side
              </TabsTrigger>
              <TabsTrigger value="diff">
                <Layers className="w-4 h-4 mr-2" />
                Diff View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {viewMode === "side-by-side" ? (
          <SideBySideView a1={a1} a2={a2} />
        ) : (
          <DiffView 
            a1={a1} 
            a2={a2} 
            matchedSkillsDiff={matchedSkillsDiff}
            missingSkillsDiff={missingSkillsDiff}
            getDiffIcon={getDiffIcon}
            getDiffText={getDiffText}
          />
        )}
      </main>
    </div>
  );
}

function SideBySideView({ a1, a2 }: { a1: Analysis; a2: Analysis }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {[a1, a2].map((analysis, idx) => (
        <motion.div
          key={analysis.id}
          initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="space-y-4"
        >
          {/* Header Card */}
          <Card variant="elevated" className="overflow-hidden">
            <div className="bg-hero p-6">
              <div className="flex items-center gap-4">
                <ScoreCircle score={analysis.overall_score} size="md" />
                <div>
                  <h3 className="font-bold text-primary-foreground text-lg">
                    {analysis.resume_name}
                  </h3>
                  {analysis.job_title && (
                    <p className="text-primary-foreground/80 text-sm">
                      {analysis.job_title}
                    </p>
                  )}
                  <p className="text-primary-foreground/60 text-xs mt-1">
                    {format(new Date(analysis.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Score Breakdown */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-base">Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { score: analysis.skills_match, label: "Skills", max: 40, icon: Target },
                  { score: analysis.experience_score, label: "Experience", max: 30, icon: Briefcase },
                  { score: analysis.ats_score, label: "ATS", max: 20, icon: FileCheck },
                  { score: analysis.formatting_score, label: "Format", max: 10, icon: Sparkles },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-accent" />
                    <span className="text-sm">{item.label}:</span>
                    <span className="font-semibold">{item.score}/{item.max}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Matched Skills */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-base text-success flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Matched Skills ({analysis.matched_skills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.matched_skills.map((skill) => (
                  <SkillTag key={skill} skill={skill} matched />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Missing Skills */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-base text-warning flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Missing Skills ({analysis.missing_skills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.missing_skills.map((skill) => (
                  <SkillTag key={skill} skill={skill} matched={false} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

interface DiffViewProps {
  a1: Analysis;
  a2: Analysis;
  matchedSkillsDiff: { onlyIn1: string[]; onlyIn2: string[]; shared: string[] };
  missingSkillsDiff: { onlyIn1: string[]; onlyIn2: string[]; shared: string[] };
  getDiffIcon: (v1: number, v2: number) => JSX.Element;
  getDiffText: (v1: number, v2: number) => string;
}

function DiffView({ a1, a2, matchedSkillsDiff, missingSkillsDiff, getDiffIcon, getDiffText }: DiffViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Overall Comparison */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Overall Score Comparison</CardTitle>
          <CardDescription>
            {a1.resume_name} vs {a2.resume_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <ScoreCircle score={a1.overall_score} size="md" />
              <p className="text-sm text-muted-foreground mt-2">Analysis 1</p>
            </div>
            <div className="flex flex-col items-center">
              {getDiffIcon(a1.overall_score, a2.overall_score)}
              <span className="text-lg font-bold">
                {getDiffText(a1.overall_score, a2.overall_score)}
              </span>
            </div>
            <div className="text-center">
              <ScoreCircle score={a2.overall_score} size="md" />
              <p className="text-sm text-muted-foreground mt-2">Analysis 2</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown Diff */}
      <Card variant="default">
        <CardHeader>
          <CardTitle>Score Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Skills Match", v1: a1.skills_match, v2: a2.skills_match, max: 40, icon: Target },
              { label: "Experience", v1: a1.experience_score, v2: a2.experience_score, max: 30, icon: Briefcase },
              { label: "ATS Score", v1: a1.ats_score, v2: a2.ats_score, max: 20, icon: FileCheck },
              { label: "Formatting", v1: a1.formatting_score, v2: a2.formatting_score, max: 10, icon: Sparkles },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-accent" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">{item.v1}/{item.max}</span>
                  <div className="flex items-center gap-1">
                    {getDiffIcon(item.v1, item.v2)}
                    <span className={`font-semibold ${
                      item.v2 > item.v1 ? "text-success" : 
                      item.v2 < item.v1 ? "text-destructive" : 
                      "text-muted-foreground"
                    }`}>
                      {getDiffText(item.v1, item.v2)}
                    </span>
                  </div>
                  <span className="font-medium">{item.v2}/{item.max}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Diff */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-success">Matched Skills Changes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {matchedSkillsDiff.onlyIn2.length > 0 && (
            <div>
              <p className="text-sm text-success mb-2">+ New in Analysis 2:</p>
              <div className="flex flex-wrap gap-2">
                {matchedSkillsDiff.onlyIn2.map((skill) => (
                  <Badge key={skill} variant="success">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          {matchedSkillsDiff.onlyIn1.length > 0 && (
            <div>
              <p className="text-sm text-destructive mb-2">- Removed from Analysis 1:</p>
              <div className="flex flex-wrap gap-2">
                {matchedSkillsDiff.onlyIn1.map((skill) => (
                  <Badge key={skill} variant="destructive">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          {matchedSkillsDiff.shared.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">= Shared:</p>
              <div className="flex flex-wrap gap-2">
                {matchedSkillsDiff.shared.map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Missing Skills Diff */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-warning">Missing Skills Changes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {missingSkillsDiff.onlyIn1.length > 0 && (
            <div>
              <p className="text-sm text-success mb-2">+ Fixed (no longer missing in Analysis 2):</p>
              <div className="flex flex-wrap gap-2">
                {missingSkillsDiff.onlyIn1.map((skill) => (
                  <Badge key={skill} variant="success">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          {missingSkillsDiff.onlyIn2.length > 0 && (
            <div>
              <p className="text-sm text-destructive mb-2">- New gaps in Analysis 2:</p>
              <div className="flex flex-wrap gap-2">
                {missingSkillsDiff.onlyIn2.map((skill) => (
                  <Badge key={skill} variant="destructive">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          {missingSkillsDiff.shared.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">= Still missing:</p>
              <div className="flex flex-wrap gap-2">
                {missingSkillsDiff.shared.map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
