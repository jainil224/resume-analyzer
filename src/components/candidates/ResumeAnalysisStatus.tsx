import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

type AnalysisStatus = "pending" | "analyzed" | "failed" | "processing";

interface ResumeAnalysisStatusProps {
  status: string;
  className?: string;
}

const statusConfig: Record<AnalysisStatus, { icon: typeof CheckCircle; label: string; className: string }> = {
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20"
  },
  analyzed: {
    icon: CheckCircle,
    label: "Analyzed",
    className: "bg-success/10 text-success border-success/20"
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "bg-destructive/10 text-destructive border-destructive/20"
  },
  processing: {
    icon: AlertCircle,
    label: "Processing",
    className: "bg-primary/10 text-primary border-primary/20"
  }
};

export function ResumeAnalysisStatus({ status, className = "" }: ResumeAnalysisStatusProps) {
  const config = statusConfig[status as AnalysisStatus] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}