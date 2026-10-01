import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tabular [&_svg]:size-3",
  {
    variants: {
      tone: {
        neutral: "border-line-strong text-text-2",
        accent: "border-accent/40 bg-accent/10 text-accent",
        ok: "border-accent-2/40 bg-accent-2/10 text-accent-2",
        warn: "border-warn/40 bg-warn/10 text-warn",
        danger: "border-danger/40 bg-danger/10 text-danger",
        inspection: "border-inspection/40 bg-inspection/10 text-inspection",
        enhancement: "border-enhancement/40 bg-enhancement/10 text-enhancement",
        human: "border-human/40 bg-human/10 text-human",
      },
      mono: { true: "font-mono", false: "" },
    },
    defaultVariants: { tone: "neutral", mono: false },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, mono, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, mono }), className)} {...props} />;
}

export { Badge, badgeVariants };
