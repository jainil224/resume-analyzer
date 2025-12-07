import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Brain, Zap, LogIn, LogOut } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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
                  <div className="p-2 bg-accent-gradient rounded-lg">
                    <Brain className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="font-bold text-lg">ResumeAI</span>
                  <Badge variant="ai" className="hidden sm:flex">
                    <Zap className="w-3 h-3 mr-1" />AI Powered
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!authLoading && (
                  user ? (
                    <Button variant="ghost" onClick={() => signOut()}>
                      <LogOut className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => navigate("/auth")}>
                      <LogIn className="w-4 h-4 mr-2" />Sign In
                    </Button>
                  )
                )}
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
