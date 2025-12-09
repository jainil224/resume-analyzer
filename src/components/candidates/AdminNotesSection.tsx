import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Star, Edit2, Save, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminNotesData {
  hr_notes: string | null;
  communication_skills: number;
  final_remarks: string | null;
}

interface AdminNotesSectionProps {
  candidateId: string;
  data: AdminNotesData;
  onUpdate: () => void;
}

export function AdminNotesSection({ candidateId, data, onUpdate }: AdminNotesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hr_notes: data.hr_notes || "",
    communication_skills: data.communication_skills || 0,
    final_remarks: data.final_remarks || ""
  });

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("candidates")
      .update({
        hr_notes: formData.hr_notes || null,
        communication_skills: formData.communication_skills,
        final_remarks: formData.final_remarks || null
      })
      .eq("id", candidateId);

    if (error) {
      toast.error("Failed to update notes");
    } else {
      toast.success("Notes updated");
      setIsEditing(false);
      onUpdate();
    }
    setLoading(false);
  };

  const getCommunicationLabel = (value: number) => {
    if (value >= 80) return "Excellent";
    if (value >= 60) return "Good";
    if (value >= 40) return "Average";
    if (value >= 20) return "Below Average";
    return "Poor";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Admin Notes (Private)
        </CardTitle>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit2 className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Admin Notes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>HR Notes / Observations</Label>
                <Textarea
                  value={formData.hr_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, hr_notes: e.target.value }))}
                  placeholder="Private notes about the candidate..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Communication Skills ({formData.communication_skills}%)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[formData.communication_skills]}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, communication_skills: value[0] }))}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-20">
                    {getCommunicationLabel(formData.communication_skills)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Final Remarks</Label>
                <Textarea
                  value={formData.final_remarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, final_remarks: e.target.value }))}
                  placeholder="Final assessment and recommendations..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} disabled={loading} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Notes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Communication Skills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Communication Skills
            </span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(data.communication_skills / 20) 
                        ? "text-warning fill-warning" 
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{data.communication_skills}%</span>
            </div>
          </div>
        </div>

        {/* HR Notes */}
        {data.hr_notes && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">HR Notes</span>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
              {data.hr_notes}
            </p>
          </div>
        )}

        {/* Final Remarks */}
        {data.final_remarks && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <ThumbsDown className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Final Remarks</span>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
              {data.final_remarks}
            </p>
          </div>
        )}

        {!data.hr_notes && !data.final_remarks && data.communication_skills === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No admin notes added yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}