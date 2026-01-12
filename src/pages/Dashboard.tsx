import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";
import { HeroLamp } from "@/components/ui/hero-lamp";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ATSDistributionChart } from "@/components/dashboard/ATSDistributionChart";
import { SkillsChart } from "@/components/dashboard/SkillsChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SkillGapAnalysis } from "@/components/dashboard/SkillGapAnalysis";
import { ATSOptimizationTracker } from "@/components/dashboard/ATSOptimizationTracker";
import { KeywordAnalysis } from "@/components/dashboard/KeywordAnalysis";
import { AIRecommendations } from "@/components/dashboard/AIRecommendations";
import { UserProgressTracker } from "@/components/dashboard/UserProgressTracker";
import { ExportCenter } from "@/components/dashboard/ExportCenter";
import { SystemStatus } from "@/components/dashboard/SystemStatus";
import TrueFocus from "@/components/TrueFocus";
import { Sparkles, ArrowRight, FileText, Target, Shield, TrendingUp, Github, Linkedin } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading } = useDashboardData();

  const features = [
    { icon: Target, title: "Skill Matching", desc: "AI identifies matching & missing skills" },
    { icon: Shield, title: "ATS Optimized", desc: "Beat applicant tracking systems" },
    { icon: TrendingUp, title: "Smart Suggestions", desc: "Personalized improvement tips" },
  ];

  // Get AI suggestions from most recent analysis
  const latestSuggestions = data?.recentAnalyses[0]?.ai_suggestions || [];

  if (!user) {
    // Non-authenticated view - show landing content
    return (
      <HeroLamp className="min-h-[calc(100vh-120px)]">
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <TrueFocus 
              sentence="Welcome to Resume Analyzer"
              manualMode={false}
              blurAmount={4}
              borderColor="hsl(var(--primary))"
              glowColor="hsl(var(--primary) / 0.5)"
              animationDuration={0.5}
              pauseBetweenAnimations={1.5}
            />
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant AI-powered feedback on your resume. Optimize for ATS, match skills to job requirements, and land more interviews.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          {features.map((feature) => (
            <div key={feature.title} className="p-6 rounded-xl bg-card border border-border text-center">
              <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-3">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Button variant="hero" size="xl" onClick={() => navigate("/analyze")}>
            <FileText className="w-5 h-5" />
            Analyze Resume Now
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Footer */}
        <div className="mt-auto pt-8 text-center space-y-3 border-t border-border/50 pt-6">
          <div className="flex items-center justify-center gap-4">
            <motion.a 
              href="https://github.com/jainil224" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a 
              href="https://www.linkedin.com/in/jainil-patel-947b1a336/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 | Developed by <span className="font-semibold text-foreground">Jainil Patel</span>
          </p>
        </div>
      </div>
    </HeroLamp>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your resume analytics overview.</p>
        </div>
        <Button variant="hero" onClick={() => navigate("/analyze")}>
          <Sparkles className="w-4 h-4" />
          New Analysis
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <StatsCards
        totalResumes={data?.totalResumes || 0}
        analyzedResumes={data?.analyzedResumes || 0}
        totalCandidates={data?.totalResumes || 0}
        averageAtsScore={data?.averageAtsScore || 0}
        skillGapsDetected={data?.skillGapsDetected || 0}
      />

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <ATSDistributionChart distribution={data?.atsDistribution || { low: 0, medium: 0, high: 0 }} />
        <div className="lg:col-span-2">
          <SkillsChart
            topSkills={data?.topSkills || []}
            missingSkills={data?.missingSkills || []}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          <RecentActivity analyses={data?.recentAnalyses || []} />
          <AIRecommendations suggestions={latestSuggestions} />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <SkillGapAnalysis
            missingSkills={data?.missingSkills || []}
            totalAnalyses={data?.totalResumes || 0}
          />
          <ATSOptimizationTracker
            averageAtsScore={data?.averageAtsScore || 0}
            totalAnalyses={data?.totalResumes || 0}
            atsDistribution={data?.atsDistribution || { low: 0, medium: 0, high: 0 }}
          />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KeywordAnalysis
          usedKeywords={data?.keywordStats?.used || []}
          missingKeywords={data?.keywordStats?.missing || []}
        />
        <UserProgressTracker
          profileCompletion={data?.progressStats?.profileCompletion || 0}
          resumeStrength={data?.progressStats?.resumeStrength || 0}
          skillsImprovement={data?.progressStats?.skillsImprovement || 0}
        />
        <ExportCenter />
        <SystemStatus totalAnalyses={data?.totalResumes || 0} />
      </div>
    </div>
  );
}
