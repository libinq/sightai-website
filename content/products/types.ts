import type { LucideIcon } from "lucide-react";
import type { ProductLine } from "./index";

export type DemoKey =
  | "road-map"
  | "conveyor"
  | "monitor-wall"
  | "trajectory"
  | "histogram"
  | "avatar"
  | "architecture";

export interface ProductCopy {
  /** ≤ 15 Chinese chars / ≤ 10 English words */
  valueProp: string;
  /** 50–80 字 description */
  intro: string;
  /** labels for the hero metric badges; values live in content/metrics.ts → PRODUCT_METRICS */
  metricLabels: Record<string, string>;
  pains: { before: string; after: string }[];
  capabilities: { title: string; desc: string }[];
  steps: { title: string; desc: string }[];
  /** spec rows: label + cloud value + edge value */
  specs: { label: string; cloud: string; edge: string }[];
  scenarios: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export interface ProductData {
  slug: string;
  line: ProductLine;
  demo: DemoKey;
  /** one icon per capability (same order as copy.capabilities) */
  capabilityIcons: LucideIcon[];
  relatedCases: string[];
  zh: ProductCopy;
  en: ProductCopy;
}
