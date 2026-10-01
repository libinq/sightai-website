import { cn } from "@/lib/utils";

/** SightAI wordmark: an aperture inside detection-frame corners. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
        <path
          d="M2 9V2h7M19 2h7v7M26 19v7h-7M9 26H2v-7"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        />
        <circle cx="14" cy="14" r="6" fill="none" stroke="var(--text-1)" strokeWidth="2" />
        <circle cx="14" cy="14" r="2" fill="var(--accent)" />
      </svg>
      <span className="font-display text-[19px] font-semibold tracking-tight text-text-1">
        Sight<span className="text-accent">AI</span>
      </span>
    </span>
  );
}
