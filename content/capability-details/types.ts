/** Long-form copy for a capability detail page (/industries/[industry]/[capability]). */
export interface CapabilityDetailCopy {
  /** 2–3 sentence overview */
  overview: string;
  /** benefits per audience, same order as AUDIENCES[industry] */
  benefits: string[][];
  features: { title: string; desc: string }[];
  workflow: { title: string; desc: string }[];
  /** headline outcomes — placeholders until verified 【待替换】 */
  kpis: { value: string; label: string }[];
  scenarios: { title: string; desc: string }[];
  specs: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
}

export type CapabilityDetail = { zh: CapabilityDetailCopy; en: CapabilityDetailCopy };
