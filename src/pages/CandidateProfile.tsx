import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScoreCircle } from "@/components/ScoreCircle";
import { SkillTag } from "@/components/SkillTag";
import { 
  ArrowLeft, Mail, Phone, Briefcase, Calendar, Target, TrendingUp, TrendingDown,
  FileText, MessageSquare, History, Download, Send, Plus, Trash2, Eye, GitCompare,
  Sparkles, BookOpen, Award, FileCheck, GraduationCap, Share2, LogIn
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { CandidateResumeUpload } from "@/components/candidates/CandidateResumeUpload";
import { CandidateResumeComparison } from "@/components/candidates/CandidateResumeComparison";
import { ATSScoreBreakdown } from "@/components/candidates/ATSScoreBreakdown";
import { InterviewTracker } from "@/components/candidates/InterviewTracker";
import { AdminNotesSection } from "@/components/candidates/AdminNotesSection";
import { CandidatePerformanceChart } from "@/components/candidates/CandidatePerformanceChart";
import { ShareResumeDialog } from "@/components/candidates/ShareResumeDialog";
import { ResumeAnalysisStatus } from "@/components/candidates/ResumeAnalysisStatus";
import { mockCandidates, mockResumes, mockNotes } from "@/data/mockCandidates";

type CandidateStatus = "pending" | "reviewed" | "shortlisted" | "rejected" | "selected";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  applied_role: string;
  status: CandidateStatus;
  created_at: string;
}

interface CandidateResume {
  id: string;
  candidate_id: string;
  version: number;
  resume_name: string;
  resume_url: string | null;
  resume_text: string | null;
  overall_score: number;
  skills_match: number;
  experience_score: number;
  education_score: number;
  ats_score: number;
  formatting_score: number;
  grammar_score: number;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  ai_suggestions: string[];
  job_description: string | null;
  created_at: string;
}

interface CandidateNote {
  id: string;
  note_type: string;
  content: string;
  created_at: string;
}

const statusColors: Record<CandidateStatus, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  reviewed: "bg-primary/10 text-primary border-primary/20",
  shortlisted: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  selected: "bg-accent/10 text-accent border-accent/20"
};

const statusLabels: Record<CandidateStatus, string> = {
  pending: "Pending",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  selected: "Selected"
};

export default function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDemo = !user || id?.startsWith("demo-");

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [resumes, setResumes] = useState<CandidateResume[]>([]);
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState({ content: "", type: "general" });
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareResumes, setCompareResumes] = useState<string[]>([]);

  useEffect(() => {
    if (id?.startsWith("demo-")) {
      // Load mock data for demo mode
      const mockCandidate = mockCandidates.find(c => c.id === id);
      if (mockCandidate) {
        setCandidate(mockCandidate as any);
        const candidateResumes = mockResumes.filter(r => r.candidate_id === id) as CandidateResume[];
        setResumes(candidateResumes);
        if (candidateResumes.length > 0) {
          setSelectedResumeId(candidateResumes[0].id);
        }
        const candidateNotes = mockNotes.filter(n => n.candidate_id === id) as CandidateNote[];
        setNotes(candidateNotes);
      } else {
        navigate("/candidates");
      }
      setLoading(false);
    } else if (!user) {
      navigate("/auth");
    } else if (id) {
      fetchCandidateData();
    }
  }, [user, id, navigate]);

  const fetchCandidateData = async () => {
    // Fetch candidate
    const { data: candidateData, error: candidateError } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (candidateError || !candidateData) {
      toast.error("Candidate not found");
      navigate("/candidates");
      return;
    }

    setCandidate({ ...candidateData, status: candidateData.status as CandidateStatus });

    // Fetch resumes
    const { data: resumesData } = await supabase
      .from("candidate_resumes")
      .select("*")
      .eq("candidate_id", id)
      .order("version", { ascending: false });

    if (resumesData) {
      setResumes(resumesData);
      if (resumesData.length > 0) {
        setSelectedResumeId(resumesData[0].id);
      }
    }

    // Fetch notes
    const { data: notesData } = await supabase
      .from("candidate_notes")
      .select("*")
      .eq("candidate_id", id)
      .order("created_at", { ascending: false });

    if (notesData) setNotes(notesData);

    setLoading(false);
  };

  const handleStatusChange = async (newStatus: CandidateStatus) => {
    if (!candidate) return;

    if (isDemo) {
      setCandidate({ ...candidate, status: newStatus });
      toast.success("Status updated (demo mode)");
      return;
    }

    const { error } = await supabase
      .from("candidates")
      .update({ status: newStatus })
      .eq("id", candidate.id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    setCandidate({ ...candidate, status: newStatus });
    toast.success("Status updated");
  };

  const handleAddNote = async () => {
    if (!newNote.content.trim() || !candidate) {
      toast.error("Note content is required");
      return;
    }

    if (isDemo) {
      const demoNote = {
        id: `note-demo-${Date.now()}`,
        note_type: newNote.type,
        content: newNote.content,
        created_at: new Date().toISOString()
      };
      setNotes(prev => [demoNote, ...prev]);
      toast.success("Note added (demo mode)");
      setIsAddNoteOpen(false);
      setNewNote({ content: "", type: "general" });
      return;
    }

    const { error } = await supabase.from("candidate_notes").insert({
      candidate_id: candidate.id,
      user_id: user!.id,
      note_type: newNote.type,
      content: newNote.content
    });

    if (error) {
      toast.error("Failed to add note");
      return;
    }

    toast.success("Note added");
    setIsAddNoteOpen(false);
    setNewNote({ content: "", type: "general" });
    fetchCandidateData();
  };

  const handleDeleteNote = async (noteId: string) => {
    if (isDemo) {
      setNotes(prev => prev.filter(n => n.id !== noteId));
      toast.success("Note deleted (demo mode)");
      return;
    }

    const { error } = await supabase.from("candidate_notes").delete().eq("id", noteId);
    if (error) {
      toast.error("Failed to delete note");
      return;
    }
    toast.success("Note deleted");
    fetchCandidateData();
  };

  const handleCompareToggle = (resumeId: string) => {
    setCompareResumes(prev => {
      if (prev.includes(resumeId)) {
        return prev.filter(id => id !== resumeId);
      }
      if (prev.length < 2) {
        return [...prev, resumeId];
      }
      return [prev[1], resumeId];
    });
  };

  const selectedResume = resumes.find(r => r.id === selectedResumeId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      {isDemo && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-primary" />
              <span className="text-sm text-primary font-medium">Demo Mode - Viewing sample data</span>
            </div>
            <Button size="sm" onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/candidates")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent-gradient flex items-center justify-center text-accent-foreground text-xl font-bold">
                  {candidate.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-bold">{candidate.name}</h1>
                  <p className="text-sm text-muted-foreground">{candidate.applied_role}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={candidate.status} onValueChange={(v) => handleStatusChange(v as CandidateStatus)}>
                <SelectTrigger className={`w-36 ${statusColors[candidate.status]}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ShareResumeDialog
                candidateName={candidate.name}
                candidateEmail={candidate.email}
                resumeUrl={selectedResume?.resume_url}
                suggestions={selectedResume?.ai_suggestions || []}
              />
              <Button variant="outline" asChild>
                <a href={`mailto:${candidate.email}`}>
                  <Send className="w-4 h-4 mr-2" />
                  Contact
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Candidate Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{candidate.email}</p>
                    </div>
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{candidate.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Applied Role</p>
                      <p className="text-sm font-medium">{candidate.applied_role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Applied Date</p>
                      <p className="text-sm font-medium">{format(new Date(candidate.created_at), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resume Versions */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Resume Versions</CardTitle>
                  {!isDemo && user && (
                    <CandidateResumeUpload 
                      candidateId={candidate.id} 
                      userId={user.id}
                      currentVersion={resumes.length}
                      onUploadComplete={fetchCandidateData}
                    />
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {resumes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No resumes uploaded yet</p>
                  ) : (
                    resumes.map((resume, idx) => (
                      <div 
                        key={resume.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedResumeId === resume.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border/50 hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedResumeId(resume.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium">Version {resume.version}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(resume.created_at), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <ScoreCircle score={resume.overall_score} size="sm" />
                            {compareMode && (
                              <input
                                type="checkbox"
                                checked={compareResumes.includes(resume.id)}
                                onChange={() => handleCompareToggle(resume.id)}
                                className="w-4 h-4"
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {resumes.length >= 2 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => setCompareMode(!compareMode)}
                    >
                      <GitCompare className="w-4 h-4 mr-2" />
                      {compareMode ? "Cancel Compare" : "Compare Versions"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Interview Tracker */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <InterviewTracker
                candidateId={candidate.id}
                data={{
                  interview_date: (candidate as any).interview_date,
                  interview_status: (candidate as any).interview_status || "not_scheduled",
                  hr_notes: (candidate as any).hr_notes
                }}
                onUpdate={fetchCandidateData}
              />
            </motion.div>

            {/* Admin Notes */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <AdminNotesSection
                candidateId={candidate.id}
                data={{
                  hr_notes: (candidate as any).hr_notes,
                  communication_skills: (candidate as any).communication_skills || 0,
                  final_remarks: (candidate as any).final_remarks
                }}
                onUpdate={fetchCandidateData}
              />
            </motion.div>

            {/* Performance Chart */}
            {selectedResume && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <CandidatePerformanceChart
                  data={{
                    skillStrength: selectedResume.skills_match,
                    atsProgress: selectedResume.ats_score,
                    resumeImprovement: selectedResume.formatting_score,
                    overallScore: selectedResume.overall_score
                  }}
                />
              </motion.div>
            )}
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {compareMode && compareResumes.length === 2 ? (
              <CandidateResumeComparison 
                resumes={resumes.filter(r => compareResumes.includes(r.id))}
                onClose={() => {
                  setCompareMode(false);
                  setCompareResumes([]);
                }}
              />
            ) : selectedResume ? (
              <>
                {/* Score Overview */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="overflow-hidden">
                    <div className="bg-hero p-6">
                      <div className="flex items-center gap-6">
                        <ScoreCircle score={selectedResume.overall_score} size="lg" />
                        <div>
                          <h2 className="text-xl font-bold text-primary-foreground">
                            Overall Score: {selectedResume.overall_score}%
                          </h2>
                          <p className="text-primary-foreground/80">
                            {selectedResume.resume_name} • Version {selectedResume.version}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="bg-white/20 text-white border-0">
                              <Target className="w-3 h-3 mr-1" />
                              {selectedResume.matched_skills.length} Skills Matched
                            </Badge>
                            <Badge variant="secondary" className="bg-white/20 text-white border-0">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {selectedResume.ats_score}% ATS
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="breakdown">ATS Breakdown</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    {/* Strengths & Weaknesses */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base text-success flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Strengths
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedResume.strengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-success">•</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base text-warning flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            Areas for Improvement
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedResume.weaknesses.map((w, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-warning">•</span>
                                {w}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* AI Suggestions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-accent" />
                          AI Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {selectedResume.ai_suggestions.map((suggestion, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 bg-accent/5 rounded-lg">
                              <span className="text-accent font-bold">{i + 1}.</span>
                              <span className="text-sm">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="breakdown" className="mt-4">
                    <ATSScoreBreakdown resume={selectedResume} />
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base text-success flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Matched Skills ({selectedResume.matched_skills.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedResume.matched_skills.map(skill => (
                            <SkillTag key={skill} skill={skill} matched />
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base text-warning flex items-center gap-2">
                          <TrendingDown className="w-4 h-4" />
                          Missing Skills ({selectedResume.missing_skills.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedResume.missing_skills.map(skill => (
                            <SkillTag key={skill} skill={skill} matched={false} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Reviewer Notes</CardTitle>
                        <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Note
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Note</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <Label>Note Type</Label>
                                <Select 
                                  value={newNote.type} 
                                  onValueChange={(v) => setNewNote(prev => ({ ...prev, type: v }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="strength">Strength</SelectItem>
                                    <SelectItem value="weakness">Weakness</SelectItem>
                                    <SelectItem value="follow_up">Follow Up</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea
                                  value={newNote.content}
                                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                                  placeholder="Enter your note..."
                                  rows={4}
                                />
                              </div>
                              <Button onClick={handleAddNote} className="w-full">Add Note</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent>
                        {notes.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">No notes yet</p>
                        ) : (
                          <div className="space-y-3">
                            {notes.map(note => (
                              <div key={note.id} className="p-4 border border-border/50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="capitalize">{note.note_type}</Badge>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                      {format(new Date(note.created_at), "MMM d, yyyy HH:mm")}
                                    </span>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6"
                                      onClick={() => handleDeleteNote(note.id)}
                                    >
                                      <Trash2 className="w-3 h-3 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm">{note.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card className="p-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-medium mb-2">No Resume Analyzed</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isDemo ? "Sample resume data is available in demo mode" : "Upload a resume to see the analysis"}
                </p>
                {!isDemo && user && (
                  <CandidateResumeUpload 
                    candidateId={candidate.id} 
                    userId={user.id}
                    currentVersion={0}
                    onUploadComplete={fetchCandidateData}
                  />
                )}
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
