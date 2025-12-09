import { useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowRight, FileText, Target } from "lucide-react";
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

export default function Analyze() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);
  const { user } = useAuth();

  const handleAnalyze = async () => {
    if (!resumeFile && !resumeText.trim()) {
      toast.error("Please upload your resume or paste its content");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setIsAnalyzing(true);
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
        toast.success("Analysis complete!");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
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
    <div className="container mx-auto px-4 py-8 md:py-12">
      <AnimatePresence mode="wait">
        {!analysisResults && !isAnalyzing && (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center mb-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Badge variant="ai" className="mb-4">
                  <Sparkles className="w-3 h-3 mr-1" />Resume Analyzer
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                  Analyze Your <span className="text-gradient">Resume</span>
                </h1>
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
              <Card variant="default">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />Your Resume
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
                      <span className="bg-card px-2 text-muted-foreground">Or paste text</span>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card variant="default">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />Job Description
                  </CardTitle>
                  <CardDescription>Paste the job description you're applying for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title (optional)</Label>
                    <Input
                      id="jobTitle"
                      placeholder="e.g., Senior Frontend Developer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobDesc">Job Description</Label>
                    <Textarea
                      id="jobDesc"
                      placeholder="Paste the job description here..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="min-h-[180px] resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mt-8"
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
              <p className="text-xs text-muted-foreground mt-3">
                {user ? "Analysis will be saved to your history" : "Free analysis • Sign in to save history"}
              </p>
            </motion.div>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card variant="elevated" className="max-w-lg mx-auto">
              <LoadingAnalysis currentStep={analysisStep} />
            </Card>
          </motion.div>
        )}

        {analysisResults && !isAnalyzing && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto">
            <div className="mb-6 text-center">
              <Button variant="outline" onClick={handleReset}>
                Analyze Another Resume
              </Button>
            </div>
            <AnalysisResults data={analysisResults} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
