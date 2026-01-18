import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function AppLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Skeleton */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                className="flex items-center gap-3 p-3"
              >
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-20" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center mb-12"
          >
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-5 w-80 mx-auto" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-4 mb-12"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.35 + i * 0.1 }}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <div className="flex flex-col items-center">
                  <Skeleton className="h-12 w-12 rounded-xl mb-3" />
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex justify-center"
          >
            <Skeleton className="h-14 w-52 rounded-xl" />
          </motion.div>
        </div>
      </div>

      {/* Pulsing animation overlay */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
