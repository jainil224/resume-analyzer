import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { 
  Sparkles, 
  Zap, 
  Target, 
  TrendingUp, 
  Shield,
  ArrowRight,
  FileText,
  Brain
} from "lucide-react";
import { toast } from "sonner";

// Mock analysis data - will be replaced with actual AI response
const mockAnalysisData = {
  overall_score: 78,
  skills_match: 32,
  experience_score: 24,
  ats_score: 15,
  formatting_score: 7,
  matched_skills: [
    "React", "TypeScript", "JavaScript", "Node.js", "Git", 
    "REST APIs", "Agile", "Problem Solving"
  ],
  missing_skills: [
    "GraphQL", "AWS", "Docker", "Kubernetes", "CI/CD"
  ],
  strengths: [
    "Strong frontend development experience with modern frameworks",
    "Good understanding of software development lifecycle",
    "Clear and organized resume structure",
    "Relevant project experience demonstrated"
  ],
  weaknesses: [
    "Missing cloud infrastructure experience (AWS/GCP)",
    "No mention of containerization technologies",
    "Could add more quantifiable achievements",
    "Leadership experience not highlighted"
  ],
  ai_suggestions: [
    "Add specific metrics to your achievements (e.g., 'Improved page load time by 40%')",
    "Include any experience with cloud services, even if from personal projects",
    "Add a 'Technical Skills' section with proficiency levels",
    "Mention any experience with CI/CD pipelines or DevOps practices",
    "Consider adding a brief professional summary at the top",
    "Include relevant certifications or ongoing learning initiatives"
  ]
};

export default function Index() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<typeof mockAnalysisData | null>(null);

  const handleAnalyze = async () => {
    if (!resumeFile) {
      toast.error("Please upload your resume first");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Simulate AI analysis steps
    const steps = [0, 1, 2, 3];
    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setAnalysisStep(step + 1);
    }

    // Simulate final result
    await new Promise((resolve) => setTimeout(resolve, 800));
    setAnalysisResults(mockAnalysisData);
    setIsAnalyzing(false);
    toast.success("Analysis complete!");
  };

  const handleReset = () => {
    setResumeFile(null);
    setJobDescription("");
    setAnalysisResults(null);
    setAnalysisStep(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-accent-gradient rounded-lg">
              <Brain className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-bold text-lg">ResumeAI</span>
            <Badge variant="ai" className="hidden sm:flex">
              <Zap className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
          {analysisResults && (
            <Button variant="outline" onClick={handleReset}>
              New Analysis
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {!analysisResults && !isAnalyzing && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge variant="ai" className="mb-4">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Powered by Gemini AI
                  </Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                    AI Resume
                    <span className="text-gradient"> Analyzer</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Get instant AI-powered feedback on your resume. Optimize for ATS, 
                    match skills to job requirements, and land more interviews.
                  </p>
                </motion.div>
              </div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid md:grid-cols-3 gap-4 mb-12"
              >
                {[
                  { icon: Target, title: "Skill Matching", desc: "AI identifies matching & missing skills" },
                  { icon: Shield, title: "ATS Optimized", desc: "Beat applicant tracking systems" },
                  { icon: TrendingUp, title: "Smart Suggestions", desc: "Personalized improvement tips" },
                ].map((feature, index) => (
                  <Card key={feature.title} variant="glass" className="p-4 text-center">
                    <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-3">
                      <feature.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </Card>
                ))}
              </motion.div>

              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto"
              >
                {/* Resume Upload */}
                <Card variant="default">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      Upload Resume
                    </CardTitle>
                    <CardDescription>
                      Upload your resume in PDF or DOCX format
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload onFileSelect={setResumeFile} />
                  </CardContent>
                </Card>

                {/* Job Description */}
                <Card variant="default">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-accent" />
                      Job Description
                    </CardTitle>
                    <CardDescription>
                      Paste the job description you're applying for
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Paste the job description here..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="min-h-[180px] resize-none"
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Analyze Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center mt-8"
              >
                <Button
                  variant="hero"
                  size="xl"
                  onClick={handleAnalyze}
                  disabled={!resumeFile || !jobDescription.trim()}
                >
                  <Sparkles className="w-5 h-5" />
                  Analyze with AI
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Free analysis • No sign-up required
                </p>
              </motion.div>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card variant="elevated" className="max-w-lg mx-auto">
                <LoadingAnalysis currentStep={analysisStep} />
              </Card>
            </motion.div>
          )}

          {analysisResults && !isAnalyzing && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <AnalysisResults data={analysisResults} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>AI Resume Analyzer • Powered by Gemini Flash</p>
        </div>
      </footer>
    </div>
  );
}
