import { CAPABILITIES, getCapability, type IndustryKey } from "@/content/industries";

/**
 * Deterministic demo data for the console. Everything is seeded from the user id so a
 * given org always sees the same numbers. Replace with real API calls when the backend exists.
 */

export type Range = "24h" | "7d" | "30d";
export type Severity = "low" | "medium" | "high";
export type EventStatus = "open" | "ack" | "resolved";
export type SourceStatus = "online" | "offline" | "degraded";
export type Bilingual = string | { zh: string; en: string };

export interface Source {
  id: string;
  name: string;
  location: Bilingual;
  protocol: "RTSP" | "ONVIF" | "GB28181" | "SRT" | "Upload";
  resolution: string;
  fps: number;
  capability?: string;
  status: SourceStatus;
}

export interface EventItem {
  id: string;
  ts: number;
  type: string;
  capability: string;
  sourceId: string;
  severity: Severity;
  confidence: number;
  status: EventStatus;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  tail: string;
  created: number;
  lastUsed: number | null;
  calls: number;
}

export const loc = (v: Bilingual, locale: string) => (typeof v === "string" ? v : locale === "en" ? v.en : v.zh);

/* ---------------- PRNG ---------------- */

export function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pickOne = <T,>(r: () => number, arr: readonly T[]) => arr[Math.floor(r() * arr.length)];

/** Smooth-ish series: base · (1 + trend·x) · daily wave + noise. */
export function series(seed: string, n: number, base: number, opts: { trend?: number; wave?: number; noise?: number } = {}) {
  const { trend = 0.15, wave = 0.25, noise = 0.12 } = opts;
  const r = rng(hashStr(seed));
  return Array.from({ length: n }, (_, i) => {
    const x = i / Math.max(1, n - 1);
    const w = 1 + wave * Math.sin((i / n) * Math.PI * 2 * Math.max(1, n / 12) + r());
    return Math.max(0, Math.round(base * (1 + trend * x) * w * (1 + (r() - 0.5) * 2 * noise)));
  });
}

export const RANGE_POINTS: Record<Range, number> = { "24h": 24, "7d": 7 * 4, "30d": 30 };
const RANGE_STEP_MS: Record<Range, number> = { "24h": 3600e3, "7d": 6 * 3600e3, "30d": 86400e3 };

export function rangeLabels(range: Range, locale: string, now = Date.now()) {
  const n = RANGE_POINTS[range];
  const step = RANGE_STEP_MS[range];
  const fmt = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", range === "24h" ? { hour: "2-digit", minute: "2-digit", hour12: false } : { month: "short", day: "numeric", ...(range === "7d" ? { hour: "2-digit", hour12: false } : {}) });
  return Array.from({ length: n }, (_, i) => fmt.format(new Date(now - (n - 1 - i) * step)));
}

/* ---------------- Sources ---------------- */

const LOCATIONS: Record<IndustryKey, { zh: string; en: string }[]> = {
  education: [
    { zh: "教学楼 A · 三层走廊", en: "Block A · 3F corridor" },
    { zh: "东侧楼梯间", en: "East stairwell" },
    { zh: "宿舍区 2 号楼", en: "Dorm building 2" },
    { zh: "校门安检通道 1", en: "Main gate · lane 1" },
    { zh: "操场北侧", en: "Playground north" },
    { zh: "食堂一层", en: "Canteen 1F" },
  ],
  retail: [
    { zh: "静安店 · 入口", en: "Jing'an store · entrance" },
    { zh: "静安店 · 饮料货架", en: "Jing'an store · drinks aisle" },
    { zh: "徐汇店 · 生鲜区", en: "Xuhui store · fresh" },
    { zh: "徐汇店 · 收银 03", en: "Xuhui store · checkout 03" },
    { zh: "浦东店 · 日化货架", en: "Pudong store · household aisle" },
    { zh: "浦东店 · 数字人大屏", en: "Pudong store · avatar screen" },
  ],
  sports: [
    { zh: "主裁判 RefCam", en: "Referee RefCam" },
    { zh: "第一助理裁判机位", en: "Assistant referee 1 cam" },
    { zh: "主转播机位", en: "Main broadcast camera" },
    { zh: "南侧球门机位", en: "South goal camera" },
    { zh: "演播室数字人", en: "Studio avatar" },
  ],
  manufacturing: [
    { zh: "灌装线 L1 · 出口", en: "Filling line L1 · outfeed" },
    { zh: "包装线 L2 · 贴标后", en: "Packaging line L2 · post-label" },
    { zh: "装配工位 S4", en: "Assembly station S4" },
    { zh: "巡检车 #2 · 前视", en: "Survey vehicle #2 · front" },
    { zh: "仓库 A 区", en: "Warehouse zone A" },
  ],
};

const CODE: Record<IndustryKey, string> = { education: "EDU", retail: "RTL", sports: "SPT", manufacturing: "MFG" };

export function makeSources(uid: string, capId: string, count?: number): Source[] {
  const cap = getCapability(capId);
  if (!cap) return [];
  const r = rng(hashStr(`${uid}:${capId}:src`));
  const n = count ?? 2 + Math.floor(r() * 3);
  return Array.from({ length: n }, (_, i) => {
    const roll = r();
    return {
      id: `src_${capId}_${i}`,
      name: `CAM-${CODE[cap.industry]}-${String(Math.floor(r() * 90) + 10)}`,
      location: pickOne(r, LOCATIONS[cap.industry]),
      protocol: cap.industry === "sports" ? "SRT" : pickOne(r, ["RTSP", "ONVIF", "GB28181"] as const),
      resolution: pickOne(r, ["1920×1080", "2560×1440", "3840×2160", "1280×720"]),
      fps: pickOne(r, [15, 25, 30]),
      capability: capId,
      status: roll > 0.93 ? "offline" : roll > 0.85 ? "degraded" : "online",
    };
  });
}

/* ---------------- Events ---------------- */

export function makeEvent(r: () => number, capId: string, sources: Source[], ts: number, idx: number): EventItem | null {
  const cap = getCapability(capId);
  const bound = sources.filter((s) => s.capability === capId);
  if (!cap || bound.length === 0) return null;
  const sev = r();
  return {
    id: `evt_${ts.toString(36)}_${idx}`,
    ts,
    type: pickOne(r, cap.events),
    capability: capId,
    sourceId: pickOne(r, bound).id,
    severity: sev > 0.82 ? "high" : sev > 0.45 ? "medium" : "low",
    confidence: Math.round((0.72 + r() * 0.27) * 100) / 100,
    status: "open",
  };
}

export function makeEvents(uid: string, subs: string[], sources: Source[], now = Date.now()): EventItem[] {
  const r = rng(hashStr(`${uid}:events`));
  const out: EventItem[] = [];
  const span = 7 * 86400e3;
  subs.forEach((capId) => {
    const n = 14 + Math.floor(r() * 18);
    for (let i = 0; i < n; i++) {
      // skew toward recent and daytime
      const ago = Math.pow(r(), 1.6) * span;
      const e = makeEvent(r, capId, sources, Math.round(now - ago), out.length);
      if (!e) continue;
      const age = now - e.ts;
      e.status = age > 86400e3 * 2 ? (r() > 0.2 ? "resolved" : "ack") : age > 3600e3 * 4 ? (r() > 0.5 ? "ack" : "open") : "open";
      out.push(e);
    }
  });
  return out.sort((a, b) => b.ts - a.ts);
}

/* ---------------- API keys ---------------- */

export function randomKey() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function makeApiKeys(uid: string, now = Date.now()): ApiKey[] {
  const r = rng(hashStr(`${uid}:keys`));
  return [
    { id: "key_prod", name: "Production", prefix: "sk_live_", tail: Math.floor(r() * 0xffff).toString(16).padStart(4, "0"), created: now - 40 * 86400e3, lastUsed: now - 120e3, calls: 1_284_311 },
    { id: "key_stage", name: "Staging", prefix: "sk_test_", tail: Math.floor(r() * 0xffff).toString(16).padStart(4, "0"), created: now - 12 * 86400e3, lastUsed: now - 5 * 3600e3, calls: 48_902 },
  ];
}

/* ---------------- Aggregates ---------------- */

export const capabilityIndustry = (capId: string) => getCapability(capId)?.industry;

export function apiCallsByIndustry(uid: string, subs: string[], range: Range) {
  const n = RANGE_POINTS[range];
  const scale = range === "24h" ? 1 : range === "7d" ? 6 : 24;
  const industries: IndustryKey[] = ["education", "retail", "sports", "manufacturing"];
  return industries.map((ind) => {
    const count = subs.filter((s) => capabilityIndustry(s) === ind).length;
    return {
      key: ind,
      values: count ? series(`${uid}:calls:${ind}:${range}`, n, 900 * count * scale, { wave: range === "24h" ? 0.45 : 0.2 }) : Array(n).fill(0),
    };
  });
}

export function latencySeries(uid: string, range: Range) {
  const n = RANGE_POINTS[range];
  return {
    p50: series(`${uid}:p50:${range}`, n, 22, { trend: -0.05, wave: 0.08, noise: 0.08 }),
    p95: series(`${uid}:p95:${range}`, n, 58, { trend: -0.08, wave: 0.12, noise: 0.14 }),
  };
}

export { CAPABILITIES };
