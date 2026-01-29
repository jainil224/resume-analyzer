import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Analysis {
  id: string;
  resume_name: string;
  job_title: string | null;
  overall_score: number;
  skills_match: number;
  experience_score: number;
  ats_score: number;
  formatting_score: number;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  ai_suggestions: string[];
  created_at: string;
}

interface DashboardStats {
  totalResumes: number;
  analyzedResumes: number;
  averageAtsScore: number;
  skillGapsDetected: number;
  atsDistribution: { low: number; medium: number; high: number };
  topSkills: { name: string; count: number }[];
  missingSkills: { name: string; count: number }[];
  topJobDomains: { name: string; count: number }[];
  recentAnalyses: Analysis[];
  keywordStats: { used: string[]; missing: string[] };
  progressStats: { profileCompletion: number; resumeStrength: number; skillsImprovement: number };
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: analyses, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const allAnalyses = analyses || [];
      
      // Calculate stats
      const totalResumes = allAnalyses.length;
      const analyzedResumes = allAnalyses.length;
      const averageAtsScore = totalResumes > 0 
        ? Math.round(allAnalyses.reduce((acc, a) => acc + a.ats_score, 0) / totalResumes)
        : 0;

      // Count all missing skills
      const allMissingSkills = allAnalyses.flatMap(a => a.missing_skills || []);
      const skillGapsDetected = new Set(allMissingSkills).size;

      // ATS Distribution (based on overall_score)
      const atsDistribution = {
        low: allAnalyses.filter(a => a.overall_score < 50).length,
        medium: allAnalyses.filter(a => a.overall_score >= 50 && a.overall_score < 75).length,
        high: allAnalyses.filter(a => a.overall_score >= 75).length,
      };

      // Top matched skills
      const matchedSkillsCount: Record<string, number> = {};
      allAnalyses.forEach(a => {
        (a.matched_skills || []).forEach(skill => {
          matchedSkillsCount[skill] = (matchedSkillsCount[skill] || 0) + 1;
        });
      });
      const topSkills = Object.entries(matchedSkillsCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      // Most missing skills
      const missingSkillsCount: Record<string, number> = {};
      allAnalyses.forEach(a => {
        (a.missing_skills || []).forEach(skill => {
          missingSkillsCount[skill] = (missingSkillsCount[skill] || 0) + 1;
        });
      });
      const missingSkills = Object.entries(missingSkillsCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      // Top job domains
      const jobTitleCount: Record<string, number> = {};
      allAnalyses.forEach(a => {
        if (a.job_title) {
          const domain = a.job_title.split(" ").slice(-2).join(" ");
          jobTitleCount[domain] = (jobTitleCount[domain] || 0) + 1;
        }
      });
      const topJobDomains = Object.entries(jobTitleCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Recent analyses
      const recentAnalyses = allAnalyses.slice(0, 5);

      // Keyword stats (from most recent analysis)
      const latestAnalysis = allAnalyses[0];
      const keywordStats = {
        used: latestAnalysis?.matched_skills?.slice(0, 6) || [],
        missing: latestAnalysis?.missing_skills?.slice(0, 6) || [],
      };

      // Progress stats
      const progressStats = {
        profileCompletion: 85,
        resumeStrength: averageAtsScore > 0 ? Math.min(averageAtsScore * 5, 100) : 0,
        skillsImprovement: totalResumes > 1 
          ? Math.max(0, allAnalyses[0]?.overall_score - allAnalyses[allAnalyses.length - 1]?.overall_score)
          : 0,
      };

      setData({
        totalResumes,
        analyzedResumes,
        averageAtsScore,
        skillGapsDetected,
        atsDistribution,
        topSkills,
        missingSkills,
        topJobDomains,
        recentAnalyses,
        keywordStats,
        progressStats,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, refetch: fetchDashboardData };
}
