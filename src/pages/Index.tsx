import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Sparkles, Zap, Target, TrendingUp, Shield, ArrowRight, FileText, Brain, History, LogIn, LogOut } from "lucide-react";
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

export default function Index() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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
        toast.success("Analysis saved to your history!");
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-accent-gradient rounded-lg">
              <Brain className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-bold text-lg">ResumeAI</span>
            <Badge variant="ai" className="hidden sm:flex"><Zap className="w-3 h-3 mr-1" />AI Powered</Badge>
          </div>
          <div className="flex items-center gap-2">
            {user && <Button variant="ghost" onClick={() => navigate("/history")}><History className="w-4 h-4 mr-2" /><span className="hidden sm:inline">History</span></Button>}
            {analysisResults && <Button variant="outline" onClick={handleReset}>New Analysis</Button>}
            {!authLoading && (user ? <Button variant="ghost" onClick={() => signOut()}><LogOut className="w-4 h-4 mr-2" /><span className="hidden sm:inline">Sign Out</span></Button> : <Button variant="outline" onClick={() => navigate("/auth")}><LogIn className="w-4 h-4 mr-2" />Sign In</Button>)}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {!analysisResults && !isAnalyzing && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <Badge variant="ai" className="mb-4"><Sparkles className="w-3 h-3 mr-1" />Powered by Gemini AI</Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">AI Resume<span className="text-gradient"> Analyzer</span></h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Get instant AI-powered feedback on your resume. Optimize for ATS, match skills to job requirements, and land more interviews.</p>
                  {!user && <p className="text-sm text-muted-foreground mt-2"><button onClick={() => navigate("/auth")} className="text-accent hover:underline">Sign in</button> to save your analysis history and compare resumes.</p>}
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid md:grid-cols-3 gap-4 mb-12">
                {[{ icon: Target, title: "Skill Matching", desc: "AI identifies matching & missing skills" }, { icon: Shield, title: "ATS Optimized", desc: "Beat applicant tracking systems" }, { icon: TrendingUp, title: "Smart Suggestions", desc: "Personalized improvement tips" }].map((feature) => (
                  <Card key={feature.title} variant="glass" className="p-4 text-center"><div className="inline-flex p-3 bg-accent/10 rounded-xl mb-3"><feature.icon className="w-6 h-6 text-accent" /></div><h3 className="font-semibold mb-1">{feature.title}</h3><p className="text-sm text-muted-foreground">{feature.desc}</p></Card>
                ))}
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <Card variant="default"><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-accent" />Your Resume</CardTitle><CardDescription>Upload a file or paste your resume text</CardDescription></CardHeader><CardContent className="space-y-4"><FileUpload onFileSelect={setResumeFile} /><div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or paste text</span></div></div><Textarea placeholder="Paste your resume content here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} className="min-h-[120px] resize-none" /></CardContent></Card>
                <Card variant="default"><CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-accent" />Job Description</CardTitle><CardDescription>Paste the job description you're applying for</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label htmlFor="jobTitle">Job Title (optional)</Label><Input id="jobTitle" placeholder="e.g., Senior Frontend Developer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="jobDesc">Job Description</Label><Textarea id="jobDesc" placeholder="Paste the job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="min-h-[180px] resize-none" /></div></CardContent></Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center mt-8">
                <Button variant="hero" size="xl" onClick={handleAnalyze} disabled={(!resumeFile && !resumeText.trim()) || !jobDescription.trim()}><Sparkles className="w-5 h-5" />Analyze with AI<ArrowRight className="w-5 h-5" /></Button>
                <p className="text-xs text-muted-foreground mt-3">{user ? "Analysis will be saved to your history" : "Free analysis • Sign in to save history"}</p>
              </motion.div>
            </motion.div>
          )}
          {isAnalyzing && <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Card variant="elevated" className="max-w-lg mx-auto"><LoadingAnalysis currentStep={analysisStep} /></Card></motion.div>}
          {analysisResults && !isAnalyzing && <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto"><AnalysisResults data={analysisResults} /></motion.div>}
        </AnimatePresence>
      </main>
      <footer className="border-t border-border/50 py-6 mt-12"><div className="container mx-auto px-4 text-center text-sm text-muted-foreground"><p>AI Resume Analyzer • Powered by Gemini Flash</p></div></footer>
    </div>
  );
}
