import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";

const cardVariants = cva(
  "rounded-2xl border text-card-foreground",
  {
    variants: {
      variant: {
        default: "bg-card shadow-card",
        elevated: "bg-card shadow-xl border-0",
        outline: "bg-transparent border-2",
        glass: "bg-card/80 backdrop-blur-sm border-border/50",
        accent: "bg-card shadow-card border-accent/20 hover:border-accent/40 transition-colors",
        "gradient-underline": "bg-card shadow-card group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> { }

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    >
      {children}
      {variant === "gradient-underline" && (
        <>
          <BorderBeam
            size={300}
            duration={8}
            colorFrom="#ef4444" // red-500
            colorTo="#ef4444"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          <BorderBeam
            size={300}
            duration={8}
            delay={-4} // Negative delay to start immediately at 50% offset
            borderWidth={2}
            colorFrom="#3b82f6" // blue-500
            colorTo="#3b82f6"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        </>
      )}
    </div>
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-bold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
