import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, History } from "lucide-react";
import { motion } from "framer-motion";
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
import logoImage from "@/assets/logo.png";

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Logo Section */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <motion.div 
            className="relative w-10 h-10 flex-shrink-0"
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
