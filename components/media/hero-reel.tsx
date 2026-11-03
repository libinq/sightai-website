"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { getCapability, pick } from "@/content/industries";
import { posterOf, type MediaKey } from "@/content/media";
import { cn } from "@/lib/utils";
import { DemoMedia } from "./demo-media";

/** Hero monitor: cycles through real deployment footage. */
const REEL: { media: MediaKey; capability: string }[] = [
  { media: "roadDefect", capability: "mfg-road" },
  { media: "packaging", capability: "mfg-defect" },
  { media: "bullying", capability: "edu-bullying" },
  { media: "shelf", capability: "retail-shelf" },
  { media: "refcam", capability: "sports-refcam" },
  { media: "contraband", capability: "edu-contraband" },
];

const INTERVAL = 8000;

export function HeroReel({ className }: { className?: string }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const timer = setTimeout(() => setI((n) => (n + 1) % REEL.length), INTERVAL);
    return () => clearTimeout(timer);
  }, [i, reduce, paused]);

  const item = REEL[i];
  const cap = getCapability(item.capability)!;

  return (
    <div className={cn("flex flex-col gap-2", className)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[10px]">
        <DemoMedia key={item.media} media={item.media} label={t("realFootage")} className="absolute inset-0 size-full" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
          <p className="text-sm font-medium text-white">{pick(cap, locale).name}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-white/70">{pick(cap, locale).short}</p>
        </div>
        {!reduce && (
          <span key={`${i}-${paused}`} aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left bg-accent" style={{ animation: paused ? undefined : `reel-progress ${INTERVAL}ms linear` }} />
        )}
      </div>
      <div role="tablist" aria-label={t("realFootage")} className="grid grid-cols-6 gap-1.5">
        {REEL.map((r, n) => {
          const c = getCapability(r.capability)!;
          return (
            <button
              key={r.media}
              type="button"
              role="tab"
              aria-selected={n === i}
              aria-label={pick(c, locale).name}
              title={pick(c, locale).name}
              onClick={() => setI(n)}
              className={cn(
                "relative aspect-video overflow-hidden rounded-[6px] border transition-[border-color,opacity]",
                n === i ? "border-accent" : "border-line opacity-60 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny poster thumbs */}
              <img src={posterOf(r.media)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

