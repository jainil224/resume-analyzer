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
  History
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

export function DownloadHistory() {
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
    if (score >= 70) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 70) return "default";
    if (score >= 50) return "secondary";
    return "destructive";
  };

  if (history.length === 0) {
    return (
      <Card variant="gradient-underline" className="mt-6">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <History className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Download History</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Your PDF download history will appear here after you export analysis reports.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="gradient-underline" className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Download className="w-5 h-5 text-accent" />
          </div>
          Download History
        </CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
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
                transition={{ delay: index * 0.05 }}
                className="group flex items-center gap-4 p-4 bg-secondary/50 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <div className="p-2.5 bg-background rounded-lg shadow-sm">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground truncate">
                      {item.jobTitle}
                    </span>
                    <Badge variant={getScoreBadgeVariant(item.score)} className="shrink-0">
                      <span className={getScoreColor(item.score)}>
                        {item.score}%
                      </span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {format(new Date(item.downloadedAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                  <p className="text-xs text-muted-foreground/70 truncate mt-1">
                    {item.fileName}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
          <span>{history.length} download{history.length !== 1 ? 's' : ''} recorded</span>
          <span className="text-xs">© Developed by Jainil Patel</span>
        </div>
      </CardContent>
    </Card>
  );
}