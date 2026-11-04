/**
 * On-device preview engine for the console playground and camera live view.
 *
 * It does real image analysis on whatever the user feeds it (sample clip, uploaded file, webcam,
 * camera stream): background-subtraction motion detection for video, local-contrast saliency for
 * still images, plus an IoU tracker that gives each object a stable id. Class labels and confidence
 * are simulated from the capability's class list — the production models run server-side / on the
 * edge appliance. The UI labels this clearly as a preview.
 */

export interface Box {
  /** normalized 0..1, origin top-left */
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PreviewParams {
  /** minimum confidence to report, 0.3–0.99 */
  threshold: number;
  /** motion / contrast sensitivity, 0–100 */
  sensitivity: number;
  /** minimum object size, % of frame area */
  minSize: number;
  /** enabled classes (subset of the capability's classes) */
  classes: string[];
  /** region of interest; null = whole frame */
  roi: Box | null;
  /** blur detected regions */
  privacy: boolean;
  /** seconds an object must persist inside the ROI before an event fires */
  dwell: number;
  /** analysis frames per second */
  sampleFps: number;
}

export const DEFAULT_PARAMS: Omit<PreviewParams, "classes"> = {
  threshold: 0.6,
  sensitivity: 60,
  minSize: 0.4,
  roi: null,
  privacy: false,
  dwell: 1,
  sampleFps: 8,
};

export interface Detection {
  id: number;
  cls: string;
  conf: number;
  box: Box;
  inRoi: boolean;
  /** an event has fired for this track */
  alerted: boolean;
}

export interface EngineEvent {
  id: string;
  trackId: number;
  cls: string;
  conf: number;
  box: Box;
  /** media time, seconds */
  t: number;
}

export const ANALYSIS_W = 160;
export const ANALYSIS_H = 90;

interface Track {
  id: number;
  box: Box;
  cls: string;
  base: number;
  hits: number;
  firstSeen: number;
  lastSeen: number;
  roiSince: number | null;
  alerted: boolean;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967296;
}

export function iou(a: Box, b: Box) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = a.w * a.h + b.w * b.h - inter;
  return union > 0 ? inter / union : 0;
}

const centerIn = (b: Box, r: Box) => {
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  return cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h;
};

/** Connected components on a binary mask → pixel-space boxes. */
function components(mask: Uint8Array, w: number, h: number) {
  const seen = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  const out: { x0: number; y0: number; x1: number; y1: number; n: number }[] = [];
  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || seen[i]) continue;
    let sp = 0;
    stack[sp++] = i;
    seen[i] = 1;
    let x0 = w, y0 = h, x1 = 0, y1 = 0, n = 0;
    while (sp) {
      const p = stack[--sp];
      const x = p % w;
      const y = (p - x) / w;
      n++;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      const nb = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1];
      for (const q of nb) {
        if (q >= 0 && mask[q] && !seen[q]) {
          seen[q] = 1;
          stack[sp++] = q;
        }
      }
    }
    out.push({ x0, y0, x1, y1, n });
  }
  return out;
}

function dilate(mask: Uint8Array, w: number, h: number) {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const X = x + dx;
          const Y = y + dy;
          if (X >= 0 && X < w && Y >= 0 && Y < h) out[Y * w + X] = 1;
        }
    }
  return out;
}

/** Merge boxes that overlap or nearly touch (people split into pieces by the mask). */
function mergeBoxes(boxes: Box[], gap = 0.01) {
  const list = boxes.slice();
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        if (a.x - gap < b.x + b.w && b.x - gap < a.x + a.w && a.y - gap < b.y + b.h && b.y - gap < a.y + a.h) {
          const x = Math.min(a.x, b.x);
          const y = Math.min(a.y, b.y);
          const m = { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
          // only merge fragments of one object — not two neighbours that would make a mostly-empty box
          if (m.w * m.h > 1.8 * (a.w * a.h + b.w * b.h)) continue;
          list[i] = m;
          list.splice(j, 1);
          merged = true;
          break outer;
        }
      }
  }
  return list;
}

export class PreviewEngine {
  private bg: Float32Array | null = null;
  private tracks: Track[] = [];
  private nextId = 1;
  private lastT = -1;

  constructor(
    private seed: string,
    /** all classes the capability can emit (labels are assigned from this list) */
    private allClasses: string[],
    private alpha = 0.05,
  ) {}

  reset() {
    this.bg = null;
    this.tracks = [];
    this.nextId = 1;
    this.lastT = -1;
  }

  private gray(img: ImageData) {
    const d = img.data;
    const g = new Float32Array(img.width * img.height);
    for (let i = 0, j = 0; j < g.length; i += 4, j++) g[j] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    return g;
  }

  private motionBoxes(g: Float32Array, w: number, h: number, p: PreviewParams): Box[] {
    if (!this.bg || this.bg.length !== g.length) {
      this.bg = g.slice();
      return [];
    }
    const thr = 70 - p.sensitivity * 0.55;
    const mask = new Uint8Array(g.length);
    let on = 0;
    for (let i = 0; i < g.length; i++) {
      const diff = Math.abs(g[i] - this.bg[i]);
      if (diff > thr) {
        mask[i] = 1;
        on++;
      }
      this.bg[i] += this.alpha * (g[i] - this.bg[i]);
    }
    // scene cut / camera pan: adopt the new frame as background
    if (on / g.length > 0.45) {
      this.bg = g.slice();
      return [];
    }
    return this.toBoxes(dilate(dilate(mask, w, h), w, h), w, h, p);
  }

  private stillBoxes(g: Float32Array, w: number, h: number, p: PreviewParams): Box[] {
    // gradient magnitude, then cells whose energy stands out from the frame
    const grad = new Float32Array(g.length);
    for (let y = 1; y < h - 1; y++)
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        grad[i] = Math.abs(g[i + 1] - g[i - 1]) + Math.abs(g[i + w] - g[i - w]);
      }
    const C = 5;
    const cw = Math.floor(w / C);
    const ch = Math.floor(h / C);
    const cells = new Float32Array(cw * ch);
    for (let cy = 0; cy < ch; cy++)
      for (let cx = 0; cx < cw; cx++) {
        let s = 0;
        for (let y = 0; y < C; y++) for (let x = 0; x < C; x++) s += grad[(cy * C + y) * w + cx * C + x];
        cells[cy * cw + cx] = s / (C * C);
      }
    let mean = 0;
    for (const v of cells) mean += v;
    mean /= cells.length;
    let sd = 0;
    for (const v of cells) sd += (v - mean) ** 2;
    sd = Math.sqrt(sd / cells.length) || 1;
    const k = 1.8 - p.sensitivity / 100;
    const mask = new Uint8Array(cells.length);
    for (let i = 0; i < cells.length; i++) mask[i] = cells[i] > mean + k * sd ? 1 : 0;
    return this.toBoxes(dilate(mask, cw, ch), cw, ch, p);
  }

  private toBoxes(mask: Uint8Array, w: number, h: number, p: PreviewParams): Box[] {
    const raw = components(mask, w, h)
      .filter((c) => c.n >= 3)
      .map((c) => ({ x: c.x0 / w, y: c.y0 / h, w: (c.x1 - c.x0 + 1) / w, h: (c.y1 - c.y0 + 1) / h }));
    return mergeBoxes(raw)
      .filter((b) => b.w * b.h * 100 >= p.minSize && b.w * b.h < 0.4)
      .sort((a, b) => b.w * b.h - a.w * a.h)
      .slice(0, 12);
  }

  /**
   * Analyze one downsampled frame.
   * @param t media time (seconds) — or wall-clock seconds for live streams / stills
   */
  step(img: ImageData, t: number, p: PreviewParams, mode: "motion" | "still" = "motion") {
    if (this.lastT >= 0 && t < this.lastT - 0.25) this.reset(); // looped / seeked back
    this.lastT = t;
    const g = this.gray(img);
    const boxes = mode === "still" ? this.stillBoxes(g, img.width, img.height, p) : this.motionBoxes(g, img.width, img.height, p);

    // associate
    const used = new Set<number>();
    for (const tr of this.tracks) {
      let best = -1;
      let score = 0;
      boxes.forEach((b, i) => {
        if (used.has(i)) return;
        const s = iou(tr.box, b);
        const dx = tr.box.x + tr.box.w / 2 - (b.x + b.w / 2);
        const dy = tr.box.y + tr.box.h / 2 - (b.y + b.h / 2);
        const near = Math.hypot(dx, dy) < 0.1 ? 0.12 : 0;
        if (Math.max(s, near) > score) {
          score = Math.max(s, near);
          best = i;
        }
      });
      if (best >= 0 && score > 0.1) {
        used.add(best);
        const b = boxes[best];
        const k = 0.55;
        tr.box = { x: tr.box.x + (b.x - tr.box.x) * k, y: tr.box.y + (b.y - tr.box.y) * k, w: tr.box.w + (b.w - tr.box.w) * k, h: tr.box.h + (b.h - tr.box.h) * k };
        tr.hits++;
        tr.lastSeen = t;
      }
    }
    boxes.forEach((b, i) => {
      if (used.has(i) || this.allClasses.length === 0) return;
      const id = this.nextId++;
      const r = hash(`${this.seed}:${id}`);
      this.tracks.push({
        id,
        box: b,
        cls: this.allClasses[Math.floor(r * this.allClasses.length) % this.allClasses.length],
        base: 0.66 + hash(`${this.seed}:c:${id}`) * 0.32,
        hits: 1,
        firstSeen: t,
        lastSeen: t,
        roiSince: null,
        alerted: false,
      });
    });
    const linger = 0.8;
    this.tracks = this.tracks.filter((tr) => t - tr.lastSeen <= linger);

    const detections: Detection[] = [];
    const events: EngineEvent[] = [];
    for (const tr of this.tracks) {
      if (tr.hits < 2 && mode === "motion") continue;
      const conf = Math.min(0.99, tr.base * (0.86 + 0.14 * Math.min(1, tr.hits / 8)) + Math.sin(t * 3 + tr.id) * 0.012);
      if (conf < p.threshold || !p.classes.includes(tr.cls)) continue;
      const inRoi = p.roi ? centerIn(tr.box, p.roi) : true;
      if (inRoi) {
        tr.roiSince ??= t;
        if (!tr.alerted && t - tr.roiSince >= p.dwell) {
          tr.alerted = true;
          events.push({ id: `${tr.id}-${Math.round(t * 1000)}`, trackId: tr.id, cls: tr.cls, conf: Math.round(conf * 100) / 100, box: { ...tr.box }, t });
        }
      } else tr.roiSince = null;
      detections.push({ id: tr.id, cls: tr.cls, conf: Math.round(conf * 100) / 100, box: { ...tr.box }, inRoi, alerted: tr.alerted });
    }
    return { detections, events };
  }
}

/** Area of `el` actually covered by media under object-fit: contain. */
export function containRect(boxW: number, boxH: number, mediaW: number, mediaH: number) {
  if (!mediaW || !mediaH) return { x: 0, y: 0, w: boxW, h: boxH };
  const s = Math.min(boxW / mediaW, boxH / mediaH);
  const w = mediaW * s;
  const h = mediaH * s;
  return { x: (boxW - w) / 2, y: (boxH - h) / 2, w, h };
}

export const ROI_PRESETS: Record<string, Box | null> = {
  full: null,
  left: { x: 0, y: 0, w: 0.5, h: 1 },
  right: { x: 0.5, y: 0, w: 0.5, h: 1 },
  center: { x: 0.2, y: 0.2, w: 0.6, h: 0.6 },
  bottom: { x: 0, y: 0.5, w: 1, h: 0.5 },
};
