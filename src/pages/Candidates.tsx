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
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Mail,
  Phone,
  Calendar,
  Target,
  TrendingUp,
  Eye,
  MoreVertical,
  Trash2,
  Edit,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScoreCircle } from "@/components/ScoreCircle";

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
  latestScore?: number;
}

interface CandidateResume {
  id: string;
  candidate_id: string;
  overall_score: number;
  ats_score: number;
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

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    applied_role: ""
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
      .select("candidate_id, overall_score, created_at")
      .in("candidate_id", candidateIds)
      .order("created_at", { ascending: false });

    const latestScores: Record<string, number> = {};
    resumesData?.forEach(resume => {
      if (!latestScores[resume.candidate_id]) {
        latestScores[resume.candidate_id] = resume.overall_score;
      }
    });

    const candidatesWithScores = candidatesData.map(c => ({
      ...c,
      status: c.status as CandidateStatus,
      latestScore: latestScores[c.id]
    }));

    setCandidates(candidatesWithScores);
    setLoading(false);
  };

  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.email || !newCandidate.applied_role) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { error } = await supabase.from("candidates").insert({
      user_id: user!.id,
      name: newCandidate.name,
      email: newCandidate.email,
      phone: newCandidate.phone || null,
      applied_role: newCandidate.applied_role
    });

    if (error) {
      toast.error("Failed to add candidate");
      return;
    }

    toast.success("Candidate added successfully");
    setIsAddDialogOpen(false);
    setNewCandidate({ name: "", email: "", phone: "", applied_role: "" });
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

  const uniqueRoles = [...new Set(candidates.map(c => c.applied_role))];

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.applied_role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesRole = roleFilter === "all" || c.applied_role === roleFilter;
    
    let matchesScore = true;
    if (scoreFilter !== "all" && c.latestScore !== undefined) {
      if (scoreFilter === "70+") matchesScore = c.latestScore >= 70;
      else if (scoreFilter === "50-69") matchesScore = c.latestScore >= 50 && c.latestScore < 70;
      else if (scoreFilter === "<50") matchesScore = c.latestScore < 50;
    }

    return matchesSearch && matchesStatus && matchesRole && matchesScore;
  });

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
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
            <Card key={key} className="bg-card-gradient border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">{label}</p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(statusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={scoreFilter} onValueChange={setScoreFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scores</SelectItem>
            <SelectItem value="70+">70% +</SelectItem>
            <SelectItem value="50-69">50-69%</SelectItem>
            <SelectItem value="<50">Below 50%</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Candidates Table/Grid */}
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
                  <th className="text-left p-4 font-medium text-muted-foreground">Applied Role</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">ATS Score</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
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
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/candidates/${candidate.id}`)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center text-accent-foreground font-semibold">
                            {candidate.name.charAt(0).toUpperCase()}
                          </div>
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
                        <Badge variant="outline" className="font-normal">
                          {candidate.applied_role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {candidate.latestScore !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8">
                              <ScoreCircle score={candidate.latestScore} size="sm" />
                            </div>
                            <span className="font-medium">{candidate.latestScore}%</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No resume</span>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {format(new Date(candidate.created_at), "MMM d, yyyy")}
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
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCandidate(candidate.id);
                              }}
                              className="text-destructive"
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
          </div>

          {filteredCandidates.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium mb-1">No candidates found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all" || roleFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first candidate to get started"}
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
