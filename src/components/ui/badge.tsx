import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-950",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/5 text-slate-300",
        secondary: "border-white/10 bg-white/5 text-slate-400",
        destructive: "border-rose-500/30 bg-rose-500/10 text-rose-400",
        outline: "border-white/20 bg-transparent text-slate-300",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        accent: "border-violet-500/30 bg-violet-500/10 text-violet-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };