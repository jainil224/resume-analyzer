import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Plus,
  Mail,
  Eye,
  Download
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { CandidateFilters } from "@/components/candidates/CandidateFilters";
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
              Import Candidates
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
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="bg-card-gradient border-border/50">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-primary">{candidates.length}</p>
            <p className="text-sm text-muted-foreground">Total Candidates</p>
          </CardContent>
        </Card>
        <Card className="bg-card-gradient border-border/50">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-foreground">
              {candidates.filter(c => c.status === "selected").length}
            </p>
            <p className="text-sm text-muted-foreground">Selected</p>
          </CardContent>
        </Card>
        <Card className="bg-card-gradient border-border/50">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-foreground">
              {candidates.filter(c => c.status === "pending").length}
            </p>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card className="bg-card-gradient border-border/50">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-success">
              {candidates.length > 0 
                ? Math.round(candidates.reduce((acc, c) => acc + (c.latestScore || 0), 0) / candidates.length)
                : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Avg ATS Score</p>
          </CardContent>
        </Card>
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
                  <th className="text-left p-4 font-medium text-muted-foreground">Applied For</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">ATS Score</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Upload Date</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
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
                        <span className="text-foreground">{candidate.applied_role}</span>
                      </td>
                      <td className="p-4">
                        {candidate.latestScore !== undefined ? (
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  candidate.latestScore >= 80 ? 'bg-primary' : 
                                  candidate.latestScore >= 60 ? 'bg-warning' : 'bg-destructive'
                                }`}
                                style={{ width: `${candidate.latestScore}%` }}
                              />
                            </div>
                            <span className={`font-semibold ${getScoreColor(candidate.latestScore)}`}>
                              {candidate.latestScore}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <Badge 
                          variant="outline" 
                          className={`${statusColors[candidate.status]} cursor-pointer`}
                          onClick={() => {
                            const statuses: CandidateStatus[] = ["pending", "reviewed", "shortlisted", "rejected", "selected"];
                            const currentIdx = statuses.indexOf(candidate.status);
                            const nextStatus = statuses[(currentIdx + 1) % statuses.length];
                            handleStatusChange(candidate.id, nextStatus);
                          }}
                        >
                          {statusLabels[candidate.status]}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-muted-foreground text-sm">
                          {format(new Date(candidate.created_at), "yyyy-MM-dd")}
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => navigate(`/candidates/${candidate.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => toast.info("Download feature coming soon")}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
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