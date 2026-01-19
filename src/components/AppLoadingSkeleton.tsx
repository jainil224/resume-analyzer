import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import logo from "@/assets/logo.png";

export function AppLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Centered Logo with Loading Animation */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div
            className="relative"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <img 
              src={logo} 
              alt="Resume Analyzer" 
              className="w-20 h-20 object-contain relative z-10 dark:invert"
            />
          </motion.div>
          
          {/* Brand Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">Resume Analyzer</h1>
            <p className="text-sm text-muted-foreground">AI-Powered Resume Analysis</p>
          </motion.div>

          {/* Loading Dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-primary"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background skeleton layout (faded) */}
      <div className="opacity-30">
        {/* Header Skeleton */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-16 border-b border-border flex items-center justify-between px-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </motion.div>

        <div className="flex flex-1">
          {/* Sidebar Skeleton */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden md:flex w-64 border-r border-border flex-col p-4 gap-4"
          >
            <div className="flex items-center gap-3 p-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Skeleton */}
          <div className="flex-1 p-6">
            <div className="text-center mb-12">
              <Skeleton className="h-12 w-96 mx-auto mb-4" />
              <Skeleton className="h-5 w-80 mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 rounded-xl border border-border bg-card">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-12 w-12 rounded-xl mb-3" />
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Skeleton className="h-14 w-52 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
