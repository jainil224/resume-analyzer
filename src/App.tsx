import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AIAssistant } from "@/components/AIAssistant";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Auth from "./pages/Auth";
import History from "./pages/History";
import Candidates from "./pages/Candidates";
import CandidateProfile from "./pages/CandidateProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const hideAssistant = location.pathname === "/auth";
  const hideLayout = location.pathname === "/auth";

  if (hideLayout) {
    return (
      <>
        <Routes>
          <Route path="/auth" element={<Auth />} />
        </Routes>
        {!hideAssistant && <AIAssistant />}
      </>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/history" element={<History />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidates/:id" element={<CandidateProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideAssistant && <AIAssistant />}
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
