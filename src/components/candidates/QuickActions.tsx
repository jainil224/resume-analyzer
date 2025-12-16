import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Star, Trash2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type CandidateStatus = "pending" | "reviewed" | "shortlisted" | "rejected" | "selected";

interface QuickActionsProps {
  candidateId: string;
  currentStatus: string;
  onStatusChange: (newStatus?: CandidateStatus) => void;
  onDelete?: () => void;
  isDemo?: boolean;
}

export function QuickActions({ candidateId, currentStatus, onStatusChange, onDelete, isDemo }: QuickActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAction = async (newStatus: CandidateStatus, message: string) => {
    if (isDemo) {
      // In demo mode, call onStatusChange with the new status to update local state
      onStatusChange(newStatus);
      toast.success(`${message} (demo mode)`);
      return;
    }

    const { error } = await supabase
      .from("candidates")
      .update({ status: newStatus })
      .eq("id", candidateId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(message);
      onStatusChange();
    }
  };

  const handleDelete = async () => {
    // Check if this is a local candidate (id starts with "local-")
    const isLocalCandidate = candidateId.startsWith("local-");
    
    if (isDemo && !isLocalCandidate) {
      toast.info("Login to delete demo candidates");
      return;
    }

    setIsDeleting(true);
    
    if (isLocalCandidate) {
      // Local candidates are deleted via onDelete callback
      toast.success("Candidate deleted");
      onDelete?.();
      onStatusChange();
    } else {
      const { error } = await supabase
        .from("candidates")
        .delete()
        .eq("id", candidateId);

      if (error) {
        toast.error("Failed to delete candidate");
      } else {
        toast.success("Candidate deleted");
        onDelete?.();
        onStatusChange();
      }
    }
    setIsDeleting(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={currentStatus === "shortlisted" ? "default" : "outline"}
        className={currentStatus === "shortlisted" ? "bg-success hover:bg-success/90" : ""}
        onClick={(e) => {
          e.stopPropagation();
          handleAction("shortlisted", "Candidate shortlisted");
        }}
      >
        <Check className="w-4 h-4 mr-1" />
        Shortlist
      </Button>
      <Button
        size="sm"
        variant={currentStatus === "rejected" ? "default" : "outline"}
        className={currentStatus === "rejected" ? "bg-destructive hover:bg-destructive/90" : ""}
        onClick={(e) => {
          e.stopPropagation();
          handleAction("rejected", "Candidate rejected");
        }}
      >
        <X className="w-4 h-4 mr-1" />
        Reject
      </Button>
      <Button
        size="sm"
        variant={currentStatus === "reviewed" ? "default" : "outline"}
        className={currentStatus === "reviewed" ? "bg-primary hover:bg-primary/90" : ""}
        onClick={(e) => {
          e.stopPropagation();
          handleAction("reviewed", "Marked for later review");
        }}
      >
        <Star className="w-4 h-4 mr-1" />
        Save
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={(e) => e.stopPropagation()}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidate?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this candidate and all associated data including resumes and notes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}