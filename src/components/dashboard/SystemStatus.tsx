import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Upload, Server } from "lucide-react";

interface SystemStatusProps {
  totalAnalyses: number;
}

export function SystemStatus({ totalAnalyses }: SystemStatusProps) {
  const statusItems = [
    {
      label: "Active Users",
      value: "1",
      icon: Users,
      status: "online",
    },
    {
      label: "Today's Uploads",
      value: String(totalAnalyses),
      icon: Upload,
      status: "online",
    },
    {
      label: "Analyzer Status",
      value: "Online",
      icon: Server,
      status: "online",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-success" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statusItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.value}</span>
                  <Badge
                    variant="secondary"
                    className={
                      item.status === "online"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
