"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Horizontal 5-step pipeline that lights up step by step as the section scrolls through the viewport
 * (GSAP ScrollTrigger). Desktop pins the section briefly; reduced motion shows all steps lit.
 */
export function HowItWorks({ steps }: { steps: { title: string; desc: string }[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(steps.length - 1);
      return;
    }
    let cleanup = () => {};
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: desktop ? "center center" : "top 75%",
        end: desktop ? "+=520" : "bottom 40%",
        pin: desktop,
        scrub: true,
        onUpdate: (self) => {
          setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)));
        },
        onLeave: () => setActive(steps.length - 1),
      });
      cleanup = () => st.kill();
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [steps.length]);

  return (
    <div ref={sectionRef} className="py-4">
      <ol className="relative grid gap-4 lg:grid-cols-5 lg:gap-0">
        {/* progress rail */}
        <div aria-hidden className="absolute left-0 right-0 top-[27px] hidden h-px bg-line lg:block">
          <div
            className="h-full bg-accent shadow-[0_0_8px_var(--accent)] transition-[width] duration-300"
            style={{ width: `${active < 0 ? 0 : ((active + 0.5) / steps.length) * 100}%` }}
          />
        </div>
        {steps.map((s, i) => {
          const lit = i <= active;
          return (
            <li key={s.title} className="relative flex gap-4 lg:flex-col lg:px-4 lg:first:pl-0">
              <span
                className={cn(
                  "relative z-10 grid size-14 shrink-0 place-items-center rounded-xl border font-mono text-sm transition-all duration-300",
                  lit
                    ? "border-accent bg-accent/10 text-accent shadow-[0_0_24px_-6px_var(--accent)]"
                    : "border-line bg-bg-1 text-text-3",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="lg:mt-5">
                <span className={cn("block text-base font-semibold transition-colors", lit ? "text-text-1" : "text-text-3")}>
                  {s.title}
                </span>
                <span className={cn("mt-1 block text-sm transition-colors", lit ? "text-text-2" : "text-text-3")}>{s.desc}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
