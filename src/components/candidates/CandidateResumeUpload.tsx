import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CandidateResumeUploadProps {
  candidateId: string;
  userId: string;
  currentVersion: number;
  onUploadComplete: () => void;
}

export function CandidateResumeUpload({ 
  candidateId, 
  userId, 
  currentVersion,
  onUploadComplete 
}: CandidateResumeUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!resumeName.trim()) {
      toast.error("Please enter a resume name");
      return;
    }

    if (!resumeText.trim() && !file) {
      toast.error("Please provide resume content or upload a file");
      return;
    }

    setUploading(true);

    try {
      let resumeUrl = null;
      let finalResumeText = resumeText;

      // Upload file if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}/${candidateId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error("Failed to upload file");
        }

        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(filePath);

        resumeUrl = publicUrl;
      }

      // Call the analyze-resume edge function
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-resume', {
        body: {
          resumeText: finalResumeText,
          jobDescription: jobDescription
        }
      });

      if (analysisError) {
        throw new Error("Failed to analyze resume");
      }

      // Insert the resume with analysis results
      const { error: insertError } = await supabase.from('candidate_resumes').insert({
        candidate_id: candidateId,
        user_id: userId,
        version: currentVersion + 1,
        resume_name: resumeName,
        resume_url: resumeUrl,
        resume_text: finalResumeText,
        job_description: jobDescription,
        overall_score: analysisData.overall_score || 0,
        skills_match: analysisData.skills_match || 0,
        experience_score: analysisData.experience_score || 0,
        education_score: analysisData.education_score || 0,
        ats_score: analysisData.ats_score || 0,
        formatting_score: analysisData.formatting_score || 0,
        grammar_score: analysisData.grammar_score || 0,
        matched_skills: analysisData.matched_skills || [],
        missing_skills: analysisData.missing_skills || [],
        strengths: analysisData.strengths || [],
        weaknesses: analysisData.weaknesses || [],
        ai_suggestions: analysisData.ai_suggestions || []
      });

      if (insertError) {
        throw new Error("Failed to save resume");
      }

      toast.success("Resume uploaded and analyzed successfully");
      setIsOpen(false);
      resetForm();
      onUploadComplete();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setResumeName("");
    setResumeText("");
    setJobDescription("");
    setFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Upload Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload & Analyze Resume</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="resumeName">Resume Name *</Label>
            <Input
              id="resumeName"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              placeholder="e.g., John_Doe_Resume_v2"
            />
          </div>

          <div className="space-y-2">
            <Label>Upload PDF (Optional)</Label>
            <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeText">Resume Text *</Label>
            <Textarea
              id="resumeText"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste the resume content here..."
              rows={8}
            />
            <p className="text-xs text-muted-foreground">Paste the resume text for analysis</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description (Optional)</Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description for better skill matching..."
              rows={4}
            />
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={uploading} 
            className="w-full bg-accent-gradient"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload & Analyze
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
