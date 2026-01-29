import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  Target, 
  TrendingUp, 
  History, 
  Bot, 
  ChevronRight, 
  ChevronLeft,
  X,
  Sparkles
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  position: "center" | "bottom-right" | "top-left";
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Resume Analyzer! 🎉",
    description: "Let's take a quick tour to help you get started with our AI-powered resume analysis platform.",
    icon: Sparkles,
    position: "center"
  },
  {
    id: "analyze",
    title: "Analyze Your Resume",
    description: "Upload your resume and job description to get instant AI-powered feedback on how well they match.",
    icon: FileText,
    position: "center"
  },
  {
    id: "skills",
    title: "Skill Matching",
    description: "Our AI identifies matching skills and highlights missing ones to help you tailor your resume perfectly.",
    icon: Target,
    position: "center"
  },
  {
    id: "ats",
    title: "ATS Optimization",
    description: "Get your resume optimized for Applicant Tracking Systems to increase your chances of landing interviews.",
    icon: TrendingUp,
    position: "center"
  },
  {
    id: "history",
    title: "Download History",
    description: "Access all your previously generated PDF reports anytime from the History section.",
    icon: History,
    position: "center"
  },
  {
    id: "assistant",
    title: "AI Assistant",
    description: "Click the robot avatar in the bottom-right corner anytime to chat with our AI career expert!",
    icon: Bot,
    position: "center"
  }
];

const TOUR_COMPLETED_KEY = "resume-analyzer-tour-completed";

export function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
    if (!tourCompleted) {
      // Delay showing the tour to let the app load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    setIsVisible(false);
  };

  const skipTour = () => {
    completeTour();
  };

  const step = tourSteps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === tourSteps.length - 1;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={skipTour}
        />

        {/* Spotlight for bottom-right position (AI assistant hint) */}
        {step.position === "bottom-right" && (
          <motion.div
            className="absolute bottom-6 right-6 w-24 h-24 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "radial-gradient(circle, transparent 30%, rgba(0,0,0,0.6) 70%)",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)"
            }}
          />
        )}

        {/* Tour Card */}
        <motion.div
          key={step.id}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`relative z-10 ${step.position === "bottom-right" ? "mb-32 mr-32" : ""}`}
        >
          <Card className="w-[400px] max-w-[90vw] p-6 shadow-2xl border-primary/20 bg-card/95 backdrop-blur-md">
            {/* Close button */}
            <button
              onClick={skipTour}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Skip tour"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            >
              <Icon className="w-8 h-8 text-primary-foreground" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-center mb-6"
            >
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {tourSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentStep 
                      ? "bg-primary" 
                      : index < currentStep 
                        ? "bg-primary/50" 
                        : "bg-muted"
                  }`}
                  animate={{
                    scale: index === currentStep ? [1, 1.3, 1] : 1
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: index === currentStep ? Infinity : 0,
                    repeatDelay: 1
                  }}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <span className="text-sm text-muted-foreground">
                {currentStep + 1} / {tourSteps.length}
              </span>

              <Button onClick={handleNext} className="gap-1">
                {isLastStep ? "Get Started" : "Next"}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>

            {/* Skip link */}
            {!isLastStep && (
              <button
                onClick={skipTour}
                className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip tour
              </button>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Export function to reset tour (for testing or settings)
export function resetOnboardingTour() {
  localStorage.removeItem(TOUR_COMPLETED_KEY);
}
