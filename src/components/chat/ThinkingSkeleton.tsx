import { motion } from "framer-motion";

export function ThinkingSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-1">
      <div className="flex items-center gap-1">
        <span className="text-sm text-foreground/50 font-medium animate-pulse">Thinking</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm text-foreground/50"
        >
          ...
        </motion.span>
      </div>
      <div className="space-y-2">
        <motion.div 
          className="h-4 bg-foreground/10 rounded-md w-3/4"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />
        <motion.div 
          className="h-4 bg-foreground/10 rounded-md w-1/2"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div 
          className="h-4 bg-foreground/10 rounded-md w-full"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
}
