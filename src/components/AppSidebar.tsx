import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, History } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ThemeLogo } from "@/components/ThemeLogo";
import { useAnalyzing } from "@/contexts/AnalyzingContext";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Resume Analyzer", url: "/analyze", icon: FileText },
  { title: "History", url: "/history", icon: History },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { isAnalyzing } = useAnalyzing();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Logo Section */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <ThemeLogo size="md" isProcessing={isAnalyzing} />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">
                Resume Analyzer
              </span>
              <span className="text-xs text-muted-foreground">
                AI-Powered Analysis
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    tooltip={item.title}
                    className={cn(
                      "transition-all duration-200",
                      isActive(item.url) &&
                        "bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-l-2 border-primary"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors",
                      isActive(item.url) ? "text-primary" : "text-muted-foreground"
                    )} />
                    {!collapsed && (
                      <span className={cn(
                        "font-medium",
                        isActive(item.url) ? "text-primary" : "text-foreground"
                      )}>
                        {item.title}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
