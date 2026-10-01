import { cn } from "@/lib/utils";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function Section({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn("relative py-20 md:py-28", className)} {...props} />;
}

/** Eyebrow label in mono with a leading tick — reads like an instrument channel label. */
export function Eyebrow({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-accent" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
  className,
  id,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="mt-4 text-[32px] font-semibold leading-tight text-text-1 md:text-[48px]">
        {title}
      </h2>
      {desc && <p className="mt-4 text-base text-text-2 md:text-lg">{desc}</p>}
    </div>
  );
}

/** Faint engineering grid with edge rulers. Place inside a `relative` parent. */
export function GridBackdrop({ className, rulers = true }: { className?: string; rulers?: boolean }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_80%)]" />
      {rulers && (
        <>
          <div className="ruler-x absolute inset-x-0 top-0 h-2" />
          <div className="ruler-y absolute inset-y-0 left-0 w-2" />
        </>
      )}
    </div>
  );
}
