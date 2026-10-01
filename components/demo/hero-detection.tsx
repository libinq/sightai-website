"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Hero "live detection" monitor.
 * Draws a procedural road scene (stand-in for a real survey video) and overlays detections
 * read from /media/data/hero-frames.json. To use real footage, pass `videoSrc` and replace the JSON
 * with model output in the same schema — the overlay code does not change.
 */

type Box = [id: number, cls: number, conf: number, x: number, y: number, w: number, h: number];
interface FrameData {
  fps: number;
  classes: string[];
  frames: Box[][];
}

// Must match scripts/gen-hero-frames.mjs
const ROAD_SPEED = 8;
const HORIZON = 0.4;
const Z_NEAR = 4;
const LAT = 0.9;
const LOOP_S = 8;

export interface HeroDetectionLabels {
  live: string;
  camera: string;
  latency: string;
  objects: string;
  simulated: string;
  canvasLabel: string;
}

function readTokens(el: Element) {
  const cs = getComputedStyle(el);
  const v = (n: string, fb: string) => cs.getPropertyValue(n).trim() || fb;
  return {
    accent: v("--accent", "#22D3EE"),
    warn: v("--warn", "#F59E0B"),
    danger: v("--danger", "#F43F5E"),
    ok: v("--accent-2", "#A3E635"),
  };
}

function makeNoise(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = n;
    img.data[i + 3] = 22;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/** deterministic pseudo-random for stable crack shapes */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function HeroDetection({
  labels,
  className,
  videoSrc,
}: {
  labels: HeroDetectionLabels;
  className?: string;
  videoSrc?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hud, setHud] = useState({ latency: 24, count: 0, counts: {} as Record<string, number> });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let data: FrameData | null = null;
    let ages: Map<number, number>[] = [];
    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;
    let lastHud = 0;
    const tokens = readTokens(wrap);
    const noise = makeNoise(128);
    const noisePattern = ctx.createPattern(noise, "repeat");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lowEnd =
      (navigator.hardwareConcurrency ?? 8) <= 2 ||
      (nav.deviceMemory ?? 8) <= 2 ||
      nav.connection?.saveData === true;
    const staticMode = reduce || lowEnd;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (staticMode) draw(2.0);
    };

    const P = (x: number, z: number) => [
      (0.5 + (x * LAT) / z) * w,
      (HORIZON + ((1 - HORIZON) * Z_NEAR) / z) * h,
    ];

    const quad = (x0: number, x1: number, z0: number, z1: number) => {
      const a = P(x0, z0), b = P(x1, z0), c = P(x1, z1), d = P(x0, z1);
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.lineTo(c[0], c[1]);
      ctx.lineTo(d[0], d[1]);
      ctx.closePath();
    };

    const drawScene = (t: number) => {
      const hy = HORIZON * h;
      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, hy);
      sky.addColorStop(0, "#05070a");
      sky.addColorStop(1, "#1a222c");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, hy + 1);
      // distant ridge
      ctx.fillStyle = "#0c1117";
      ctx.beginPath();
      ctx.moveTo(0, hy);
      for (let i = 0; i <= 24; i++) {
        const x = (i / 24) * w;
        ctx.lineTo(x, hy - (8 + rand(i) * 26) * (h / 500));
      }
      ctx.lineTo(w, hy);
      ctx.fill();
      // ground
      const ground = ctx.createLinearGradient(0, hy, 0, h);
      ground.addColorStop(0, "#151a1f");
      ground.addColorStop(1, "#0b0e11");
      ctx.fillStyle = ground;
      ctx.fillRect(0, hy, w, h - hy);
      // road surface
      const road = ctx.createLinearGradient(0, hy, 0, h);
      road.addColorStop(0, "#3a4047");
      road.addColorStop(1, "#24282d");
      ctx.fillStyle = road;
      quad(-3.8, 3.8, Z_NEAR * 0.7, 400);
      ctx.fill();
      if (noisePattern) {
        ctx.save();
        quad(-3.8, 3.8, Z_NEAR * 0.7, 400);
        ctx.clip();
        ctx.fillStyle = noisePattern;
        ctx.fillRect(0, hy, w, h - hy);
        ctx.restore();
      }
      // edge lines
      ctx.fillStyle = "rgba(220,225,230,0.55)";
      quad(-3.45, -3.3, Z_NEAR * 0.7, 400);
      ctx.fill();
      quad(3.3, 3.45, Z_NEAR * 0.7, 400);
      ctx.fill();
      // center dashes (period 8 m, length 3 m)
      const off = (ROAD_SPEED * t) % 8;
      ctx.fillStyle = "rgba(235,238,240,0.7)";
      for (let k = 0; k < 20; k++) {
        const z0 = Z_NEAR * 0.7 + k * 8 - off;
        if (z0 + 3 < Z_NEAR * 0.7) continue;
        quad(-0.07, 0.07, Math.max(z0, Z_NEAR * 0.7), z0 + 3);
        ctx.fill();
      }
      // haze at horizon
      const haze = ctx.createLinearGradient(0, hy - 30, 0, hy + h * 0.12);
      haze.addColorStop(0, "rgba(34,211,238,0)");
      haze.addColorStop(0.5, "rgba(120,150,170,0.08)");
      haze.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, hy - 30, w, h * 0.2);
    };

    const drawDefect = (b: Box, classes: string[]) => {
      const [id, cls, , bx, by, bw, bh] = b;
      const x = bx * w, y = by * h, ww = bw * w, hh = bh * h;
      const name = classes[cls];
      ctx.save();
      if (name === "pothole") {
        ctx.fillStyle = "#121417";
        ctx.beginPath();
        ctx.ellipse(x + ww / 2, y + hh / 2, ww * 0.45, hh * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(90,96,104,0.9)";
        ctx.lineWidth = Math.max(1, ww * 0.04);
        ctx.stroke();
      } else if (name === "crack") {
        ctx.strokeStyle = "#0f1114";
        ctx.lineWidth = Math.max(1, Math.min(ww, hh) * 0.08);
        ctx.beginPath();
        const steps = 7;
        const vertical = hh > ww;
        for (let i = 0; i <= steps; i++) {
          const f = i / steps;
          const j = (rand(id * 31 + i) - 0.5) * (vertical ? ww : hh) * 0.6;
          const px = vertical ? x + ww / 2 + j : x + f * ww;
          const py = vertical ? y + f * hh : y + hh / 2 + j;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      } else if (name === "rutting") {
        ctx.fillStyle = "rgba(15,17,20,0.55)";
        ctx.fillRect(x + ww * 0.12, y, ww * 0.22, hh);
        ctx.fillRect(x + ww * 0.66, y, ww * 0.22, hh);
      } else if (name === "patch") {
        ctx.fillStyle = "#2c3036";
        ctx.fillRect(x + ww * 0.08, y + hh * 0.1, ww * 0.84, hh * 0.8);
        ctx.strokeStyle = "rgba(10,12,14,0.6)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + ww * 0.08, y + hh * 0.1, ww * 0.84, hh * 0.8);
      } else if (name === "marking_wear") {
        ctx.fillStyle = "rgba(235,238,240,0.22)";
        ctx.fillRect(x + ww * 0.3, y, ww * 0.4, hh);
      }
      ctx.restore();
    };

    const drawBox = (b: Box, age: number, classes: string[]) => {
      const [id, cls, conf, bx, by, bw, bh] = b;
      const name = classes[cls];
      const color = name === "pothole" ? tokens.warn : tokens.accent;
      const lock = Math.min(1, age / 8);
      const grow = 1 + (1 - lock) * 0.25;
      const cx = (bx + bw / 2) * w, cy = (by + bh / 2) * h;
      const ww = Math.max(bw * w * grow, 10), hh = Math.max(bh * h * grow, 10);
      const x = cx - ww / 2, y = cy - hh / 2;
      ctx.save();
      ctx.globalAlpha = 0.25 + lock * 0.75;
      // translucent fill + thin frame
      ctx.fillStyle = color + "14";
      ctx.fillRect(x, y, ww, hh);
      ctx.strokeStyle = color + "66";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, ww - 1, hh - 1);
      // corner brackets
      const c = Math.min(12, ww * 0.3, hh * 0.3);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y + c); ctx.lineTo(x, y); ctx.lineTo(x + c, y);
      ctx.moveTo(x + ww - c, y); ctx.lineTo(x + ww, y); ctx.lineTo(x + ww, y + c);
      ctx.moveTo(x + ww, y + hh - c); ctx.lineTo(x + ww, y + hh); ctx.lineTo(x + ww - c, y + hh);
      ctx.moveTo(x + c, y + hh); ctx.lineTo(x, y + hh); ctx.lineTo(x, y + hh - c);
      ctx.stroke();
      // label
      if (lock > 0.5 && ww > 18) {
        const fs = w < 520 ? 10 : 11;
        ctx.font = `500 ${fs}px "JetBrains Mono Variable", ui-monospace, monospace`;
        const text = `${name} ${conf.toFixed(2)}`;
        const tw = ctx.measureText(text).width + 10;
        const ly = y - fs - 8 < 0 ? y + hh + 2 : y - fs - 8;
        ctx.fillStyle = color;
        ctx.fillRect(x, ly, tw, fs + 6);
        ctx.fillStyle = "#041016";
        ctx.fillText(text, x + 5, ly + fs + 1);
        ctx.fillStyle = "rgba(232,237,242,0.55)";
        ctx.fillText(`#${String(id).padStart(4, "0")}`, x + tw + 4, ly + fs + 1);
      }
      ctx.restore();
    };

    function draw(t: number) {
      ctx.clearRect(0, 0, w, h);
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, w, h);
      } else {
        drawScene(t);
      }
      if (!data) return;
      const idx = Math.floor(t * data.fps) % data.frames.length;
      const boxes = data.frames[idx];
      if (!video || video.readyState < 2) boxes.forEach((b) => drawDefect(b, data!.classes));
      boxes.forEach((b) => drawBox(b, ages[idx].get(b[0]) ?? 99, data!.classes));
      // vignette
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      const now = performance.now();
      if (now - lastHud > 250 || staticMode) {
        lastHud = now;
        const counts: Record<string, number> = {};
        boxes.forEach((b) => (counts[data!.classes[b[1]]] = (counts[data!.classes[b[1]]] ?? 0) + 1));
        setHud({ latency: 21 + Math.round(rand(idx) * 7), count: boxes.length, counts });
      }
    }

    const start = performance.now();
    const loop = (now: number) => {
      if (visible && !document.hidden) draw(((now - start) / 1000) % LOOP_S);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      const v = videoRef.current;
      if (v) {
        if (visible) v.play().catch(() => {});
        else v.pause();
      }
    });
    io.observe(wrap);
    resize();

    fetch("/media/data/hero-frames.json")
      .then((r) => r.json())
      .then((d: FrameData) => {
        data = d;
        // age of each track in each frame (frames since first seen) — drives the lock-on animation
        ages = d.frames.map(() => new Map());
        const run = new Map<number, number>();
        for (let pass = 0; pass < 2; pass++) {
          d.frames.forEach((boxes, i) => {
            const present = new Set(boxes.map((b) => b[0]));
            for (const id of [...run.keys()]) if (!present.has(id)) run.delete(id);
            boxes.forEach((b) => {
              const a = (run.get(b[0]) ?? -1) + 1;
              run.set(b[0], a);
              ages[i].set(b[0], a);
            });
          });
        }
        setReady(true);
        if (staticMode) draw(2.0);
        else raf = requestAnimationFrame(loop);
      })
      .catch(() => {
        if (staticMode) draw(2.0);
        else raf = requestAnimationFrame(loop);
      });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const countEntries = Object.entries(hud.counts);

  return (
    <div
      ref={wrapRef}
      className={cn("relative overflow-hidden bg-[#07090c]", className)}
    >
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          loop
          preload="none"
          className="hidden"
          aria-hidden
        />
      )}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={labels.canvasLabel}
        className={cn("absolute inset-0 size-full transition-opacity duration-500", ready ? "opacity-100" : "opacity-60")}
      />
      {/* HUD — always light-on-dark since it sits on footage */}
      <div className="pointer-events-none absolute inset-0 font-mono text-[10px] text-[#e8edf2] sm:text-[11px]">
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded bg-black/55 px-2 py-1 backdrop-blur">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#f43f5e] opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-[#f43f5e]" />
          </span>
          <span className="uppercase tracking-wider">{labels.live}</span>
          <span className="text-[#9aa4af]">{labels.camera}</span>
        </div>
        <div className="absolute right-3 top-3 grid grid-cols-[auto_auto] gap-x-3 rounded bg-black/55 px-2 py-1 backdrop-blur tabular">
          <span className="text-[#9aa4af]">{labels.latency}</span>
          <span className="text-right text-[#22d3ee]">{hud.latency} ms</span>
          <span className="text-[#9aa4af]">{labels.objects}</span>
          <span className="text-right text-[#22d3ee]">{hud.count}</span>
        </div>
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {countEntries.map(([k, n]) => (
            <span key={k} className="rounded border border-white/15 bg-black/55 px-1.5 py-0.5 backdrop-blur">
              {k} <span className="text-[#22d3ee]">×{n}</span>
            </span>
          ))}
        </div>
        <div className="absolute bottom-3 right-3 rounded bg-black/55 px-1.5 py-0.5 text-[#5c6670] backdrop-blur">
          {labels.simulated} · 1920×1080 · 30 fps
        </div>
      </div>
    </div>
  );
}
