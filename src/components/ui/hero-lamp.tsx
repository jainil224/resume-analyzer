"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HeroLampProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean
  blur?: boolean
  children?: React.ReactNode
}

const HeroLamp = React.forwardRef<HTMLDivElement, HeroLampProps>(
  ({ className, gradient = true, blur = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex min-h-[40vh] w-full flex-col items-center justify-center overflow-hidden",
          className
        )}
        {...props}
      >
        {gradient && (
          <div className="absolute inset-0 overflow-hidden">
            {blur && (
              <div className="pointer-events-none absolute inset-0 z-10 backdrop-blur-[1px]" />
            )}

            {/* Main glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute left-1/2 top-0 z-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]"
            />

            {/* Lamp effect */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="absolute left-1/2 top-0 z-0 h-px w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
            />

            {/* Top line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="absolute left-1/2 top-0 z-0 h-[2px] w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/80 to-transparent"
            />

            {/* Left gradient cone */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="absolute left-1/2 top-0 z-0 h-full w-[40%] -translate-x-full skew-x-[20deg] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
            </motion.div>

            {/* Right gradient cone */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="absolute right-1/2 top-0 z-0 h-full w-[40%] translate-x-full -skew-x-[20deg] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/5" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
            </motion.div>
          </div>
        )}

        <div className="relative z-20 w-full">{children}</div>
      </div>
    )
  }
)
HeroLamp.displayName = "HeroLamp"

export { HeroLamp }
