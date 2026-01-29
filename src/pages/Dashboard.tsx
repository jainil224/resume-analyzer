import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
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
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, loading } = useDashboardData();

  // Get AI suggestions from most recent analysis
  const latestSuggestions = data?.recentAnalyses[0]?.ai_suggestions || [];

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
          <p className="text-muted-foreground">Here's your resume analytics overview.</p>
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
