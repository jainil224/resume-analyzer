import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Share2, Mail, MessageCircle, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ShareResumeDialogProps {
  candidateName: string;
  candidateEmail: string;
  resumeUrl?: string | null;
  suggestions?: string[];
}

export function ShareResumeDialog({ 
  candidateName, 
  candidateEmail, 
  resumeUrl, 
  suggestions = [] 
}: ShareResumeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const suggestionText = suggestions.length > 0 
    ? `\n\nResume Improvement Suggestions:\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
    : "";

  const emailSubject = `Resume Feedback for ${candidateName}`;
  const emailBody = `Dear ${candidateName},\n\nPlease find below the feedback and suggestions for improving your resume.${suggestionText}\n\nBest regards`;

  const whatsappMessage = `Hi ${candidateName}! Here's your resume feedback and suggestions:${suggestionText}`;

  const handleEmailShare = () => {
    const mailtoUrl = `mailto:${candidateEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');
    toast.success("Opening email client...");
  };

  const handleWhatsAppShare = () => {
    const phone = ""; // Could be passed as prop if available
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Opening WhatsApp...");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(resumeUrl || window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Resume & Feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Recipient</Label>
            <Input value={candidateEmail} readOnly className="bg-muted/50" />
          </div>

          <div className="space-y-2">
            <Label>Message Preview</Label>
            <Textarea 
              value={emailBody} 
              readOnly 
              rows={6}
              className="bg-muted/50 text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button onClick={handleEmailShare} variant="outline" className="flex-col h-20">
              <Mail className="w-5 h-5 mb-1" />
              <span className="text-xs">Email</span>
            </Button>
            <Button onClick={handleWhatsAppShare} variant="outline" className="flex-col h-20">
              <MessageCircle className="w-5 h-5 mb-1" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            <Button onClick={handleCopyLink} variant="outline" className="flex-col h-20">
              {copied ? (
                <CheckCircle className="w-5 h-5 mb-1 text-success" />
              ) : (
                <Copy className="w-5 h-5 mb-1" />
              )}
              <span className="text-xs">{copied ? "Copied!" : "Copy Link"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}