"use client";

import dynamic from "next/dynamic";

/**
 * Renders a case-study MDX body. Lives in a client component because MDX rendered directly in the
 * RSC layer picks up a mismatched jsx runtime under `next dev`. Still server-side rendered (SEO intact).
 * Add a line here when adding a new case file.
 */
const BODIES: Record<string, React.ComponentType> = {
  "zh/fifa": dynamic(() => import("@/content/cases/zh/fifa.mdx")),
  "en/fifa": dynamic(() => import("@/content/cases/en/fifa.mdx")),
  "zh/china-open": dynamic(() => import("@/content/cases/zh/china-open.mdx")),
  "en/china-open": dynamic(() => import("@/content/cases/en/china-open.mdx")),
  "zh/afc": dynamic(() => import("@/content/cases/zh/afc.mdx")),
  "en/afc": dynamic(() => import("@/content/cases/en/afc.mdx")),
  "zh/lower-austria": dynamic(() => import("@/content/cases/zh/lower-austria.mdx")),
  "en/lower-austria": dynamic(() => import("@/content/cases/en/lower-austria.mdx")),
  "zh/national-games": dynamic(() => import("@/content/cases/zh/national-games.mdx")),
  "en/national-games": dynamic(() => import("@/content/cases/en/national-games.mdx")),
  "zh/giant-panda-park": dynamic(() => import("@/content/cases/zh/giant-panda-park.mdx")),
  "en/giant-panda-park": dynamic(() => import("@/content/cases/en/giant-panda-park.mdx")),
  "zh/auto-parts-plant": dynamic(() => import("@/content/cases/zh/auto-parts-plant.mdx")),
  "en/auto-parts-plant": dynamic(() => import("@/content/cases/en/auto-parts-plant.mdx")),
  "zh/petrochem-park": dynamic(() => import("@/content/cases/zh/petrochem-park.mdx")),
  "en/petrochem-park": dynamic(() => import("@/content/cases/en/petrochem-park.mdx")),
  "zh/media-studio": dynamic(() => import("@/content/cases/zh/media-studio.mdx")),
  "en/media-studio": dynamic(() => import("@/content/cases/en/media-studio.mdx")),
};

export function CaseBody({ locale, slug }: { locale: string; slug: string }) {
  const Body = BODIES[`${locale === "en" ? "en" : "zh"}/${slug}`];
  return Body ? <Body /> : null;
}
