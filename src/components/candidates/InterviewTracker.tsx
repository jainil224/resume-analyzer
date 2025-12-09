import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Edit2, Save, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface InterviewData {
  interview_date: string | null;
  interview_status: string;
  hr_notes: string | null;
}

interface InterviewTrackerProps {
  candidateId: string;
  data: InterviewData;
  onUpdate: () => void;
}

const interviewStatuses = [
  { value: "not_scheduled", label: "Not Scheduled", color: "bg-muted text-muted-foreground" },
  { value: "scheduled", label: "Scheduled", color: "bg-primary/10 text-primary" },
  { value: "in_progress", label: "In Progress", color: "bg-warning/10 text-warning" },
  { value: "completed", label: "Completed", color: "bg-success/10 text-success" },
  { value: "selected", label: "Selected", color: "bg-accent/10 text-accent" },
  { value: "rejected", label: "Rejected", color: "bg-destructive/10 text-destructive" },
];

export function InterviewTracker({ candidateId, data, onUpdate }: InterviewTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    interview_date: data.interview_date || "",
    interview_status: data.interview_status || "not_scheduled",
    hr_notes: data.hr_notes || ""
  });

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("candidates")
      .update({
        interview_date: formData.interview_date || null,
        interview_status: formData.interview_status,
        hr_notes: formData.hr_notes || null
      })
      .eq("id", candidateId);

    if (error) {
      toast.error("Failed to update interview details");
    } else {
      toast.success("Interview details updated");
      setIsEditing(false);
      onUpdate();
    }
    setLoading(false);
  };

  const currentStatus = interviewStatuses.find(s => s.value === data.interview_status) || interviewStatuses[0];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Interview Tracking
        </CardTitle>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit2 className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Interview Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Interview Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.interview_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, interview_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Interview Status</Label>
                <Select
                  value={formData.interview_status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, interview_status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewStatuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>HR Notes</Label>
                <Textarea
                  value={formData.hr_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, hr_notes: e.target.value }))}
                  placeholder="Add interview notes..."
                  rows={4}
                />
              </div>
              <Button onClick={handleSave} disabled={loading} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge className={currentStatus.color}>
            {currentStatus.label}
          </Badge>
        </div>
        
        {data.interview_date && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Date & Time</span>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              {format(new Date(data.interview_date), "MMM d, yyyy 'at' h:mm a")}
            </div>
          </div>
        )}

        {data.hr_notes && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">HR Notes</span>
            </div>
            <p className="text-sm text-muted-foreground">{data.hr_notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}