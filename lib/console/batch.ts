import { ANALYSIS_H, ANALYSIS_W, PreviewEngine, type EngineEvent, type PreviewParams } from "./engine";

/* Blob URLs still being read by a running job; revoking them early would break seeking. */
const inUse = new Map<string, number>();
const deferred = new Set<string>();

/** Revoke an object URL now, or once the jobs reading it have finished. */
export function releaseObjectUrl(url: string) {
  if (inUse.get(url)) deferred.add(url);
  else URL.revokeObjectURL(url);
}

function retain(url: string) {
  inUse.set(url, (inUse.get(url) ?? 0) + 1);
}

function release(url: string) {
  const n = (inUse.get(url) ?? 1) - 1;
  if (n > 0) return void inUse.set(url, n);
  inUse.delete(url);
  if (deferred.delete(url)) URL.revokeObjectURL(url);
}

export interface BatchResult {
  duration: number;
  frames: number;
  detections: number;
  events: EngineEvent[];
  byClass: Record<string, number>;
}

/**
 * Process a whole video in the browser by seeking through it at `step` seconds.
 * Used by playground batch jobs; the hosted API does the same server-side.
 */
export async function analyzeVideo(
  src: string,
  opts: { params: PreviewParams; classes: string[]; seed: string; step?: number; crossOrigin?: boolean },
  onProgress: (p: number) => void,
  signal?: AbortSignal,
): Promise<BatchResult> {
  retain(src);
  try {
    return await run(src, opts, onProgress, signal);
  } finally {
    release(src);
  }
}

async function run(
  src: string,
  opts: { params: PreviewParams; classes: string[]; seed: string; step?: number; crossOrigin?: boolean },
  onProgress: (p: number) => void,
  signal?: AbortSignal,
): Promise<BatchResult> {
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  if (opts.crossOrigin) video.crossOrigin = "anonymous";
  video.src = src;

  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error("load"));
  });

  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  if (!duration) throw new Error("duration");
  const step = opts.step ?? 0.25;
  const canvas = document.createElement("canvas");
  canvas.width = ANALYSIS_W;
  canvas.height = ANALYSIS_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const engine = new PreviewEngine(opts.seed, opts.classes, 0.2);

  const events: EngineEvent[] = [];
  const seen = new Set<number>();
  const byClass: Record<string, number> = {};
  let frames = 0;

  const seek = (t: number) =>
    new Promise<void>((resolve, reject) => {
      const done = () => {
        video.removeEventListener("seeked", done);
        resolve();
      };
      video.addEventListener("seeked", done);
      video.onerror = () => reject(new Error("seek"));
      video.currentTime = t;
    });

  for (let t = 0; t < duration; t += step) {
    if (signal?.aborted) throw new Error("aborted");
    await seek(t);
    ctx.drawImage(video, 0, 0, ANALYSIS_W, ANALYSIS_H);
    const img = ctx.getImageData(0, 0, ANALYSIS_W, ANALYSIS_H); // throws on CORS-tainted media
    const { detections, events: ev } = engine.step(img, t, opts.params);
    frames++;
    for (const d of detections) {
      if (seen.has(d.id)) continue;
      seen.add(d.id);
      byClass[d.cls] = (byClass[d.cls] ?? 0) + 1;
    }
    events.push(...ev);
    onProgress(Math.min(0.99, t / duration));
  }
  video.removeAttribute("src");
  video.load();
  onProgress(1);
  return { duration, frames, detections: seen.size, events, byClass };
}
