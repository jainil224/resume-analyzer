import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getDownloadHistory, 
  clearDownloadHistory, 
  deleteDownloadHistoryItem,
  DownloadHistoryItem 
} from "@/utils/pdfExport";
import { 
  FileText, 
  Trash2, 
  Clock, 
  Download, 
  AlertCircle,
  History,
  FileDown
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DownloadHistoryPage() {
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getDownloadHistory());
  }, []);

  const handleClearAll = () => {
    clearDownloadHistory();
    setHistory([]);
    toast.success("Download history cleared");
  };

  const handleDeleteItem = (id: string) => {
    deleteDownloadHistoryItem(id);
    setHistory(getDownloadHistory());
    toast.success("Item removed from history");
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 70) return "default";
    if (score >= 50) return "secondary";
    return "destructive";
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 p-6"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
            <History className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Download History
            </h1>
            <p className="text-muted-foreground mt-1">
              Track all your previously generated PDF reports
            </p>
          </div>
        </div>
        
        {history.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive border-destructive/30">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  Clear Download History?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {history.length} items from your download history.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} className="bg-destructive hover:bg-destructive/90">
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </motion.div>

      {/* Stats Card */}
      {history.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card variant="gradient-underline">
            <CardContent className="py-6">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{history.length}</div>
                  <div className="text-sm text-muted-foreground">Total Downloads</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">
                    {history.length > 0 
                      ? Math.round(history.reduce((acc, item) => acc + item.score, 0) / history.length) 
                      : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {history.filter(item => item.score >= 70).length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Scores (70%+)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {history.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card variant="gradient-underline">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-6 bg-gradient-to-br from-muted to-muted/50 rounded-full mb-6">
                <FileDown className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Download History</h3>
              <p className="text-muted-foreground text-sm max-w-md mb-6">
                Your PDF download history will appear here after you export analysis reports.
                Go to the Resume Analyzer to analyze and export your first report!
              </p>
              <Button asChild>
                <a href="/analyze">
                  <FileText className="w-4 h-4 mr-2" />
                  Analyze Resume
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* History List */
        <motion.div variants={itemVariants}>
          <Card variant="gradient-underline">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Download className="w-5 h-5 text-accent" />
                </div>
                Recent Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {history.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03 }}
                      className="group flex items-center gap-4 p-4 bg-secondary/50 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-secondary/70 transition-all"
                    >
                      <div className="p-3 bg-background rounded-lg shadow-sm border border-border/50">
                        <FileText className="w-6 h-6 text-accent" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="font-semibold text-foreground truncate text-lg">
                            {item.jobTitle}
                          </span>
                          <Badge variant={getScoreBadgeVariant(item.score)} className="shrink-0">
                            <span className={getScoreColor(item.score)}>
                              {item.score}%
                            </span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {format(new Date(item.downloadedAt), "MMM d, yyyy 'at' h:mm a")}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground/70 truncate mt-1">
                          {item.fileName}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Footer */}
      <motion.div variants={itemVariants} className="text-center text-sm text-muted-foreground pt-4">
        © Developed by Jainil Patel
      </motion.div>
    </motion.div>
  );
}
