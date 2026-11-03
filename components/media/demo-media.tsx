"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MEDIA, type MediaKey } from "@/content/media";

/**
 * Real demo footage. Videos are muted / inline / looped and only play while on screen;
 * under reduced motion the poster is shown with native controls instead.
 */
export function DemoMedia({
  media,
  label,
  className,
  fit,
  controls = false,
}: {
  media: MediaKey;
  label?: string;
  className?: string;
  fit?: "cover" | "contain";
  controls?: boolean;
}) {
  const m = MEDIA[media];
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, media]);

  // ultra-wide clips (side-by-side comparisons) are letterboxed rather than cropped
  const [aw, ah] = m.aspect.split("/").map(Number);
  const fitClass = (fit ?? (aw / ah > 2 ? "contain" : "cover")) === "cover" ? "object-cover" : "object-contain";

  return (
    <div className={cn("relative overflow-hidden bg-black", className)}>
      {m.kind === "video" ? (
        <video
          key={m.src}
          ref={ref}
          src={m.src}
          poster={m.poster}
          muted
          loop
          playsInline
          preload="metadata"
          controls={controls || !!reduce}
          aria-label={label}
          className={cn("absolute inset-0 size-full", fitClass)}
        />
      ) : (
        <>
          {/* portrait stills sit on a blurred copy of themselves so any frame shape works */}
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative backdrop */}
          <img src={m.src} alt="" aria-hidden loading="lazy" className="absolute inset-0 size-full scale-110 object-cover opacity-50 blur-2xl" />
          {/* eslint-disable-next-line @next/next/no-img-element -- GIF, no optimization wanted */}
          <img src={m.src} alt={label ?? ""} loading="lazy" className="absolute inset-0 size-full object-contain" />
        </>
      )}
      {label && (
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#07090c]/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur">
          <span className="size-1.5 animate-[blink_1.6s_steps(1)_infinite] rounded-full bg-danger" aria-hidden />
          {label}
        </span>
      )}
    </div>
  );
}
