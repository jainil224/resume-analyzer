import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Share2, FileDown } from "lucide-react";
import { toast } from "sonner";

export function ExportCenter() {
  const handleExport = (type: string) => {
    toast.success(`${type} export started. This feature will be available soon!`);
  };

  const exportOptions = [
    {
      title: "Download Resume",
      description: "Get optimized resume",
      icon: FileText,
      action: () => handleExport("Resume"),
    },
    {
      title: "Export Reports",
      description: "ATS reports as PDF",
      icon: FileDown,
      action: () => handleExport("Report"),
    },
    {
      title: "Share Results",
      description: "Share with others",
      icon: Share2,
      action: () => handleExport("Share"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exportOptions.map((option) => (
              <Button
                key={option.title}
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={option.action}
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <option.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{option.title}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
