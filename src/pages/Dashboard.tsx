import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { FileText, History, Users, Sparkles, Target, Shield, TrendingUp, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const quickActions = [
    {
      title: "Analyze Resume",
      description: "Get AI-powered feedback on your resume",
      icon: FileText,
      action: () => navigate("/analyze"),
      primary: true,
    },
    {
      title: "View History",
      description: "See your past analyses",
      icon: History,
      action: () => navigate("/history"),
      disabled: !user,
    },
    {
      title: "Compare Resumes",
      description: "Compare multiple resume analyses",
      icon: Users,
      action: () => navigate("/compare"),
      disabled: !user,
    },
  ];

  const features = [
    { icon: Target, title: "Skill Matching", desc: "AI identifies matching & missing skills" },
    { icon: Shield, title: "ATS Optimized", desc: "Beat applicant tracking systems" },
    { icon: TrendingUp, title: "Smart Suggestions", desc: "Personalized improvement tips" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <Badge variant="ai" className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" />Powered by Gemini AI
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
          Welcome to <span className="text-gradient">ResumeAI</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get instant AI-powered feedback on your resume. Optimize for ATS, match skills to job requirements, and land more interviews.
        </p>
        {!user && (
          <p className="text-sm text-muted-foreground mt-2">
            <button onClick={() => navigate("/auth")} className="text-accent hover:underline">
              Sign in
            </button>{" "}
            to save your analysis history and compare resumes.
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid md:grid-cols-3 gap-4 mb-12"
      >
        {features.map((feature) => (
          <Card key={feature.title} variant="glass" className="p-4 text-center">
            <div className="inline-flex p-3 bg-accent/10 rounded-xl mb-3">
              <feature.icon className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </Card>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
      >
        {quickActions.map((action) => (
          <Card
            key={action.title}
            variant={action.primary ? "elevated" : "default"}
            className={`cursor-pointer transition-all hover:shadow-lg ${action.disabled ? "opacity-50" : ""}`}
            onClick={action.disabled ? undefined : action.action}
          >
            <CardHeader>
              <div className={`inline-flex p-3 rounded-xl mb-2 ${action.primary ? "bg-accent-gradient" : "bg-accent/10"}`}>
                <action.icon className={`w-6 h-6 ${action.primary ? "text-accent-foreground" : "text-accent"}`} />
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant={action.primary ? "hero" : "outline"}
                className="w-full"
                disabled={action.disabled}
              >
                {action.primary && <Sparkles className="w-4 h-4" />}
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              {action.disabled && (
                <p className="text-xs text-muted-foreground mt-2 text-center">Sign in required</p>
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="text-center text-sm text-muted-foreground">
          <p>AI Resume Analyzer • Powered by Gemini Flash</p>
        </div>
      </footer>
    </div>
  );
}
