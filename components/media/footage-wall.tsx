"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { INDUSTRIES, getCapability, industryHref, pick } from "@/content/industries";
import type { MediaKey } from "@/content/media";
import { cn } from "@/lib/utils";
import { DemoMedia } from "./demo-media";

export interface WallItem {
  media: MediaKey;
  capability: string;
}

/** Grid of real clips, each captioned with the capability it demonstrates. */
export function FootageWall({ items, className, featureFirst = false }: { items: WallItem[]; className?: string; featureFirst?: boolean }) {
  const t = useTranslations("common");
  const locale = useLocale();
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map(({ media, capability }, i) => {
        const cap = getCapability(capability)!;
        const ind = INDUSTRIES.find((x) => x.key === cap.industry)!;
        const c = pick(cap, locale);
        const big = featureFirst && i === 0;
        return (
          <li key={`${media}-${capability}`} className={cn("group relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg-1", big && "sm:col-span-2 lg:row-span-2")}>
            <DemoMedia media={media} label={t("realFootage")} className={big ? "aspect-video lg:aspect-auto lg:h-[calc(100%-72px)]" : "aspect-video"} />
            <Link href={`${industryHref(cap.industry)}#${cap.id}`} className="flex min-h-[72px] items-center gap-3 border-t border-line px-4 py-3 transition-colors hover:bg-bg-2/60">
              <span className="size-2 shrink-0 rounded-full" style={{ background: ind.color }} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-text-1">{c.name}</span>
                <span className="block truncate text-xs text-text-3">{pick(ind, locale).name} · {c.short}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-text-3 transition-colors group-hover:text-accent" aria-hidden />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
