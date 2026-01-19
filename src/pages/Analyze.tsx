import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { useAuth } from "@/hooks/useAuth";
import { useAnalyzing } from "@/contexts/AnalyzingContext";
import { supabase } from "@/integrations/supabase/client";
import { saveLocalCandidate, LocalCandidate } from "@/hooks/useLocalCandidates";
import { Sparkles, ArrowRight, FileText, Target } from "lucide-react";
import { toast } from "sonner";
import TrueFocus from "@/components/TrueFocus";

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

export default function Analyze() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLocalAnalyzing, setIsLocalAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);
  const { user } = useAuth();
  const { setIsAnalyzing } = useAnalyzing();

  // Sync local analyzing state with global context
  useEffect(() => {
    setIsAnalyzing(isLocalAnalyzing);
  }, [isLocalAnalyzing, setIsAnalyzing]);

  const handleAnalyze = async () => {
    if (!resumeFile && !resumeText.trim()) {
      toast.error("Please upload your resume or paste its content");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setIsLocalAnalyzing(true);
    setAnalysisStep(0);

    try {
      let textToAnalyze = resumeText.trim() || `Resume: ${resumeFile?.name}`;

      for (let i = 0; i < 4; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAnalysisStep(i + 1);
      }

      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText: textToAnalyze, jobDescription: jobDescription.trim() },
      });

      if (error) throw new Error(error.message || "Analysis failed");

      const results = data as AnalysisData;
      setAnalysisResults(results);

      if (user) {
        // Save to analyses table for history
        await supabase.from("analyses").insert({
          user_id: user.id,
          resume_name: resumeFile?.name || "Pasted Resume",
          job_title: jobTitle.trim() || null,
          job_description: jobDescription.trim(),
          overall_score: results.overall_score,
          skills_match: results.skills_match,
          experience_score: results.experience_score,
          ats_score: results.ats_score,
          formatting_score: results.formatting_score,
          matched_skills: results.matched_skills,
          missing_skills: results.missing_skills,
          strengths: results.strengths,
          weaknesses: results.weaknesses,
          ai_suggestions: results.ai_suggestions,
        });

        // Extract candidate name from resume text or use file name
        const resumeName = resumeFile?.name?.replace(/\.[^/.]+$/, "") || "Unknown Candidate";
        
        // Create a new candidate entry
        const { data: candidateData, error: candidateError } = await supabase
          .from("candidates")
          .insert({
            user_id: user.id,
            name: resumeName,
            email: `${resumeName.toLowerCase().replace(/\s+/g, '.')}@pending.com`,
            applied_role: jobTitle.trim() || "Not Specified",
            status: "pending",
          })
          .select()
          .single();

        if (!candidateError && candidateData) {
          // Create candidate resume with analysis results
          await supabase.from("candidate_resumes").insert({
            candidate_id: candidateData.id,
            user_id: user.id,
            resume_name: resumeFile?.name || "Pasted Resume",
            resume_text: textToAnalyze,
            job_description: jobDescription.trim(),
            overall_score: results.overall_score,
            skills_match: results.skills_match,
            experience_score: results.experience_score,
            education_score: 0,
            ats_score: results.ats_score,
            formatting_score: results.formatting_score,
            grammar_score: 0,
            matched_skills: results.matched_skills,
            missing_skills: results.missing_skills,
            strengths: results.strengths,
            weaknesses: results.weaknesses,
            ai_suggestions: results.ai_suggestions,
            analysis_status: "completed",
            version: 1,
          });
          toast.success("Analysis saved! Candidate added to your candidates list.");
        } else {
          toast.success("Analysis saved to your history!");
        }
      } else {
        // Save to local storage for guests
        const resumeName = resumeFile?.name?.replace(/\.[^/.]+$/, "") || "Unknown Candidate";
        const localCandidate: LocalCandidate = {
          id: `local-${Date.now()}`,
          name: resumeName,
          email: `${resumeName.toLowerCase().replace(/\s+/g, '.')}@pending.com`,
          phone: null,
          applied_role: jobTitle.trim() || "Not Specified",
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          education: null,
          experience_years: 0,
          profile_picture_url: null,
          interview_date: null,
          interview_status: "not_scheduled",
          latestScore: results.overall_score,
          analysisStatus: "completed",
          matchedSkills: results.matched_skills,
          missingSkills: results.missing_skills,
          resumeText: textToAnalyze,
          jobDescription: jobDescription.trim(),
          strengths: results.strengths,
          weaknesses: results.weaknesses,
          aiSuggestions: results.ai_suggestions,
        };
        saveLocalCandidate(localCandidate);
        toast.success("Analysis complete! Candidate added to your local list.");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setIsLocalAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResumeFile(null);
    setResumeText("");
    setJobTitle("");
    setJobDescription("");
    setAnalysisResults(null);
    setAnalysisStep(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 relative">
        <AnimatePresence mode="wait">
          {!analysisResults && !isLocalAnalyzing && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <Badge variant="ai" className="mb-4">
                    <Sparkles className="w-3 h-3 mr-1" />Resume Analyzer
                  </Badge>
                  <div className="mb-4">
                    <TrueFocus
                      sentence="Analyze Your Resume"
                      manualMode={false}
                      blurAmount={4}
                      borderColor="hsl(var(--primary))"
                      glowColor="hsl(var(--primary) / 0.5)"
                      animationDuration={0.5}
                      pauseBetweenAnimations={1.5}
                    />
                  </div>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Upload your resume and job description to get instant AI-powered feedback.
                  </p>
                </motion.div>
              </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto"
            >
              <Card variant="gradient-underline" className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    Your Resume
                  </CardTitle>
                  <CardDescription>Upload a file or paste your resume text</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FileUpload onFileSelect={setResumeFile} />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground font-medium">Or paste text</span>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="min-h-[120px] resize-none focus:ring-2 focus:ring-accent/20"
                  />
                </CardContent>
              </Card>

              <Card variant="gradient-underline" className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-5 h-5 text-accent" />
                    </div>
                    Job Description
                  </CardTitle>
                  <CardDescription>Paste the job description you're applying for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title (optional)</Label>
                    <Input
                      id="jobTitle"
                      placeholder="e.g., Senior Frontend Developer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobDesc" className="text-sm font-medium">Job Description</Label>
                    <Textarea
                      id="jobDesc"
                      placeholder="Paste the job description here..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="min-h-[180px] resize-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mt-10"
            >
              <Button
                variant="hero"
                size="xl"
                onClick={handleAnalyze}
                disabled={(!resumeFile && !resumeText.trim()) || !jobDescription.trim()}
              >
                <Sparkles className="w-5 h-5" />
                Analyze with AI
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                {user ? "✓ Analysis will be saved to your history" : "✓ Free analysis • No account required"}
              </p>
              <p className="text-xs text-muted-foreground mt-8 pt-4 border-t border-border/50">
                Made with ❤️ by Jainil Patel
              </p>
            </motion.div>
          </motion.div>
        )}

        {isLocalAnalyzing && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card variant="elevated" className="max-w-lg mx-auto shadow-xl">
              <LoadingAnalysis currentStep={analysisStep} />
            </Card>
          </motion.div>
        )}

        {analysisResults && !isLocalAnalyzing && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <Button variant="outline" onClick={handleReset} className="gap-2 hover:bg-secondary">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Analyze Another Resume
              </Button>
            </div>
            <AnalysisResults data={analysisResults} jobTitle={jobTitle} />
          </motion.div>
        )}
        </AnimatePresence>
      </div>
  );
}
