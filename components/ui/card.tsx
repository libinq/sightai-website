import * as React from "react";
import { cn } from "@/lib/utils";

/** Bounding-box corner marks — appear on hover / focus-within of the nearest `.group`. */
export function BboxCorners({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <i className="bbox-corner" data-pos="tl" />
      <i className="bbox-corner" data-pos="tr" />
      <i className="bbox-corner" data-pos="bl" />
      <i className="bbox-corner" data-pos="br" />
    </span>
  );
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** show detection-frame corner marks on hover */
  interactive?: boolean;
}

function Card({ className, interactive = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[var(--radius-card)] border border-line bg-bg-1",
        interactive &&
          "group transition-colors duration-150 focus-within:border-line-strong hover:border-line-strong",
        className,
      )}
      {...props}
    >
      {interactive && <BboxCorners />}
      {children}
    </div>
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2 p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-text-1", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-text-2", className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-3 border-t border-line px-6 py-4", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
