import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Plus,
  Mail,
  Phone,
  Eye,
  MoreVertical,
  Trash2,
  Download,
  Calendar,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScoreCircle } from "@/components/ScoreCircle";
import { CandidateFilters } from "@/components/candidates/CandidateFilters";
import { QuickActions } from "@/components/candidates/QuickActions";
import { ResumeAnalysisStatus } from "@/components/candidates/ResumeAnalysisStatus";
import { DuplicateDetection } from "@/components/candidates/DuplicateDetection";

type CandidateStatus = "pending" | "reviewed" | "shortlisted" | "rejected" | "selected";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  applied_role: string;
  status: CandidateStatus;
  created_at: string;
  updated_at: string;
  education: string | null;
  experience_years: number;
  profile_picture_url: string | null;
  interview_date: string | null;
  interview_status: string;
  latestScore?: number;
  analysisStatus?: string;
  matchedSkills?: string[];
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

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    applied_role: "",
    education: "",
    experience_years: 0
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchCandidates();
  }, [user, navigate]);

  const fetchCandidates = async () => {
    const { data: candidatesData, error: candidatesError } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (candidatesError) {
      toast.error("Failed to load candidates");
      setLoading(false);
      return;
    }

    // Fetch latest resume scores for each candidate
    const candidateIds = candidatesData.map(c => c.id);
    const { data: resumesData } = await supabase
      .from("candidate_resumes")
      .select("candidate_id, overall_score, analysis_status, matched_skills, created_at")
      .in("candidate_id", candidateIds)
      .order("created_at", { ascending: false });

    const latestData: Record<string, { score: number; status: string; skills: string[] }> = {};
    resumesData?.forEach(resume => {
      if (!latestData[resume.candidate_id]) {
        latestData[resume.candidate_id] = {
          score: resume.overall_score || 0,
          status: resume.analysis_status || "pending",
          skills: resume.matched_skills || []
        };
      }
    });

    const candidatesWithScores = candidatesData.map(c => ({
      ...c,
      status: c.status as CandidateStatus,
      latestScore: latestData[c.id]?.score,
      analysisStatus: latestData[c.id]?.status || "pending",
      matchedSkills: latestData[c.id]?.skills || []
    }));

    setCandidates(candidatesWithScores);
    setLoading(false);
  };

  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.email || !newCandidate.applied_role) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check for duplicates
    const { data: existingEmail } = await supabase
      .from("candidates")
      .select("id")
      .eq("email", newCandidate.email)
      .maybeSingle();

    if (existingEmail) {
      toast.error("A candidate with this email already exists");
      return;
    }

    if (newCandidate.phone) {
      const { data: existingPhone } = await supabase
        .from("candidates")
        .select("id")
        .eq("phone", newCandidate.phone)
        .maybeSingle();

      if (existingPhone) {
        toast.error("A candidate with this phone number already exists");
        return;
      }
    }

    const { error } = await supabase.from("candidates").insert({
      user_id: user!.id,
      name: newCandidate.name,
      email: newCandidate.email,
      phone: newCandidate.phone || null,
      applied_role: newCandidate.applied_role,
      education: newCandidate.education || null,
      experience_years: newCandidate.experience_years
    });

    if (error) {
      toast.error("Failed to add candidate");
      return;
    }

    toast.success("Candidate added successfully");
    setIsAddDialogOpen(false);
    setNewCandidate({ name: "", email: "", phone: "", applied_role: "", education: "", experience_years: 0 });
    fetchCandidates();
  };

  const handleDeleteCandidate = async (id: string) => {
    const { error } = await supabase.from("candidates").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete candidate");
      return;
    }
    toast.success("Candidate deleted");
    fetchCandidates();
  };

  const handleStatusChange = async (id: string, newStatus: CandidateStatus) => {
    const { error } = await supabase
      .from("candidates")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }
    toast.success("Status updated");
    fetchCandidates();
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRoleFilter("all");
    setScoreFilter("all");
    setExperienceFilter("all");
    setSkillFilter("all");
  };

  const uniqueRoles = [...new Set(candidates.map(c => c.applied_role))];

  const filteredCandidates = candidates.filter(c => {
    // Search filter
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.applied_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.matchedSkills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Status filter
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    
    // Role filter
    const matchesRole = roleFilter === "all" || c.applied_role === roleFilter;
    
    // Score filter
    let matchesScore = true;
    if (scoreFilter !== "all" && c.latestScore !== undefined) {
      if (scoreFilter === "excellent") matchesScore = c.latestScore >= 80;
      else if (scoreFilter === "good") matchesScore = c.latestScore >= 60 && c.latestScore < 80;
      else if (scoreFilter === "average") matchesScore = c.latestScore >= 40 && c.latestScore < 60;
      else if (scoreFilter === "low") matchesScore = c.latestScore < 40;
    }

    // Experience filter
    let matchesExperience = true;
    if (experienceFilter !== "all") {
      const years = c.experience_years || 0;
      if (experienceFilter === "fresher") matchesExperience = years <= 1;
      else if (experienceFilter === "junior") matchesExperience = years > 1 && years <= 3;
      else if (experienceFilter === "mid") matchesExperience = years > 3 && years <= 5;
      else if (experienceFilter === "senior") matchesExperience = years > 5;
    }

    // Skill filter
    let matchesSkill = true;
    if (skillFilter !== "all") {
      matchesSkill = c.matchedSkills?.some(s => 
        s.toLowerCase().includes(skillFilter.toLowerCase())
      ) || false;
    }

    return matchesSearch && matchesStatus && matchesRole && matchesScore && matchesExperience && matchesSkill;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-gradient rounded-xl shadow-glow">
            <Users className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Candidates</h1>
            <p className="text-muted-foreground text-sm">Manage and track your candidates</p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent-gradient hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {/* Duplicate Detection */}
              {(newCandidate.email || newCandidate.phone) && (
                <DuplicateDetection 
                  email={newCandidate.email}
                  phone={newCandidate.phone}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newCandidate.phone}
                    onChange={(e) => setNewCandidate(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Applied Role *</Label>
                  <Input
                    id="role"
                    value={newCandidate.applied_role}
                    onChange={(e) => setNewCandidate(prev => ({ ...prev, applied_role: e.target.value }))}
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    value={newCandidate.education}
                    onChange={(e) => setNewCandidate(prev => ({ ...prev, education: e.target.value }))}
                    placeholder="B.Tech in Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={newCandidate.experience_years}
                    onChange={(e) => setNewCandidate(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <Button onClick={handleAddCandidate} className="w-full bg-accent-gradient">
                Add Candidate
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {Object.entries(statusLabels).map(([key, label]) => {
          const count = candidates.filter(c => c.status === key).length;
          return (
            <Card 
              key={key} 
              className={`bg-card-gradient border-border/50 cursor-pointer transition-all hover:scale-105 ${
                statusFilter === key ? 'ring-2 ring-accent' : ''
              }`}
              onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">{label}</p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Advanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CandidateFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
          scoreFilter={scoreFilter}
          onScoreChange={setScoreFilter}
          experienceFilter={experienceFilter}
          onExperienceChange={setExperienceFilter}
          skillFilter={skillFilter}
          onSkillChange={setSkillFilter}
          uniqueRoles={uniqueRoles}
          onClearFilters={clearAllFilters}
        />
      </motion.div>

      {/* Candidates Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">Candidate</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Role & Experience</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">ATS Score</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Quick Actions</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">More</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredCandidates.map((candidate, idx) => (
                    <motion.tr
                      key={candidate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/candidates/${candidate.id}`)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {candidate.profile_picture_url ? (
                            <img 
                              src={candidate.profile_picture_url} 
                              alt={candidate.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center text-accent-foreground font-semibold">
                              {candidate.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {candidate.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <Badge variant="outline" className="font-normal">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {candidate.applied_role}
                          </Badge>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{candidate.experience_years || 0} yrs exp</span>
                            {candidate.education && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3" />
                                  {candidate.education.substring(0, 20)}...
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {candidate.latestScore !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8">
                              <ScoreCircle score={candidate.latestScore} size="sm" />
                            </div>
                            <div>
                              <span className={`font-bold ${getScoreColor(candidate.latestScore)}`}>
                                {candidate.latestScore}%
                              </span>
                              <div className="mt-0.5">
                                <ResumeAnalysisStatus status={candidate.analysisStatus || "pending"} />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No resume</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Select
                          value={candidate.status}
                          onValueChange={(value) => {
                            event?.stopPropagation();
                            handleStatusChange(candidate.id, value as CandidateStatus);
                          }}
                        >
                          <SelectTrigger 
                            className={`w-32 h-8 text-xs border ${statusColors[candidate.status]}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <QuickActions 
                          candidateId={candidate.id}
                          currentStatus={candidate.status}
                          onStatusChange={fetchCandidates}
                        />
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/candidates/${candidate.id}`);
                            }}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              window.open(`mailto:${candidate.email}`, '_blank');
                            }}>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            {candidate.phone && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${candidate.phone}`, '_blank');
                              }}>
                                <Phone className="w-4 h-4 mr-2" />
                                Call
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCandidate(candidate.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredCandidates.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No candidates found</p>
                <p className="text-sm">Try adjusting your filters or add a new candidate</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}