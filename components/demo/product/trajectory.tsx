"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrailScene } from "../scene-art";

const N = 600; // samples in the loop (20 s at 30 Hz)
const HZ = 30;
const WINDOW = 150; // samples shown in the curve

function rnd(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Simulated camera path (px): slow intentional pan + walking bob + high-frequency shake.
const RAW_X = Array.from({ length: N }, (_, i) => {
  const t = (i / N) * Math.PI * 2;
  return 18 * Math.sin(t) + 6 * Math.sin(t * 7) + (rnd(i) - 0.5) * 16 + 5 * Math.sin(t * 23);
});
const RAW_Y = Array.from({ length: N }, (_, i) => {
  const t = (i / N) * Math.PI * 2;
  return 8 * Math.sin(t * 2 + 1) + 7 * Math.sin(t * 14) + (rnd(i + 999) - 0.5) * 14;
});

/** Circular Gaussian smoothing — what an offline stabilizer does with the full trajectory. */
function smooth(src: number[], sigma: number) {
  if (sigma < 0.5) return src.slice();
  const r = Math.ceil(sigma * 3);
  const k = Array.from({ length: 2 * r + 1 }, (_, j) => Math.exp(-((j - r) ** 2) / (2 * sigma * sigma)));
  const ks = k.reduce((a, b) => a + b, 0);
  return src.map((_, i) => {
    let s = 0;
    for (let j = -r; j <= r; j++) s += src[(i + j + N) % N] * k[j + r];
    return s / ks;
  });
}

const rms = (a: number[], b: number[]) => Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0) / a.length);

export function TrajectoryDemo() {
  const t = useTranslations("demos.trajectory");
  const tc = useTranslations("demos");
  const [strength, setStrength] = useState(60);
  const [running, setRunning] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rawRef = useRef<HTMLDivElement>(null);
  const stabRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);

  const sigma = (strength / 100) * 22;
  const smX = useMemo(() => smooth(RAW_X, sigma), [sigma]);
  const smY = useMemo(() => smooth(RAW_Y, sigma), [sigma]);
  // residual high-frequency motion left after stabilization (what the viewer sees)
  const jitterRaw = useMemo(() => rms(RAW_X, smooth(RAW_X, 22)).toFixed(1), []);
  const jitterStab = useMemo(() => rms(smX, smooth(RAW_X, 22)).toFixed(1), [smX]);
  const crop = Math.round(4 + (strength / 100) * 8);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const css = getComputedStyle(canvas);
    const accent = css.getPropertyValue("--accent").trim() || "#22d3ee";
    const warn = css.getPropertyValue("--line-enhancement").trim() || "#fb923c";
    const grid = css.getPropertyValue("--line").trim() || "rgba(255,255,255,.08)";

    const draw = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = grid;
      ctx.lineWidth = 1;
      for (let y = 0; y <= 4; y++) {
        ctx.beginPath();
        ctx.moveTo(0, (h / 4) * y);
        ctx.lineTo(w, (h / 4) * y);
        ctx.stroke();
      }
      const i0 = idxRef.current;
      const plot = (arr: number[], color: string, width: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        for (let k = 0; k < WINDOW; k++) {
          const v = arr[(i0 - WINDOW + k + N * 2) % N];
          const x = (k / (WINDOW - 1)) * w;
          const y = h / 2 - (v / 40) * (h / 2);
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
      plot(RAW_X, warn, 1.5);
      plot(smX, accent, 2.5);

      // apply the same paths to the two views
      const i = i0 % N;
      // raw view follows the full shaky path; stabilized view follows only the smoothed path (damped)
      if (rawRef.current) rawRef.current.style.transform = `translate(${RAW_X[i]}px, ${RAW_Y[i]}px) scale(1.15)`;
      if (stabRef.current) stabRef.current.style.transform = `translate(${smX[i] * 0.35}px, ${smY[i] * 0.35}px) scale(${1.15 + crop / 400})`;
    };

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      if (running && visible && !document.hidden) {
        acc += dt;
        while (acc > 1000 / HZ) {
          idxRef.current = (idxRef.current + 1) % N;
          acc -= 1000 / HZ;
        }
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    if (reduce) {
      idxRef.current = WINDOW;
      draw();
    } else raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [smX, smY, running, crop]);

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          { ref: rawRef, label: t("raw"), color: "bg-[#fb923c]" },
          { ref: stabRef, label: t("stabilized"), color: "bg-[#22d3ee]" },
        ].map((v) => (
          <div key={v.label} className="relative aspect-video overflow-hidden rounded-md border border-line bg-black">
            <div ref={v.ref} className="absolute inset-0 will-change-transform">
              <TrailScene className="size-full" />
            </div>
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 opacity-70" aria-hidden>
              <path d="M50 0v38M50 62v38M0 50h38M62 50h38" stroke="#e8edf2" strokeWidth="2" />
            </svg>
            <span className={`absolute left-2 top-2 rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#041016] ${v.color}`}>{v.label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-[var(--radius-card)] border border-line bg-bg-1 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">{t("curve")}</p>
          <div className="flex items-center gap-4 font-mono text-[11px] text-text-3">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-enhancement" />
              {t("raw")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-accent" />
              {t("stabilized")}
            </span>
          </div>
        </div>
        <canvas ref={canvasRef} className="mt-3 h-40 w-full" role="img" aria-label={t("curveLabel")} />
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <label className="flex flex-col gap-2 text-sm">
            <span className="flex justify-between">
              {t("strength")}
              <span className="font-mono text-accent">{strength}</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
              className="h-11 w-full cursor-pointer accent-[var(--accent)]"
            />
          </label>
          <Button variant="secondary" size="sm" onClick={() => setRunning((r) => !r)}>
            {running ? <Pause aria-hidden /> : <Play aria-hidden />}
            {running ? tc("pause") : tc("play")}
          </Button>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-xs text-text-3">{t("rmsRaw")}</dt>
            <dd className="font-mono text-enhancement">{jitterRaw} px</dd>
          </div>
          <div>
            <dt className="text-xs text-text-3">{t("rmsStab")}</dt>
            <dd className="font-mono text-accent">{jitterStab} px</dd>
          </div>
          <div>
            <dt className="text-xs text-text-3">{t("crop")}</dt>
            <dd className="font-mono text-text-1">{crop}%</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
