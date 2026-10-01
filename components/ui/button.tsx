import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 min-w-11 select-none items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-btn)] font-medium transition-[filter,transform,background-color,border-color,color] duration-150 ease-[var(--ease-out-expo)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-ink hover:-translate-y-px hover:brightness-110 active:translate-y-0",
        secondary:
          "border border-line-strong bg-transparent text-text-1 hover:-translate-y-px hover:border-accent/60 hover:bg-bg-2",
        ghost: "text-text-2 hover:bg-bg-2 hover:text-text-1",
        link: "min-h-0 min-w-0 px-0 text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-11 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
