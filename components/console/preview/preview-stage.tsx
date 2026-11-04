"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { Camera, Eye, EyeOff, Maximize, Pause, Play, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { ANALYSIS_H, ANALYSIS_W, PreviewEngine, Stabilizer, containRect, type Box, type Detection, type EngineEvent, type PreviewParams } from "@/lib/console/engine";

export type StageMode = "detect" | "enhance" | "stabilize" | "none";

export interface StageRender {
  /** enhance: CSS filter applied to the processed side */
  filter?: string;
  /** stabilize: 0–100 */
  strength?: number;
  /** stabilize: crop margin, % */
  crop?: number;
  /** split labels: [left, right] */
  labels?: [string, string];
}

export interface MotionSample {
  raw: { x: number; y: number };
  smooth: { x: number; y: number };
}

export type StageInput =
  | { kind: "video"; src: string; label: string; crossOrigin?: boolean; live?: boolean }
  | { kind: "image"; src: string; label: string }
  | { kind: "webcam"; label: string };

export interface FrameStats {
  detections: Detection[];
  fps: number;
  latency: number;
  t: number;
  width: number;
  height: number;
}

export interface StageEvent extends EngineEvent {
  thumb: string;
  wall: number;
}

type StageError = "load" | "cors" | "camDenied" | "camMissing" | "insecure" | null;

const MONO = "'JetBrains Mono Variable', ui-monospace, monospace";

function fmtTime(s: number) {
  if (!Number.isFinite(s)) return "--:--";
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

/**
 * Plays any input (clip, upload, image, webcam, simulated camera stream), runs the preview engine on
 * it and draws detections, ROI and privacy blur on an overlay canvas.
 */
export function PreviewStage({
  input,
  params,
  classes,
  seed,
  labelFor,
  onFrame,
  onEvent,
  roiEditing = false,
  onRoiChange,
  className,
  empty,
  mode = "detect",
  render,
  onMotion,
}: {
  mode?: StageMode;
  render?: StageRender;
  onMotion?: (m: MotionSample) => void;
  input: StageInput | null;
  params: PreviewParams;
  /** every class the capability emits */
  classes: string[];
  seed: string;
  labelFor: (cls: string) => string;
  onFrame?: (s: FrameStats) => void;
  onEvent?: (e: StageEvent) => void;
  roiEditing?: boolean;
  onRoiChange?: (roi: Box | null) => void;
  className?: string;
  empty?: React.ReactNode;
}) {
  const t = useTranslations("console.stage");
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PreviewEngine | null>(null);
  const detsRef = useRef<Detection[]>([]);
  const draftRef = useRef<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const paramsRef = useRef(params);
  const cbRef = useRef({ onFrame, onEvent, labelFor, onMotion });
  const renderRef = useRef(render);
  const stabRef = useRef(new Stabilizer());
  const corrRef = useRef({ x: 0, y: 0 });
  const splitRef = useRef(0.5);
  const [split, setSplit] = useState(0.5);
  const compare = mode === "enhance" || mode === "stabilize";
  const [error, setError] = useState<StageError>(null);
  const [playing, setPlaying] = useState(false);
  const [overlay, setOverlay] = useState(true);
  const [time, setTime] = useState({ cur: 0, dur: 0 });

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);
  useEffect(() => {
    cbRef.current = { onFrame, onEvent, labelFor, onMotion };
  }, [onFrame, onEvent, labelFor, onMotion]);
  useEffect(() => {
    renderRef.current = render;
  }, [render]);
  useEffect(() => {
    splitRef.current = split;
  }, [split]);

  const classKey = classes.join("|");
  useEffect(() => {
    engineRef.current = new PreviewEngine(seed, classKey ? classKey.split("|") : []);
    detsRef.current = [];
    stabRef.current.reset();
    corrRef.current = { x: 0, y: 0 };
    setError(null);
  }, [seed, classKey, input]);

  // webcam lifecycle
  useEffect(() => {
    if (input?.kind !== "webcam") return;
    const video = videoRef.current;
    let stream: MediaStream | null = null;
    let cancelled = false;
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError("insecure");
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      .then((s) => {
        if (cancelled) return s.getTracks().forEach((tr) => tr.stop());
        stream = s;
        if (video) {
          video.srcObject = s;
          video.play().catch(() => {});
        }
      })
      .catch((e: DOMException) => setError(e.name === "NotFoundError" || e.name === "OverconstrainedError" ? "camMissing" : "camDenied"));
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((tr) => tr.stop());
      if (video) video.srcObject = null;
    };
  }, [input]);

  // autoplay clips (not under reduced motion — the user presses play)
  useEffect(() => {
    const v = videoRef.current;
    if (!v || input?.kind !== "video") return;
    if (!reduce) v.play().catch(() => {});
  }, [input, reduce]);

  const mediaEl = useCallback((): HTMLVideoElement | HTMLImageElement | null => {
    if (!input) return null;
    return input.kind === "image" ? imgRef.current : videoRef.current;
  }, [input]);

  const mediaSize = useCallback(() => {
    const el = mediaEl();
    if (!el) return { w: 0, h: 0 };
    return el instanceof HTMLVideoElement ? { w: el.videoWidth, h: el.videoHeight } : { w: el.naturalWidth, h: el.naturalHeight };
  }, [mediaEl]);

  // analysis + drawing loop
  useEffect(() => {
    if (!input) return;
    const analysis = document.createElement("canvas");
    analysis.width = ANALYSIS_W;
    analysis.height = ANALYSIS_H;
    const actx = analysis.getContext("2d", { willReadFrequently: true })!;
    const thumb = document.createElement("canvas");
    thumb.width = 192;
    thumb.height = 108;
    const tctx = thumb.getContext("2d")!;
    let raf = 0;
    let lastRun = 0;
    let frames = 0;
    let fpsWindow = performance.now();
    let fps = 0;
    let latency = 0;
    let tainted = false;
    let lastTimeUi = 0;

    const draw = () => {
      const canvas = overlayRef.current;
      const el = mediaEl();
      if (!canvas || !el) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
      }
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      const { w: mw, h: mh } = mediaSize();
      if (!mw) return;
      const r = containRect(cw, ch, mw, mh);
      const p = paramsRef.current;
      const toPx = (b: Box) => ({ x: r.x + b.x * r.w, y: r.y + b.y * r.h, w: b.w * r.w, h: b.h * r.h });

      if (mode === "enhance" || mode === "stabilize") {
        const sx = r.x + r.w * splitRef.current;
        const rd = renderRef.current ?? {};
        ctx.save();
        ctx.beginPath();
        ctx.rect(sx, r.y, r.x + r.w - sx, r.h);
        ctx.clip();
        ctx.fillStyle = "#000";
        ctx.fillRect(sx, r.y, r.x + r.w - sx, r.h);
        if (mode === "enhance") {
          ctx.filter = rd.filter ?? "none";
          ctx.drawImage(el, r.x, r.y, r.w, r.h);
        } else {
          const zoom = 1 + (rd.crop ?? 8) / 100;
          const c = corrRef.current;
          const max = (zoom - 1) / 2;
          const dx = Math.max(-max, Math.min(max, c.x));
          const dy = Math.max(-max, Math.min(max, c.y));
          ctx.translate(r.x + r.w / 2 + dx * r.w, r.y + r.h / 2 + dy * r.h);
          ctx.scale(zoom, zoom);
          ctx.drawImage(el, -r.w / 2, -r.h / 2, r.w, r.h);
        }
        ctx.restore();
        ctx.fillStyle = "#22d3ee";
        ctx.fillRect(sx - 1, r.y, 2, r.h);
        ctx.beginPath();
        ctx.arc(sx, r.y + r.h / 2, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = `10px ${MONO}`;
        const lbl = (txt: string, x: number, align: CanvasTextAlign) => {
          const w = ctx.measureText(txt).width + 10;
          const x0 = align === "left" ? x : x - w;
          ctx.fillStyle = "rgba(7,9,12,0.75)";
          ctx.fillRect(x0, r.y + r.h - 24, w, 16);
          ctx.fillStyle = "#e8edf2";
          ctx.fillText(txt, x0 + 5, r.y + r.h - 12);
        };
        if (splitRef.current > 0.12) lbl(rd.labels?.[0] ?? "", r.x + 8, "left");
        if (splitRef.current < 0.88) lbl(rd.labels?.[1] ?? "", r.x + r.w - 8, "right");
        return;
      }
      if (mode === "none") return;

      // privacy blur is applied even with the overlay hidden — it's a data-protection setting
      if (p.privacy) {
        for (const d of detsRef.current) {
          const b = toPx(d.box);
          ctx.save();
          ctx.beginPath();
          ctx.rect(b.x, b.y, b.w, b.h);
          ctx.clip();
          ctx.filter = "blur(14px)";
          ctx.drawImage(el, r.x, r.y, r.w, r.h);
          ctx.restore();
        }
      }

      const roi = draftRef.current
        ? {
            x: Math.min(draftRef.current.x0, draftRef.current.x1),
            y: Math.min(draftRef.current.y0, draftRef.current.y1),
            w: Math.abs(draftRef.current.x1 - draftRef.current.x0),
            h: Math.abs(draftRef.current.y1 - draftRef.current.y0),
          }
        : p.roi;
      if (roi && (overlay || roiEditing)) {
        const b = toPx(roi);
        ctx.fillStyle = "rgba(7,9,12,0.45)";
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.w, r.h);
        ctx.rect(b.x, b.y, b.w, b.h);
        ctx.fill("evenodd");
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
        ctx.setLineDash([]);
        ctx.font = `10px ${MONO}`;
        ctx.fillStyle = "#f59e0b";
        ctx.fillText("ROI", b.x + 4, b.y + 12);
      }

      if (!overlay) return;
      ctx.font = `11px ${MONO}`;
      for (const d of detsRef.current) {
        const b = toPx(d.box);
        const color = d.alerted ? "#f59e0b" : d.inRoi ? "#22d3ee" : "rgba(154,164,175,0.8)";
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
        // corner ticks — the site's bounding-box motif
        const k = Math.min(10, b.w / 3, b.h / 3);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + k); ctx.lineTo(b.x, b.y); ctx.lineTo(b.x + k, b.y);
        ctx.moveTo(b.x + b.w - k, b.y); ctx.lineTo(b.x + b.w, b.y); ctx.lineTo(b.x + b.w, b.y + k);
        ctx.moveTo(b.x, b.y + b.h - k); ctx.lineTo(b.x, b.y + b.h); ctx.lineTo(b.x + k, b.y + b.h);
        ctx.moveTo(b.x + b.w - k, b.y + b.h); ctx.lineTo(b.x + b.w, b.y + b.h); ctx.lineTo(b.x + b.w, b.y + b.h - k);
        ctx.stroke();
        const label = `${cbRef.current.labelFor(d.cls)} ${d.conf.toFixed(2)} #${d.id}`;
        const tw = ctx.measureText(label).width + 8;
        const ly = b.y > 16 ? b.y - 16 : b.y;
        ctx.fillStyle = color;
        ctx.fillRect(b.x, ly, tw, 16);
        ctx.fillStyle = "#041016";
        ctx.fillText(label, b.x + 4, ly + 12);
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const el = mediaEl();
      const engine = engineRef.current;
      if (!el || !engine) return;
      const isVideo = el instanceof HTMLVideoElement;
      const ready = isVideo ? el.readyState >= 2 && el.videoWidth > 0 : el.complete && el.naturalWidth > 0;
      const p = paramsRef.current;

      if (isVideo && now - lastTimeUi > 250) {
        lastTimeUi = now;
        setTime({ cur: el.currentTime, dur: el.duration });
      }

      const due = now - lastRun >= 1000 / Math.max(1, p.sampleFps);
      const active = isVideo ? !el.paused && !el.ended : true;
      if (mode === "stabilize" && ready && active && !tainted) {
        try {
          actx.drawImage(el, 0, 0, ANALYSIS_W, ANALYSIS_H);
          const t0 = performance.now();
          corrRef.current = stabRef.current.step(actx.getImageData(0, 0, ANALYSIS_W, ANALYSIS_H), renderRef.current?.strength ?? 70);
          latency = performance.now() - t0;
          frames++;
          if (now - fpsWindow >= 1000) {
            fps = (frames * 1000) / (now - fpsWindow);
            frames = 0;
            fpsWindow = now;
          }
          if (now - lastRun > 100) {
            lastRun = now;
            const st = stabRef.current;
            cbRef.current.onMotion?.({ raw: { ...st.raw }, smooth: { ...st.smooth } });
            const { w, h } = mediaSize();
            cbRef.current.onFrame?.({ detections: [], fps, latency, t: isVideo ? el.currentTime : now / 1000, width: w, height: h });
          }
        } catch (e) {
          if ((e as DOMException).name === "SecurityError") {
            tainted = true;
            setError("cors");
          }
        }
      }
      if (mode === "detect" && ready && due && active && !tainted) {
        lastRun = now;
        const t0 = performance.now();
        try {
          actx.drawImage(el, 0, 0, ANALYSIS_W, ANALYSIS_H);
          const img = actx.getImageData(0, 0, ANALYSIS_W, ANALYSIS_H);
          const mt = isVideo && input.kind === "video" && !input.live ? el.currentTime : now / 1000;
          const { detections, events } = engine.step(img, mt, p, input.kind === "image" ? "still" : "motion");
          detsRef.current = detections;
          latency = performance.now() - t0;
          frames++;
          if (now - fpsWindow >= 1000) {
            fps = (frames * 1000) / (now - fpsWindow);
            frames = 0;
            fpsWindow = now;
          }
          const { w, h } = mediaSize();
          cbRef.current.onFrame?.({ detections, fps, latency, t: mt, width: w, height: h });
          for (const ev of events) {
            tctx.drawImage(el, 0, 0, 192, 108);
            tctx.strokeStyle = "#f59e0b";
            tctx.lineWidth = 2;
            tctx.strokeRect(ev.box.x * 192, ev.box.y * 108, ev.box.w * 192, ev.box.h * 108);
            cbRef.current.onEvent?.({ ...ev, thumb: thumb.toDataURL("image/jpeg", 0.7), wall: Date.now() });
          }
        } catch (e) {
          if ((e as DOMException).name === "SecurityError") {
            tainted = true;
            setError("cors");
          }
        }
      }
      draw();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [input, mediaEl, mediaSize, overlay, roiEditing, mode]);

  /* ---------- ROI drawing ---------- */
  const toNorm = (e: React.PointerEvent) => {
    const canvas = overlayRef.current!;
    const rect = canvas.getBoundingClientRect();
    const { w, h } = mediaSize();
    const r = containRect(rect.width, rect.height, w, h);
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    return { x: clamp((e.clientX - rect.left - r.x) / r.w), y: clamp((e.clientY - rect.top - r.y) / r.h) };
  };
  const dragSplit = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    if (compare) {
      dragSplit.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setSplit(toNorm(e).x);
      return;
    }
    if (!roiEditing) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toNorm(e);
    draftRef.current = { x0: p.x, y0: p.y, x1: p.x, y1: p.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragSplit.current) return setSplit(toNorm(e).x);
    if (!draftRef.current) return;
    const p = toNorm(e);
    draftRef.current = { ...draftRef.current, x1: p.x, y1: p.y };
  };
  const onPointerUp = () => {
    dragSplit.current = false;
    const d = draftRef.current;
    draftRef.current = null;
    if (!d) return;
    const box = { x: Math.min(d.x0, d.x1), y: Math.min(d.y0, d.y1), w: Math.abs(d.x1 - d.x0), h: Math.abs(d.y1 - d.y0) };
    onRoiChange?.(box.w > 0.03 && box.h > 0.03 ? box : null);
  };

  /* ---------- controls ---------- */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const snapshot = () => {
    const el = mediaEl();
    const ov = overlayRef.current;
    if (!el || !ov) return;
    const { w, h } = mediaSize();
    if (!w) return;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(el, 0, 0, w, h);
    // overlay canvas covers the letterboxed area — crop it back to the media rect
    const r = containRect(ov.width, ov.height, w, h);
    ctx.drawImage(ov, r.x, r.y, r.w, r.h, 0, 0, w, h);
    try {
      const a = document.createElement("a");
      a.href = c.toDataURL("image/png");
      a.download = `sightai-snapshot-${Date.now()}.png`;
      a.click();
    } catch {
      setError("cors");
    }
  };

  const fullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  };

  const isVideo = input?.kind === "video";
  const isLive = input?.kind === "webcam" || (input?.kind === "video" && input.live);

  return (
    <div ref={wrapRef} className={cn("flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-black", className)}>
      <div className="relative aspect-video w-full">
        {!input && <div className="absolute inset-0 grid place-items-center p-6 text-center">{empty}</div>}
        {input && input.kind !== "image" && (
          <video
            key={input.kind === "video" ? input.src : "webcam"}
            ref={videoRef}
            src={input.kind === "video" ? input.src : undefined}
            crossOrigin={input.kind === "video" && input.crossOrigin ? "anonymous" : undefined}
            muted
            loop={input.kind === "video"}
            playsInline
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => input.kind === "video" && setError("load")}
            aria-label={input.label}
            className="absolute inset-0 size-full object-contain"
          />
        )}
        {input?.kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element -- user-supplied blob URL, analyzed on a canvas
          <img key={input.src} ref={imgRef} src={input.src} alt={input.label} onError={() => setError("load")} className="absolute inset-0 size-full object-contain" />
        )}
        {input && (
          <canvas
            ref={overlayRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-hidden
            className={cn("absolute inset-0 size-full touch-none", roiEditing && "cursor-crosshair", compare && "cursor-ew-resize")}
          />
        )}
        {input && (
          <span className="pointer-events-none absolute left-3 top-3 inline-flex max-w-[60%] items-center gap-1.5 rounded-full bg-[#07090c]/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur">
            {isLive && <span className="size-1.5 animate-[blink_1.6s_steps(1)_infinite] rounded-full bg-danger" aria-hidden />}
            <span className="truncate">{isLive ? `${t("live")} · ${input.label}` : input.label}</span>
          </span>
        )}
        {roiEditing && (
          <span className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-warn/90 px-3 py-1 text-xs font-medium text-black">{t("roiHint")}</span>
        )}
        {error && (
          <div role="alert" className="absolute inset-x-3 bottom-3 flex items-start gap-2 rounded-[8px] border border-warn/40 bg-[#07090c]/90 p-3 text-xs text-text-1">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
            {t(`errors.${error}`)}
          </div>
        )}
      </div>

      {input && (
        <div className="flex flex-wrap items-center gap-1 border-t border-line bg-bg-1 px-2 py-1.5">
          {isVideo && (
            <button type="button" onClick={togglePlay} aria-label={playing ? t("pause") : t("play")} className="grid size-9 place-items-center rounded-md text-text-1 hover:bg-bg-2">
              {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            </button>
          )}
          {isVideo && !isLive && (
            <>
              <input
                type="range"
                min={0}
                max={Number.isFinite(time.dur) ? time.dur : 0}
                step={0.05}
                value={time.cur}
                aria-label={t("seek")}
                onChange={(e) => {
                  if (videoRef.current) videoRef.current.currentTime = +e.target.value;
                }}
                className="mx-1 min-w-24 flex-1 accent-[var(--accent)]"
              />
              <span className="px-1 font-mono text-[11px] tabular text-text-3">
                {fmtTime(time.cur)} / {fmtTime(time.dur)}
              </span>
            </>
          )}
          {!(isVideo && !isLive) && <span className="flex-1" />}
          {compare && (
            <label className="flex items-center gap-1.5 px-1 text-[11px] text-text-3">
              {t("compare")}
              <input type="range" min={0} max={1} step={0.01} value={split} onChange={(e) => setSplit(+e.target.value)} className="w-20 accent-[var(--accent)]" />
            </label>
          )}
          <button
            type="button"
            hidden={mode !== "detect"}
            onClick={() => setOverlay((o) => !o)}
            aria-pressed={overlay}
            aria-label={t("overlay")}
            title={t("overlay")}
            className="grid size-9 place-items-center rounded-md text-text-2 hover:bg-bg-2 hover:text-text-1"
          >
            {overlay ? <Eye className="size-4" aria-hidden /> : <EyeOff className="size-4" aria-hidden />}
          </button>
          <button type="button" onClick={snapshot} aria-label={t("snapshot")} title={t("snapshot")} className="grid size-9 place-items-center rounded-md text-text-2 hover:bg-bg-2 hover:text-text-1">
            <Camera className="size-4" aria-hidden />
          </button>
          <button type="button" onClick={fullscreen} aria-label={t("fullscreen")} title={t("fullscreen")} className="grid size-9 place-items-center rounded-md text-text-2 hover:bg-bg-2 hover:text-text-1">
            <Maximize className="size-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
