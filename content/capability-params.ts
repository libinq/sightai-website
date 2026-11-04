/**
 * Per-capability parameter schemas for the console Playground, camera configs and the API.
 * Pure data (no React) so the API route can validate requests against it.
 * Labels live in messages/*.json under console.capParams.<capId>.<key> (falling back to _common.<key>).
 */

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** How the capability is previewed in the browser. */
export type PreviewMode = "detect" | "enhance" | "stabilize" | "avatar";

export type FieldKind = "range" | "select" | "toggle" | "multi" | "roi" | "classes";
export type FieldGroup = "detect" | "rule" | "look" | "stab" | "persona" | "output";

/** Core preview-engine parameter a field drives. */
export type Bind = "threshold" | "sensitivity" | "minSize" | "dwell" | "sampleFps" | "roi" | "privacy" | "classes" | "minCount" | "cooldown";

export type Unit = "s" | "pct" | "ms" | "mm" | "m" | "kmh" | "mbps" | "fps" | "x" | "people" | "parts" | "lanes" | "min";

export type Value = number | string | boolean | string[] | Box | null;
export type CapValues = Record<string, Value>;

export interface Field {
  key: string;
  kind: FieldKind;
  group: FieldGroup;
  default: Value;
  min?: number;
  max?: number;
  step?: number;
  unit?: Unit;
  options?: string[];
  bind?: Bind;
  /** consumed by the mode's preview renderer (enhance / stabilize / avatar) */
  live?: boolean;
}

export interface CapSchema {
  mode: PreviewMode;
  /** classes the preview labels detections with (defaults to the capability's event types) */
  classes?: string[];
  /** with a minCount rule: emit this class as one group event instead of per-object events */
  countClass?: string;
  /** default sample clip in the Playground (a content/media key) */
  sample?: string;
  fields: Field[];
}

/* ---------- field helpers ---------- */

const range = (key: string, group: FieldGroup, min: number, max: number, step: number, def: number, extra: Partial<Field> = {}): Field => ({ key, kind: "range", group, min, max, step, default: def, ...extra });
const select = (key: string, group: FieldGroup, options: string[], def: string, extra: Partial<Field> = {}): Field => ({ key, kind: "select", group, options, default: def, ...extra });
const toggle = (key: string, group: FieldGroup, def: boolean, extra: Partial<Field> = {}): Field => ({ key, kind: "toggle", group, default: def, ...extra });
const multi = (key: string, group: FieldGroup, options: string[], def: string[], extra: Partial<Field> = {}): Field => ({ key, kind: "multi", group, options, default: def, ...extra });

const classes = (): Field => ({ key: "classes", kind: "classes", group: "detect", default: null, bind: "classes" });
const threshold = (def: number): Field => range("threshold", "detect", 0.3, 0.99, 0.01, def, { bind: "threshold" });
const sensitivity = (def: number): Field => range("sensitivity", "detect", 0, 100, 1, def, { bind: "sensitivity" });
const minSize = (def: number, min = 0.1, max = 10, step = 0.1): Field => range("minSize", "detect", min, max, step, def, { bind: "minSize", unit: "pct" });
const sampleFps = (def: number): Field => range("sampleFps", "detect", 1, 15, 1, def, { bind: "sampleFps", unit: "fps" });
const roi = (def: Box | null = null): Field => ({ key: "roi", kind: "roi", group: "detect", default: def, bind: "roi" });
const dwell = (def: number, min = 0, max = 10, step = 0.5): Field => range("dwell", "rule", min, max, step, def, { bind: "dwell", unit: "s" });
const cooldown = (def: number, max = 300, step = 5): Field => range("cooldown", "rule", 0, max, step, def, { bind: "cooldown", unit: "s" });
const minCount = (def: number, min: number, max: number): Field => range("minCount", "rule", min, max, 1, def, { bind: "minCount", unit: "people" });
const privacy = (def: boolean): Field => toggle("privacy", "output", def, { bind: "privacy" });

const CENTER: Box = { x: 0.2, y: 0.2, w: 0.6, h: 0.6 };
const BOTTOM: Box = { x: 0, y: 0.5, w: 1, h: 0.5 };

const AVATAR_PERSONA = (scenes: string[], def: string): Field[] => [
  select("scene", "persona", scenes, def, { live: true }),
  select("lang", "persona", ["zh", "en", "ms", "ja"], "zh", { live: true }),
  select("voice", "persona", ["warm", "pro", "lively"], "warm", { live: true }),
  range("rate", "persona", 0.5, 2, 0.1, 1, { unit: "x", live: true }),
  toggle("subtitles", "persona", true, { live: true }),
];

export const CAP_SCHEMAS: Record<string, CapSchema> = {
  "edu-bullying": {
    mode: "detect",
    countClass: "crowding",
    fields: [
      classes(),
      threshold(0.7),
      sensitivity(60),
      roi(),
      minCount(2, 1, 6),
      dwell(2),
      cooldown(60),
      select("schedule", "rule", ["always", "breaks", "afterSchool"], "always"),
      privacy(true),
      multi("notify", "output", ["moral", "teacher", "security"], ["moral", "security"]),
    ],
  },
  "edu-behavior": {
    mode: "detect",
    fields: [
      classes(),
      threshold(0.65),
      sensitivity(55),
      roi(),
      sampleFps(8),
      dwell(1),
      range("loiterSeconds", "rule", 30, 600, 30, 180, { unit: "s" }),
      range("runSpeed", "rule", 2, 6, 0.5, 3.5),
      privacy(true),
    ],
  },
  "edu-contraband": {
    mode: "detect",
    fields: [
      classes(),
      threshold(0.5),
      minSize(0.15, 0.05, 3, 0.05),
      sensitivity(75),
      select("screening", "detect", ["gate", "xray", "camera"], "gate"),
      dwell(0, 0, 3),
      range("lanes", "rule", 1, 8, 1, 2, { unit: "lanes" }),
      select("alarm", "rule", ["soundLight", "silent", "lockGate"], "soundLight"),
      privacy(true),
    ],
  },
  "edu-perimeter": {
    mode: "detect",
    fields: [
      classes(),
      roi(CENTER),
      threshold(0.6),
      minSize(1.5, 0.2, 10),
      sensitivity(60),
      dwell(0.5),
      select("direction", "rule", ["enter", "exit", "both"], "enter"),
      select("arm", "rule", ["always", "night", "weekend"], "night"),
      cooldown(30),
    ],
  },
  "retail-heatmap": {
    mode: "detect",
    countClass: "queue_long",
    fields: [
      classes(),
      roi(),
      sampleFps(4),
      toggle("excludeStaff", "detect", true),
      minCount(5, 2, 20),
      dwell(3, 1, 30, 1),
      cooldown(120, 600, 10),
      select("grid", "output", ["coarse", "fine"], "fine"),
      select("interval", "output", ["15m", "1h", "1d"], "1h"),
      privacy(true),
    ],
  },
  "retail-shelf": {
    mode: "detect",
    fields: [
      classes(),
      threshold(0.7),
      roi(),
      minSize(0.5, 0.1, 5),
      sensitivity(50),
      dwell(5, 0, 30, 1),
      range("emptyRatio", "rule", 10, 80, 5, 30, { unit: "pct" }),
      select("scanEvery", "rule", ["5", "15", "30", "60"], "15"),
      multi("notify", "output", ["store", "area", "hq"], ["store"]),
    ],
  },
  "retail-loss": {
    mode: "detect",
    fields: [
      classes(),
      threshold(0.75),
      roi(BOTTOM),
      dwell(1.5, 0.5, 5),
      toggle("posSync", "rule", true),
      select("action", "rule", ["alert", "record"], "alert"),
      cooldown(20, 120),
      privacy(true),
    ],
  },
  "retail-avatar": {
    mode: "avatar",
    fields: [...AVATAR_PERSONA(["guide", "live", "service"], "guide"), toggle("knowledge", "output", true), toggle("handoff", "output", true), select("idle", "output", ["promo", "greet", "none"], "greet")],
  },
  "sports-refcam": {
    mode: "stabilize",
    fields: [
      range("strength", "stab", 0, 100, 1, 70, { live: true }),
      range("crop", "stab", 0, 20, 1, 8, { unit: "pct", live: true }),
      toggle("horizon", "stab", true),
      toggle("rollingShutter", "stab", true),
      select("latency", "stab", ["ultra", "balanced", "quality"], "ultra"),
      select("output", "output", ["1080p50", "1080p25", "720p50"], "1080p50"),
      range("bitrate", "output", 2, 20, 1, 8, { unit: "mbps" }),
    ],
  },
  "sports-enhance": {
    mode: "enhance",
    // a single-view clip with flat CCTV-style color (the RefCam clip is already a side-by-side comparison)
    sample: "behavior",
    fields: [
      select("preset", "look", ["auto", "lowlight", "hdr", "sr", "match"], "auto", { live: true }),
      range("strength", "look", 0, 100, 1, 60, { live: true }),
      range("exposure", "look", -50, 50, 1, 0, { live: true }),
      range("contrast", "look", -50, 50, 1, 0, { live: true }),
      range("saturation", "look", -50, 50, 1, 0, { live: true }),
      range("warmth", "look", -50, 50, 1, 0, { live: true }),
      range("sharpen", "look", 0, 100, 1, 30),
      toggle("denoise", "look", true),
      select("resolution", "output", ["same", "1080p", "4k"], "4k"),
      select("hdrOut", "output", ["sdr", "hlg", "pq"], "sdr"),
    ],
  },
  "sports-highlights": {
    mode: "detect",
    classes: ["goal", "shot", "save", "foul"],
    fields: [
      classes(),
      threshold(0.7),
      sensitivity(60),
      dwell(1, 0, 5),
      cooldown(15, 120),
      range("preRoll", "output", 0, 15, 1, 5, { unit: "s" }),
      range("postRoll", "output", 0, 15, 1, 4, { unit: "s" }),
      range("maxClip", "output", 10, 90, 5, 30, { unit: "s" }),
      multi("aspects", "output", ["16:9", "9:16", "1:1"], ["16:9", "9:16"]),
      multi("platforms", "output", ["tiktok", "youtube", "web", "app"], ["web"]),
      toggle("autoPublish", "output", false),
    ],
  },
  "sports-avatar": {
    mode: "avatar",
    fields: [...AVATAR_PERSONA(["commentary", "venue", "score"], "commentary"), toggle("dataFeed", "output", true), multi("channels", "output", ["screen", "stream", "miniapp"], ["screen", "stream"])],
  },
  "mfg-defect": {
    mode: "detect",
    fields: [
      classes(),
      threshold(0.8),
      minSize(0.2, 0.05, 5, 0.05),
      sensitivity(65),
      roi(),
      sampleFps(15),
      range("takt", "rule", 50, 2000, 10, 300, { unit: "ms" }),
      range("consecutiveNg", "rule", 1, 20, 1, 3, { unit: "parts" }),
      select("reject", "output", ["plc", "alarm", "stopLine"], "plc"),
      select("saveImages", "output", ["ng", "all", "none"], "ng"),
    ],
  },
  "mfg-road": {
    mode: "detect",
    fields: [
      classes(),
      threshold(0.6),
      minSize(0.3, 0.1, 5),
      sensitivity(55),
      sampleFps(10),
      range("speed", "detect", 20, 80, 5, 40, { unit: "kmh" }),
      range("depth", "rule", 5, 50, 1, 15, { unit: "mm" }),
      range("gpsInterval", "output", 5, 50, 5, 10, { unit: "m" }),
      select("report", "output", ["perTrip", "daily"], "perTrip"),
    ],
  },
  "mfg-ppe": {
    mode: "detect",
    fields: [
      classes(),
      threshold(0.7),
      sensitivity(60),
      roi(),
      multi("gear", "detect", ["helmet", "vest", "gloves", "goggles"], ["helmet", "vest"]),
      dwell(2),
      cooldown(60, 600, 10),
      privacy(true),
    ],
  },
  "mfg-assembly": {
    mode: "detect",
    fields: [
      classes(),
      threshold(0.85),
      minSize(0.3, 0.05, 5, 0.05),
      sensitivity(55),
      roi(),
      select("variant", "detect", ["A", "B", "C"], "A"),
      range("parts", "rule", 1, 64, 1, 12, { unit: "parts" }),
      select("trigger", "rule", ["plc", "continuous"], "plc"),
    ],
  },
};

export const getSchema = (capId: string): CapSchema => CAP_SCHEMAS[capId] ?? { mode: "detect", fields: [classes(), threshold(0.6), sensitivity(60), roi(), dwell(1)] };

/** Whether changing this field changes the browser preview (vs. applying only once deployed). */
export const isLive = (f: Field) => !!f.bind || !!f.live;

export function defaultValues(schema: CapSchema, allClasses: string[]): CapValues {
  const v: CapValues = {};
  for (const f of schema.fields) v[f.key] = f.kind === "classes" ? allClasses : Array.isArray(f.default) ? [...f.default] : f.default;
  return v;
}

/** Merge stored values over defaults, dropping unknown keys and out-of-range values. */
export function mergeValues(schema: CapSchema, allClasses: string[], stored?: CapValues): CapValues {
  const v = defaultValues(schema, allClasses);
  if (!stored) return v;
  for (const f of schema.fields) {
    const s = stored[f.key];
    if (s === undefined) continue;
    if (f.kind === "range" && typeof s === "number") v[f.key] = Math.min(f.max!, Math.max(f.min!, s));
    else if (f.kind === "select" && typeof s === "string" && f.options!.includes(s)) v[f.key] = s;
    else if (f.kind === "toggle" && typeof s === "boolean") v[f.key] = s;
    else if ((f.kind === "multi" || f.kind === "classes") && Array.isArray(s)) v[f.key] = s.filter((x) => (f.kind === "classes" ? allClasses : f.options!).includes(x));
    else if (f.kind === "roi" && (s === null || typeof s === "object")) v[f.key] = s;
  }
  return v;
}

const snake = (k: string) => k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);

/** API request `params` object for these values (snake_case keys). */
export function toApiParams(schema: CapSchema, values: CapValues) {
  const out: Record<string, unknown> = {};
  for (const f of schema.fields) {
    const v = values[f.key];
    out[snake(f.key)] = f.kind === "roi" && v && typeof v === "object" && !Array.isArray(v) ? { x: +v.x.toFixed(3), y: +v.y.toFixed(3), w: +v.w.toFixed(3), h: +v.h.toFixed(3) } : v;
  }
  return out;
}

/** Server-side validation of API `params` against the capability schema. Returns issue strings. */
export function validateApiParams(schema: CapSchema, allClasses: string[], params: Record<string, unknown>) {
  const issues: string[] = [];
  const byKey = new Map(schema.fields.map((f) => [snake(f.key), f]));
  for (const [k, v] of Object.entries(params)) {
    const f = byKey.get(k);
    if (!f) {
      issues.push(`params.${k}: unknown parameter for this capability`);
      continue;
    }
    if (f.kind === "range" && (typeof v !== "number" || v < f.min! || v > f.max!)) issues.push(`params.${k}: expected number in [${f.min}, ${f.max}]`);
    if (f.kind === "select" && !f.options!.includes(String(v))) issues.push(`params.${k}: expected one of ${f.options!.join(", ")}`);
    if (f.kind === "toggle" && typeof v !== "boolean") issues.push(`params.${k}: expected boolean`);
    if (f.kind === "multi" && (!Array.isArray(v) || v.some((x) => !f.options!.includes(x)))) issues.push(`params.${k}: expected subset of ${f.options!.join(", ")}`);
    if (f.kind === "classes" && (!Array.isArray(v) || v.some((x) => !allClasses.includes(x)))) issues.push(`params.${k}: expected subset of ${allClasses.join(", ")}`);
    if (f.kind === "roi" && v !== null) {
      const b = v as Partial<Box>;
      if (typeof v !== "object" || [b.x, b.y, b.w, b.h].some((n) => typeof n !== "number" || n < 0 || n > 1)) issues.push(`params.${k}: expected null or {x,y,w,h} in 0..1`);
    }
  }
  return issues;
}

/* ---------- avatar scripts (sample lines spoken in the preview, per scene and language) ---------- */

type Lang = "zh" | "en" | "ms" | "ja";
export const AVATAR_SCRIPTS: Record<string, Record<Lang, string>> = {
  guide: {
    zh: "欢迎光临！本周饮料区第二件半价，需要我带您过去看看吗？",
    en: "Welcome in! Drinks are buy one, get one half price this week. Shall I show you where they are?",
    ms: "Selamat datang! Minuman beli satu, kedua separuh harga minggu ini. Mahu saya tunjukkan?",
    ja: "いらっしゃいませ。今週はドリンクが2本目半額です。売り場までご案内しましょうか？",
  },
  live: {
    zh: "家人们看过来，这款保温杯今天直播间专属价，库存不多，喜欢的抓紧下单！",
    en: "Take a look at this insulated bottle: it's at a live-stream-only price today, and stock is limited.",
    ms: "Lihat botol penebat ini — harga istimewa siaran langsung hari ini, stok terhad!",
    ja: "こちらの保温ボトル、本日ライブ配信限定価格です。在庫わずかなのでお早めに。",
  },
  service: {
    zh: "您好，退换货请保留小票，七天内可在任意门店办理。还有其他可以帮您的吗？",
    en: "Hi! Keep your receipt and you can return or exchange at any store within seven days. Anything else I can help with?",
    ms: "Hai! Simpan resit anda untuk pemulangan di mana-mana kedai dalam tujuh hari. Ada lagi yang boleh saya bantu?",
    ja: "返品・交換はレシートをお持ちのうえ、7日以内にどの店舗でも承ります。ほかにご用件はございますか？",
  },
  commentary: {
    zh: "第七十八分钟，十号禁区前沿起脚，球进了！比分改写为二比一！",
    en: "Seventy-eight minutes: the number ten shoots from the edge of the box, and it's in! Two-one!",
    ms: "Minit ketujuh puluh lapan — nombor sepuluh menendang dari pinggir kotak, gol! Dua-satu!",
    ja: "後半78分、背番号10がペナルティエリア手前から右足一閃、ゴール！スコアは2対1！",
  },
  venue: {
    zh: "观众朋友们，B 区入口在您左手边，比赛将于十五分钟后开始，请提前就座。",
    en: "Entrance B is on your left. Kick-off is in fifteen minutes, please take your seats.",
    ms: "Pintu masuk B di sebelah kiri anda. Perlawanan bermula dalam lima belas minit, sila ambil tempat duduk.",
    ja: "B ゲートは左手にございます。試合開始15分前です。お早めにご着席ください。",
  },
  score: {
    zh: "半场结束，主队一比零领先，控球率百分之五十八，射正四次。",
    en: "Half-time: the home side lead one-nil, with fifty-eight percent possession and four shots on target.",
    ms: "Separuh masa: pasukan tuan rumah mendahului satu-kosong, 58 peratus penguasaan bola, empat sasaran tepat.",
    ja: "前半終了、ホームチームが1対0でリード。ボール支配率58％、枠内シュート4本。",
  },
};
