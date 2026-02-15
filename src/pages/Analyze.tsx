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
import { useAnalyzing } from "@/contexts/AnalyzingContext";
import { saveLocalCandidate, LocalCandidate } from "@/hooks/useLocalCandidates";
import { saveAnalysisToSupabase } from "@/hooks/useAnalysisHistory";
import { Sparkles, ArrowRight, FileText, Target, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import TrueFocus from "@/components/TrueFocus";
import { extractTextFromFile } from "@/utils/fileExtraction";

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


const ANALYZE_STATE_KEY = 'analyze_page_state';

export default function Analyze() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLocalAnalyzing, setIsLocalAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setIsAnalyzing } = useAnalyzing();

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(ANALYZE_STATE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.resumeText) setResumeText(parsed.resumeText);
        if (parsed.resumeName) setResumeName(parsed.resumeName);
        if (parsed.jobTitle) setJobTitle(parsed.jobTitle);
        if (parsed.jobDescription) setJobDescription(parsed.jobDescription);
        if (parsed.analysisResults) setAnalysisResults(parsed.analysisResults);
      } catch (e) {
        console.warn('Failed to restore analyze state:', e);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      resumeText,
      resumeName,
      jobTitle,
      jobDescription,
      analysisResults,
    };
    localStorage.setItem(ANALYZE_STATE_KEY, JSON.stringify(stateToSave));
  }, [resumeText, resumeName, jobTitle, jobDescription, analysisResults]);

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
    setError(null);
    setAnalysisStep(0);

    try {
      let textToAnalyze = resumeText.trim();

      if (!textToAnalyze && resumeFile) {
        setAnalysisStep(0);
        try {
          textToAnalyze = await extractTextFromFile(resumeFile);
        } catch (err: any) {
          throw new Error(err.message || "Failed to read resume file.");
        }
      }

      for (let i = 0; i < 4; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setAnalysisStep(i + 1);
      }
      // Call Groq API
      const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!groqApiKey) {
        throw new Error("Groq API key not configured");
      }

      const systemContent = `You are an expert ATS (Applicant Tracking System) Resume Analyzer. 

SCORING GUIDELINES:
1. **overall_score** (0-100): Weighted average of all scores. 85+ = Excellent, 70-84 = Good, 50-69 = Needs Work, <50 = Poor
2. **skills_match** (0-100): Percentage of required skills from job description found in resume. Count exact matches and related skills.
3. **experience_score** (0-100): How well experience aligns with job requirements. Consider years, relevance, and career progression.
4. **ats_score** (0-100): ATS compatibility based on:
   - Proper section headings (Education, Experience, Skills)
   - No graphics, tables, or complex formatting
   - Standard fonts and bullet points
   - Contact info at top
   - Keywords from job description
   - No headers/footers issues
5. **formatting_score** (0-100): Resume structure, readability, length (1-2 pages), consistency

ANALYSIS REQUIREMENTS:
- Extract ALL skills mentioned in job description
- Compare each skill against resume content
- Be specific about which skills match vs missing  
- Provide actionable improvement suggestions
- Consider synonyms and related terms when matching skills

Return ONLY valid JSON with this exact structure:
{
  "overall_score": <number 0-100>,
  "skills_match": <number 0-100>,
  "experience_score": <number 0-100>,
  "ats_score": <number 0-100>,
  "formatting_score": <number 0-100>,
  "matched_skills": [<list of skills from JD found in resume>],
  "missing_skills": [<list of skills from JD NOT found in resume>],
  "strengths": [<3-5 specific resume strengths>],
  "weaknesses": [<3-5 specific areas to improve>],
  "ai_suggestions": [<5-7 actionable improvement suggestions>]
}`;
      const userContent = `RESUME:\n${textToAnalyze}\n\nJOB DESCRIPTION:\n${jobDescription}`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemContent },
            { role: "user", content: userContent }
          ],
          temperature: 0.2,
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Request failed (${response.status})`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) throw new Error("Empty response from AI Service");

      const results: AnalysisData = JSON.parse(content.trim());

      // Basic validation
      if (typeof results.overall_score === 'undefined') {
        throw new Error("Received incomplete analysis data.");
      }

      setAnalysisResults(results);

      // Save to Supabase (primary) and localStorage (fallback)
      const finalResumeName = resumeFile?.name || resumeName || "Unknown Resume";

      // Try saving to Supabase first
      try {
        await saveAnalysisToSupabase({
          resumeName: finalResumeName,
          jobTitle: jobTitle.trim() || "Not Specified",
          jobDescription: jobDescription.trim(),
          resumeText: textToAnalyze,
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
      } catch (saveError) {
        console.warn('Failed to save to Supabase, using localStorage:', saveError);
      }

      // Also save to localStorage as fallback
      const localCandidate: LocalCandidate = {
        id: `local-${Date.now()}`,
        name: finalResumeName,
        email: `${finalResumeName.toLowerCase().replace(/\s+/g, '.')}@pending.com`,
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

      toast.success("Analysis complete! Result saved to history.");
    } catch (error: any) {
      console.error("Analysis error details:", error);
      let errorMessage = error instanceof Error ? error.message : "Analysis failed";

      if (errorMessage.includes("API key expired") || errorMessage.includes("API_KEY_INVALID")) {
        errorMessage = "Invalid or expired Gemini API key. Please check your key.";
      } else if (errorMessage.includes("ERR_NAME_NOT_RESOLVED") || errorMessage.includes("Load failed")) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      toast.error(errorMessage, { duration: 5000 });
      setError(errorMessage);
    } finally {
      setIsLocalAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResumeFile(null);
    setResumeName("");
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
              {error && (
                <div className="max-w-md mx-auto mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium text-left">{error}</p>
                </div>
              )}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Badge variant="ai" className="mb-4">
                  <Sparkles className="w-3 h-3 mr-1" />Resume Analyzer
                </Badge>
                <div className="mb-4">
                  <TrueFocus
                    sentence="Analyze Your Resume"
                    manualMode={false}
                    blurAmount={5}
                    borderColor="#5227FF"
                    glowColor="rgba(82, 39, 255, 0.4)"
                    animationDuration={0.5}
                    pauseBetweenAnimations={1}
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
                  <FileUpload
                    onFileSelect={(file) => {
                      setResumeFile(file);
                      if (file) {
                        setResumeName(file.name);
                      } else if (!resumeText) {
                        setResumeName("");
                      }
                    }}
                  />
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
                id="tour-analyze-btn"
                disabled={(!resumeFile && !resumeText.trim()) || !jobDescription.trim()}
              >
                <Sparkles className="w-5 h-5" />
                Analyze with AI
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                ✓ Free analysis • No account required
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
