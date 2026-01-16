import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Share2, 
  Twitter, 
  Linkedin, 
  Link2, 
  FileDown,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ShareButtonsProps {
  score?: number;
  onExportPDF?: () => void;
  showExport?: boolean;
}

export function ShareButtons({ score, onExportPDF, showExport = true }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;
  const shareTitle = "Resume Analyzer - AI-Powered Resume Analysis";
  const shareText = score 
    ? `I just analyzed my resume and got a score of ${score}/100! Check out this AI-powered resume analyzer.`
    : "Check out this AI-powered resume analyzer that helps optimize your resume for ATS systems!";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error("Failed to share");
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showExport && onExportPDF && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportPDF}
            className="gap-2 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 hover:border-accent/40 hover:bg-accent/20"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </Button>
        </motion.div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer gap-2">
            <Twitter className="w-4 h-4 text-[#1DA1F2]" />
            Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLinkedInShare} className="cursor-pointer gap-2">
            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
            Share on LinkedIn
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer gap-2">
            {copied ? (
              <>
                <Check className="w-4 h-4 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                Copy Link
              </>
            )}
          </DropdownMenuItem>
          {navigator.share && (
            <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer gap-2">
              <Share2 className="w-4 h-4" />
              More Options...
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
