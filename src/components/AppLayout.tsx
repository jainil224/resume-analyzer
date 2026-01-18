import { ReactNode } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShareButtons } from "@/components/ShareButtons";
import { Zap } from "lucide-react";
import { Robot3DChatbot } from "@/components/Robot3DChatbot";
import logoImage from "@/assets/logo.png";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {

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
                  <motion.div 
                    className="w-8 h-8 flex-shrink-0"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <motion.img 
                      src={logoImage} 
                      alt="RA Logo" 
                      className="w-full h-full object-contain dark:invert transition-all duration-300"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </motion.div>
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
