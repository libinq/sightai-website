/**
 * Every unconfirmed number on the site lives here.
 * Labels and measurement-basis notes ("口径") live in messages/{locale}.json or content files.
 *
 * TODO: verify before launch — all values below are placeholders, not measured results.
 */

/** Shows a small "sample data" notice next to metric blocks. Set to false once all values are verified. */
export const SHOW_PLACEHOLDER_NOTICE = true;

export interface Metric {
  id: string;
  value: number;
  /** decimals shown in the count-up */
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

// TODO: verify before launch
export const HOME_METRICS: Metric[] = [
  { id: "classes", value: 180, suffix: "+" },
  { id: "latency", value: 30, prefix: "<", suffix: " ms" },
  { id: "nodes", value: 1200, suffix: "+" },
  { id: "accuracy", value: 96.5, decimals: 1, suffix: "%" },
];

// TODO: verify before launch — product hero badges + spec-table speed rows
export const PRODUCT_METRICS: Record<
  string,
  { badges: { id: string; value: string }[]; latencyCloud: string; latencyEdge: string }
> = {
  "road-inspection": {
    badges: [
      { id: "classes", value: "10+" },
      { id: "speed", value: "≤ 60 km/h" },
      { id: "depth", value: "± 5 mm" },
    ],
    latencyCloud: "< 150 ms",
    latencyEdge: "< 30 ms",
  },
  "quality-inspection": {
    badges: [
      { id: "cycle", value: "< 50 ms" },
      { id: "samples", value: "20+" },
      { id: "classes", value: "30+" },
    ],
    latencyCloud: "< 200 ms",
    latencyEdge: "< 20 ms",
  },
  "safety-behavior": {
    badges: [
      { id: "response", value: "< 3 s" },
      { id: "behaviors", value: "20+" },
      { id: "cameras", value: "16" },
    ],
    latencyCloud: "< 300 ms",
    latencyEdge: "< 40 ms",
  },
  "fpv-stabilization": {
    badges: [
      { id: "speed", value: "60 fps" },
      { id: "crop", value: "≤ 10%" },
      { id: "res", value: "8K" },
    ],
    latencyCloud: "≥ 30 fps",
    latencyEdge: "< 40 ms",
  },
  "color-enhancement": {
    badges: [
      { id: "speed", value: "60 fps" },
      { id: "upscale", value: "4×" },
      { id: "cameras", value: "12+" },
    ],
    latencyCloud: "≥ 30 fps",
    latencyEdge: "< 40 ms",
  },
  "digital-human": {
    badges: [
      { id: "footage", value: "3 min" },
      { id: "languages", value: "10+" },
      { id: "latency", value: "< 1.5 s" },
    ],
    latencyCloud: "< 1.5 s",
    latencyEdge: "< 1 s",
  },
  platform: {
    badges: [
      { id: "targets", value: "3" },
      { id: "sdks", value: "3" },
      { id: "models", value: "50+" },
    ],
    latencyCloud: "< 50 ms",
    latencyEdge: "< 30 ms",
  },
};

// TODO: verify before launch — road defect severity depth thresholds 【待替换】 (follow the customer's local standard)
export const SEVERITY_THRESHOLDS = { low: "< 15 mm", medium: "15–40 mm", high: "> 40 mm" };

/**
 * TODO: verify before launch — case-study result numbers (3 per case).
 * `null` renders as a visible "TBD / 待替换" placeholder: named customers have no
 * confirmed figures yet, so none are shown until the customer approves them.
 * Labels live in each case's MDX `meta.results`.
 */
export const CASE_METRICS: Record<string, (string | null)[]> = {
  fifa: [null, null, null],
  "china-open": [null, null, null],
  afc: [null, null, null],
  "lower-austria": [null, null, null],
  "national-games": [null, null, null],
  "giant-panda-park": [null, null, null],
  // anonymized sample cases
  "auto-parts-plant": ["-82%", "45 ms", "99.2%"],
  "petrochem-park": ["< 3 s", "-60%", "48"],
  "media-studio": ["-70%", "12", "4K"],
};
