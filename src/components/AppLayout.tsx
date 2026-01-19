import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShareButtons } from "@/components/ShareButtons";
import { Zap } from "lucide-react";
import { Robot3DChatbot } from "@/components/Robot3DChatbot";
import { ThemeLogo } from "@/components/ThemeLogo";
import { useAnalyzing } from "@/contexts/AnalyzingContext";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAnalyzing } = useAnalyzing();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <ThemeLogo size="sm" isProcessing={isAnalyzing} />
                  <span className="font-bold text-lg hidden sm:inline">Resume Analyzer</span>
                  <Badge variant="ai" className="hidden md:flex">
                    <Zap className="w-3 h-3 mr-1" />AI Powered
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShareButtons showExport={false} />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        <Robot3DChatbot />
      </div>
    </SidebarProvider>
  );
}
