import { Button } from "@/components/ui/button";
import { Check, X, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type CandidateStatus = "pending" | "reviewed" | "shortlisted" | "rejected" | "selected";

interface QuickActionsProps {
  candidateId: string;
  currentStatus: string;
  onStatusChange: () => void;
}

export function QuickActions({ candidateId, currentStatus, onStatusChange }: QuickActionsProps) {
  const handleAction = async (newStatus: CandidateStatus, message: string) => {
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
    </div>
  );
}