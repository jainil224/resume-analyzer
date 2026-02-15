import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileText,
  MessageSquare,
  BarChart,
  History,
  Share2,
  Moon,
  ChevronRight,
  ChevronLeft,
  X,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface TourStep {
  id: string;
  targetId: string;
  title: string;
  message: string;
  icon: React.ElementType;
}

// Configuration
const STEPS: TourStep[] = [
  {
    id: "analyze",
    targetId: "tour-analyze-btn",
    title: "Analyze Your Resume",
    message: "Upload your resume and get instant AI-powered feedback. Optimize for ATS systems and improve your interview chances.",
    icon: FileText
  },
  {
    id: "chatbot",
    targetId: "tour-ai-chatbot",
    title: "AI Career Assistant",
    message: "Ask questions, receive improvement suggestions, and get personalized career guidance in real time.",
    icon: MessageSquare
  },
  {
    id: "results",
    targetId: "tour-results-section", // Might be missing
    title: "Detailed Resume Insights",
    message: "Review skill matching scores, ATS optimization results, and actionable recommendations.",
    icon: BarChart
  },
  {
    id: "history",
    targetId: "tour-history-link",
    title: "Track Your Progress",
    message: "Access previous analyses and monitor improvements over time.",
    icon: History
  },
  {
    id: "share",
    targetId: "tour-share-btn", // Might be missing
    title: "Share Your Report",
    message: "Generate a shareable link or export your analysis to collaborate with others.",
    icon: Share2
  },
  {
    id: "theme",
    targetId: "tour-theme-toggle",
    title: "Switch Display Mode",
    message: "Toggle between light and dark mode for a personalized experience.",
    icon: Moon
  }
];

const TOUR_KEY = "resume-analyzer-onboarding-completed-v2";

export function OnboardingTour() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isSkippingStep, setIsSkippingStep] = useState(false);

  // Initialize
  useEffect(() => {
    const isCompleted = localStorage.getItem(TOUR_KEY);
    if (!isCompleted) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Helpers
  const currentStep = useMemo(() => STEPS[currentStepIndex], [currentStepIndex]);

  const updateTargetPosition = useCallback(() => {
    if (!isVisible || !currentStep) return;

    const element = document.getElementById(currentStep.targetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      setIsSkippingStep(false);
    } else {
      // If target not found, we should probably skip this step
      console.warn(`Tour target #${currentStep.targetId} not found, scheduling skip.`);
      setIsSkippingStep(true);
    }
  }, [isVisible, currentStep]);

  // Effect: Handle step changes and retries for missing elements
  useEffect(() => {
    if (!isVisible) return;

    // Try to find target
    updateTargetPosition();

    // Add resize/scroll listeners
    window.addEventListener("resize", updateTargetPosition);
    window.addEventListener("scroll", updateTargetPosition, true);

    return () => {
      window.removeEventListener("resize", updateTargetPosition);
      window.removeEventListener("scroll", updateTargetPosition, true);
    };
  }, [currentStepIndex, isVisible, updateTargetPosition]);

  // Effect: Auto-skip if target is missing
  useEffect(() => {
    if (isSkippingStep && isVisible) {
      // If it's the last step and missing, just finish. 
      // Otherwise go next.
      // Prevent infinite loop if all missing by using a timeout or check
      const timer = setTimeout(() => {
        handleNext();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isSkippingStep, isVisible]);

  // Handlers
  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem(TOUR_KEY, "true");
  };

  const handleSkip = () => {
    handleComplete();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleComplete();
      if (e.key === "Enter") handleNext();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, currentStepIndex]);

  if (!isVisible) return null;

  // Don't render anything if we're in the middle of skipping/finding
  if (!targetRect && !isSkippingStep && isVisible) {
    // Just return null or a loader? 
    // Actually if rect is null, we might be initialization state
    return null;
  }

  // If we are "skipping", render nothing or keep previous?
  // Use `isSkippingStep` to hide UI momentarily
  if (isSkippingStep) return null;

  // Calculate Tooltip Position
  // We want to place it near the highlight, but keep it on screen
  const getTooltipPosition = () => {
    if (!targetRect) return {};

    const spacing = 20;
    const tooltipWidth = 380; // Approximate
    const tooltipHeight = 250; // Approximate

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let styles: any = {};

    // Default: Bottom Center
    let top = targetRect.bottom + spacing;
    let left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);

    // Check bottom edge
    if (top + tooltipHeight > viewportHeight) {
      // Flip to top
      top = targetRect.top - tooltipHeight - spacing;
    }

    // Check right edge
    if (left + tooltipWidth > viewportWidth) {
      left = viewportWidth - tooltipWidth - spacing;
    }

    // Check left edge
    if (left < spacing) {
      left = spacing;
    }

    // Check top edge (if flipped to top and still clipping)
    if (top < spacing) {
      // Fallback to center or side?
      // Let's try side if top/bottom fail?
      // For now, pin to top spacing
      top = spacing;
    }

    return { top, left };
  };

  const tooltipPos = getTooltipPosition();

  return (
    <AnimatePresence>
      {isVisible && targetRect && (
        <motion.div
          key="tour-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-hidden"
        // Start blocking clicks
        >
          {/* 
            Spotlight Effect:
            We use a single div with a HUGE box-shadow to create the dark overlay,
            leaving the center transparent (the spotlight).
          */}
          <motion.div
            className="absolute rounded-lg transition-all duration-500 ease-in-out"
            style={{
              top: targetRect.top - 4, // Padding
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.75)",
              // Neon glow around the target
              borderRadius: "12px", // Consistent rounded corners
            }}
            initial={false}
            animate={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 30
            }}
          >
            {/* Optional: Add a pulsing border to the spotlight for extra "focus" */}
            <div className="absolute inset-0 rounded-xl border-2 border-primary/50 animate-pulse box-border pointer-events-none" />
          </motion.div>

          {/* Tooltip Card */}
          <motion.div
            key={`step-${currentStepIndex}`}
            className="absolute z-[101]"
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              width: 380,
              maxWidth: "calc(100vw - 32px)"
            }}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className="p-6 shadow-2xl border-border/50 bg-background/95 backdrop-blur-md">
              {/* Header: Icon + Title + Close */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <currentStep.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{currentStep.title}</h3>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Close tour"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="mb-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {currentStep.message}
                </p>
              </div>

              {/* Footer: Progress + Buttons */}
              <div className="flex items-center justify-between mt-auto">

                {/* Progress Indicator */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    {currentStepIndex + 1} / {STEPS.length}
                  </span>
                  {/* Dots */}
                  <div className="flex gap-1 ml-2">
                    {STEPS.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-colors",
                          idx === currentStepIndex ? "bg-primary" : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    disabled={currentStepIndex === 0}
                    className="text-muted-foreground h-8 px-2"
                  >
                    Back
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-8 px-4 gap-1.5"
                  >
                    {currentStepIndex === STEPS.length - 1 ? "Finish" : "Next"}
                    {currentStepIndex < STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
