import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScoreCircle } from "@/components/ScoreCircle";
import {
  Brain,
  ArrowLeft,
  Trash2,
  GitCompare,
  Calendar,
  FileText,
  Briefcase,
  RefreshCw,
  Download
} from "lucide-react";
import { useAnalysisHistory, AnalysisRecord } from "@/hooks/useAnalysisHistory";
import { toast } from "sonner";
import { format } from "date-fns";
import { generateAnalysisPDF } from "@/utils/pdfExport";

export default function History() {
  const { history, loading, error, refetch, deleteAnalysis, deleteAnalyses } = useAnalysisHistory();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    try {
      await deleteAnalysis(id);
      toast.success("Analysis deleted");
    } catch (err) {
      toast.error("Failed to delete analysis");
    }
  };


  const handleDeleteSelected = async () => {
    try {
      await deleteAnalyses(selectedIds);
      setSelectedIds([]);
      toast.success("Analyses deleted");
    } catch (err) {
      toast.error("Failed to delete analyses");
    }
  };

  const handleDownload = (analysis: AnalysisRecord) => {
    try {
      generateAnalysisPDF(analysis, analysis.job_title || "Job");
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === history.length && history.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(history.map(item => item.id));
    }
  };

  const handleCompare = () => {
    if (selectedIds.length === 2) {
      navigate(`/compare?ids=${selectedIds.join(",")}`);
    } else {
      toast.info("Please select exactly 2 analyses to compare");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">

              <span className="font-bold text-lg">Analysis History</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={refetch} title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </Button>
            {selectedIds.length > 0 && (
              <>
                <Button variant="destructive" onClick={handleDeleteSelected}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
                <Button variant="hero" onClick={handleCompare}>
                  <GitCompare className="w-4 h-4 mr-2" />
                  Compare Selected
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : error ? (
          <Card variant="glass" className="text-center py-12">
            <CardContent>
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={refetch}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : history.length === 0 ? (
          <Card variant="glass" className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by analyzing your first resume
              </p>
              <Button variant="hero" onClick={() => navigate("/analyze")}>
                Analyze Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedIds.length === history.length && history.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <p className="text-muted-foreground">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} selected`
                    : "Select analyses"}
                </p>
              </div>
              <Badge variant="outline">{history.length} analyses</Badge>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4"
            >
              {history.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    variant={selectedIds.includes(analysis.id) ? "accent" : "gradient-underline"}
                    className="hover:shadow-lg cursor-pointer"
                    onClick={() => toggleSelect(analysis.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedIds.includes(analysis.id)}
                          onCheckedChange={() => toggleSelect(analysis.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <ScoreCircle
                          score={analysis.overall_score}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium truncate">
                              {analysis.resume_name}
                            </span>
                          </div>
                          {analysis.job_title && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Briefcase className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{analysis.job_title}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(analysis.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </div>
                        </div>
                        <div className="hidden md:flex gap-2">
                          <Badge variant="outline">
                            Skills: {analysis.skills_match}%
                          </Badge>
                          <Badge variant="outline">
                            ATS: {analysis.ats_score}%
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(analysis);
                          }}
                          className="text-muted-foreground hover:text-primary"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(analysis.id);
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
