import type { ComponentType } from "react";
import { CASE_METRICS } from "@/content/metrics";

import * as fifaZh from "./zh/fifa.mdx";
import * as fifaEn from "./en/fifa.mdx";
import * as chinaOpenZh from "./zh/china-open.mdx";
import * as chinaOpenEn from "./en/china-open.mdx";
import * as afcZh from "./zh/afc.mdx";
import * as afcEn from "./en/afc.mdx";
import * as lowerAustriaZh from "./zh/lower-austria.mdx";
import * as lowerAustriaEn from "./en/lower-austria.mdx";
import * as nationalGamesZh from "./zh/national-games.mdx";
import * as nationalGamesEn from "./en/national-games.mdx";
import * as pandaZh from "./zh/giant-panda-park.mdx";
import * as pandaEn from "./en/giant-panda-park.mdx";
import * as autoZh from "./zh/auto-parts-plant.mdx";
import * as autoEn from "./en/auto-parts-plant.mdx";
import * as petroZh from "./zh/petrochem-park.mdx";
import * as petroEn from "./en/petrochem-park.mdx";
import * as mediaZh from "./zh/media-studio.mdx";
import * as mediaEn from "./en/media-studio.mdx";

/** Copy exported from each MDX file as `meta`. */
export interface CaseMeta {
  client: string;
  sector: string;
  region: string;
  summary: string;
  /** labels for the 3 result numbers (values in content/metrics.ts → CASE_METRICS) */
  results: string[];
}

import { CASES, type CaseEntry } from "./list";

export { CASES, type CaseEntry };

type MdxModule = { default: ComponentType; meta: CaseMeta };
const m = (mod: unknown) => mod as MdxModule;

const MODULES: Record<"zh" | "en", Record<string, MdxModule>> = {
  zh: {
    fifa: m(fifaZh),
    "china-open": m(chinaOpenZh),
    afc: m(afcZh),
    "lower-austria": m(lowerAustriaZh),
    "national-games": m(nationalGamesZh),
    "giant-panda-park": m(pandaZh),
    "auto-parts-plant": m(autoZh),
    "petrochem-park": m(petroZh),
    "media-studio": m(mediaZh),
  },
  en: {
    fifa: m(fifaEn),
    "china-open": m(chinaOpenEn),
    afc: m(afcEn),
    "lower-austria": m(lowerAustriaEn),
    "national-games": m(nationalGamesEn),
    "giant-panda-park": m(pandaEn),
    "auto-parts-plant": m(autoEn),
    "petrochem-park": m(petroEn),
    "media-studio": m(mediaEn),
  },
};

const loc = (locale: string) => (locale === "en" ? "en" : "zh");

export function getCase(locale: string, slug: string) {
  const entry = CASES.find((c) => c.slug === slug);
  if (!entry) return null;
  const mod = MODULES[loc(locale)][slug];
  return { ...entry, meta: mod.meta, metrics: CASE_METRICS[slug] ?? [null, null, null] };
}

/** Serializable list for cards (safe to pass to client components). */
export function listCases(locale: string, filter?: (c: CaseEntry) => boolean) {
  return CASES.filter(filter ?? (() => true)).map((c) => ({
    ...c,
    meta: MODULES[loc(locale)][c.slug].meta,
    metrics: CASE_METRICS[c.slug] ?? [null, null, null],
  }));
}

export type CaseListItem = ReturnType<typeof listCases>[number];
