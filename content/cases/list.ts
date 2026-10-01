// Case registry without MDX imports — safe to use in client bundles.
export interface CaseEntry {
  slug: string;
  /** true = real customer named with permission; false = anonymized sample */
  named: boolean;
  /**
   * 【待替换】 true until the customer has approved the case text and figures.
   * Shows a visible "pending confirmation" notice on the page.
   */
  needsReview: boolean;
  products: string[];
  /** wordmark text for the logo wall (named customers only, until real logo files are supplied) */
  wordmark?: { zh: string; en: string };
}

export const CASES: CaseEntry[] = [
  { slug: "fifa", named: true, needsReview: true, products: ["digital-human", "color-enhancement"], wordmark: { zh: "FIFA", en: "FIFA" } },
  { slug: "china-open", named: true, needsReview: true, products: ["fpv-stabilization", "color-enhancement"], wordmark: { zh: "中国网球公开赛", en: "China Open" } },
  { slug: "afc", named: true, needsReview: true, products: ["color-enhancement", "digital-human"], wordmark: { zh: "亚足联 AFC", en: "AFC" } },
  { slug: "lower-austria", named: true, needsReview: true, products: ["road-inspection", "platform"], wordmark: { zh: "下奥地利州政府", en: "State of Lower Austria" } },
  { slug: "national-games", named: true, needsReview: true, products: ["safety-behavior", "digital-human"], wordmark: { zh: "全国运动会", en: "National Games of China" } },
  { slug: "giant-panda-park", named: true, needsReview: true, products: ["safety-behavior", "color-enhancement"], wordmark: { zh: "大熊猫国家公园", en: "Giant Panda National Park" } },
  { slug: "auto-parts-plant", named: false, needsReview: true, products: ["quality-inspection", "platform"] },
  { slug: "petrochem-park", named: false, needsReview: true, products: ["safety-behavior"] },
  { slug: "media-studio", named: false, needsReview: true, products: ["fpv-stabilization", "color-enhancement"] },
];
